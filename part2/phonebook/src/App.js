import { useState, useEffect } from "react";
import personService from "./services/persons";

const Notification = ({ message, color }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(true);
    const timeout = setTimeout(() => {
      setShow(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [message]);

  if (message === null || show === false) {
    return null;
  }

  const style = {
    color: color,
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return <div style={style}>{message}</div>;
};

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
  const [notification, setNotification] = useState({
    message: null,
    color: null,
  });

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber };
    const personFound = persons.find((it) => it.name === newName);

    if (personFound) {
      const confirmed = window.confirm(
        `${newName} is already added to phonebook, replace old number with a new one?`
      );
      if (confirmed) {
        const changedPerson = { ...personFound, number: newPerson.number };
        personService
          .update(changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== returnedPerson.id ? p : returnedPerson
              )
            );
            setNotification({
              message: `Updated ${returnedPerson.name}`,
              color: "green",
            });
          })
          .catch(() => {
            setNotification({
              message: `Information of ${newPerson.name} has already been removed from server`,
              color: "red",
            });
          });
      }
    } else {
      personService.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNotification({
          message: `Added ${returnedPerson.name}`,
          color: "green",
        });
      });
    }
  };

  const deleteButtonClicked = (event) => {
    event.preventDefault();
    const id = event.target.value;
    const person = persons.find((person) => person.id === +id);
    if (window.confirm(`Delete ${person.name}?`)) {
      deletePerson(id);
    }
  };

  const deletePerson = (id) => {
    personService.remove(id).then(() => {
      const personsUpdated = persons.filter((person) => {
        return person.id !== +id;
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
      <Notification message={notification.message} color={notification.color} />
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
