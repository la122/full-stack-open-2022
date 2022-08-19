import { useState, useEffect } from "react";
import axios from "axios";

const Filter = ({ onChange }) => (
  <div>
    filter shown with <input onChange={onChange} />
  </div>
);

const PersonForm = ({ onNameChange, onNumberChange, onButtonClicked }) => (
  <form>
    <div>
      name: <input onChange={onNameChange} />
    </div>
    <div>
      number: <input onChange={onNumberChange} />
    </div>
    <div>
      <button type="submit" onClick={onButtonClicked}>
        add
      </button>
    </div>
  </form>
);

const PersonDetails = ({ name, number }) => (
  <div>
    {name} {number}
  </div>
);

const Persons = ({ persons }) => (
  <>
    {persons.map((person) => (
      <PersonDetails
        name={person.name}
        number={person.number}
        key={person.name}
      />
    ))}
  </>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setNewFilter] = useState("");

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  }, []);

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber };
    if (persons.some((it) => it.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(newPerson));
    }
  };

  const personsToShow =
    filter.length > 0
      ? persons.filter((person) =>
          person.name.toUpperCase().includes(filter.toUpperCase())
        )
      : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onChange={handleFilterChange} />

      <h2>add a new</h2>
      <PersonForm
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onButtonClicked={addPerson}
      />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  );
};

export default App;
