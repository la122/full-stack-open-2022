import { useState, useEffect } from "react";
import personService from "./services/persons";

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
  <>
    {name} {number}
  </>
);

const Persons = ({ persons, onDeleteClick }) => (
  <>
    {persons.map((person) => (
      <div key={person.id}>
        <PersonDetails name={person.name} number={person.number} />{" "}
        <button value={person.id} onClick={onDeleteClick}>
          delete
        </button>
      </div>
    ))}
  </>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setNewFilter] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
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
      personService.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
      });
    }
  };

  const deleteButtonClicked = (event) => {
    event.preventDefault();
    const id = event.target.value;
    const person = persons.find((person) => person.id === +id); // cast id to string
    if (window.confirm(`Delete ${person.name}?`)) {
      deletePerson(id);
    }
  };

  const deletePerson = (id) => {
    personService.remove(id).then(() => {
      const personsUpdated = persons.filter((person) => {
        return person.id !== +id; // cast id to string
      });
      setPersons(personsUpdated);
    });
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
      <Persons persons={personsToShow} onDeleteClick={deleteButtonClicked} />
    </div>
  );
};

export default App;
