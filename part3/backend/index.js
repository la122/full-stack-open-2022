const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${
      persons.length
    } people.</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post("/api/persons", (request, response) => {
  const person = request.body;
  console.log("creating", person);

  if (!person.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!person.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const found = persons.find((p) => p.name == person.name);
  if (found) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const generateId = () => {
    let attemps = 0;
    while (attemps++ < 100) {
      const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      if (!persons.some((p) => p.id === id)) {
        return id;
      }
    }
    throw "Could not generate unique id!";
  };

  person.id = generateId();

  persons = persons.concat(person);

  response.json(person);
});
