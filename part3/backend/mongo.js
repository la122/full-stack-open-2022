const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);
const url = `mongodb+srv://fullstack:${password}@cluster0.unku6c6.mongodb.net/persons?retryWrites=true&w=majority`;

if (process.argv.length === 3) {
  console.log("phonebook:");

  mongoose.connect(url).then(() => {
    Person.find({}).then((result) => {
      result.forEach(({ name, number }) => {
        console.log(`${name} ${number}`);
      });
      mongoose.connection.close();
    });
  });
}

if (process.argv.length === 4) {
  console.log("Please provide both name and number as an argument.");
  process.exit(1);
}

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  mongoose
    .connect(url)
    .then(() => {
      console.log("connected");

      const person = new Person({
        name: name,
        number: number,
      });

      return person.save();
    })
    .then((result) => {
      console.log(`added ${result.name} number ${result.number} to phonebook`);
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}
