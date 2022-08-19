import { useState, useEffect } from "react";
import axios from "axios";

const LanguageList = ({ languages }) => {
  return (
    <ul>
      {languages.map((language) => (
        <li key={language}>{language}</li>
      ))}
    </ul>
  );
};

const Country = ({ country }) => (
  <>
    <h2>{country.name.common}</h2>
    <div>capital {country.capital}</div>
    <div>area {country.area}</div>
    <h3>languages</h3>
    <LanguageList languages={Object.values(country.languages)} />
    <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
  </>
);

const CountryList = ({ countries }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length > 1) {
    return (
      <>
        {countries.map((country) => (
          <div key={country.name.common}>{country.name.common}</div>
        ))}
      </>
    );
  } else if (countries.length === 1) {
    return <Country country={countries[0]} />;
  }
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      console.log("promise fulfilled");
      setCountries(response.data);
    });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const countriesFiltered = countries.filter((country) =>
    country.name.common.toUpperCase().includes(filter.toUpperCase())
  );

  return (
    <div>
      <div>
        find countries <input onChange={handleFilterChange} />
      </div>
      <CountryList countries={countriesFiltered} />
    </div>
  );
};

export default App;
