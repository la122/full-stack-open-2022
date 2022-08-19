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

const Weather = ({ latitude, longitude }) => {
  const [weather, setWeather] = useState({
    temperatur: "?",
    windspeed: "?",
    iconCode: "01d",
  });

  const api_key = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    axios
      .get("https://api.openweathermap.org/data/2.5/weather", {
        params: {
          lat: latitude,
          lon: longitude,
          appid: api_key,
          units: "metric",
        },
      })
      .then(({ data }) => {
        console.log(data);
        setWeather({
          temperatur: data.main.LanguageListtemp,
          windspeed: data.wind.speed,
          iconCode: data.weather[0].icon,
        });
      });
  }, [latitude, longitude, api_key]);

  return (
    <>
      <div>tempature {weather.temperatur} Celsius</div>
      <img
        src={`http://openweathermap.org/img/wn/${weather.iconCode}@2x.png`}
        alt="Weather icon"
      ></img>
      <div>wind {weather.windspeed} m/s</div>
    </>
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

    <h2>Weather in {country.capital}</h2>
    <Weather latitude={country.latlng[0]} longitude={country.latlng[1]} />
  </>
);

const CountryList = ({ countries, onShowButtonClick }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length > 1) {
    return (
      <>
        {countries.map((country) => (
          <div key={country.name.common}>
            {country.name.common}{" "}
            <button value={country.name.common} onClick={onShowButtonClick}>
              show
            </button>
          </div>
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
      setCountries(response.data);
    });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleShowButtonClicked = (event) => {
    event.preventDefault();
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
      <CountryList
        countries={countriesFiltered}
        onShowButtonClick={handleShowButtonClicked}
      />
    </div>
  );
};

export default App;
