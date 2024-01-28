import React, { useState } from "react";
import "./Weather.css";
import axios from "axios";
import cities from "cities.json";

import search_icon from "../Assets/search.png";
import wind_icon from "../Assets/wind.png";
import humidity_icon from "../Assets/humidity.png";
//import question_mark from "../Assets/question-mark.png";
import { Navigate } from "react-router-dom";

const Weather = () => {
  let api_key = "e28b36a32d1041b6adbc18b037cc26e6";

  const [value, setValue] = useState("");

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const [data, setData] = useState({
    img: "question-mark",
    temp: "xx °C",
    location: "///////",
    humidity: "xx %",
    wind: "xx km/h",
  });

  const [err, setErr] = useState("");

  const search = () => {
    setErr("");
    // const inputValue = document.getElementsByClassName("cityInput");

    if (value === "") {
      return 0;
    }

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${value}&units=Metric&appid=${api_key}`;

    axios
      .get(url)
      .then((response) => {
        setData({
          img: response.data.weather[0].icon,
          temp: Math.round(response.data.main.temp) + "°C",
          location: response.data.name,
          humidity: Math.round(response.data.main.humidity) + "%",
          wind: Math.round(response.data.wind.speed) + "km/h",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          console.log(error);
          setErr("Invalid City Name, Please Try Agian!! ;)");
          return <Navigate to="/" />;
          // setValue("");

          // setData({
          //   img: question_mark,
          //   temp: "xx °C",
          //   location: "///////",
          //   humidity: "xx %",
          //   wind: "xx km/h",
          // });
        }
      });
    setValue("");
  };

  const onSearch = (cityNamePara) => {
    setValue(cityNamePara);
  };

  return (
    <div className="container">
      <div className="top-bar">
        <input
          type="text"
          className="cityInput"
          placeholder="search"
          value={value}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") search();
          }}
        />

        <div className="search-icon" onClick={search}>
          <img src={search_icon} alt="" className="search_icons" />
        </div>
      </div>

      <div className="city-list">
        {cities
          .filter((item) => {
            const searchTerm = value.toLocaleLowerCase();
            const cityName = item.name.toLocaleLowerCase();

            return (
              searchTerm &&
              cityName.startsWith(searchTerm) &&
              cityName !== searchTerm
            );
          })
          .slice(0, 5)
          .map((cityList) => {
            return (
              <div
                className="city-list-item"
                key={cityList.id}
                onClick={() => onSearch(cityList.name)}
              >
                {cityList.name}
              </div>
            );
          })}
      </div>

      <p className="error-message">{err}</p>
      <div className="weather-image">
        <img
          src={require(`../Assets/${data.img}.png`)}
          alt=""
          className="big_icons"
        />
      </div>
      <div className="weather-temp">{data.temp}</div>
      <div className="weather-location">{data.location}</div>
      <div className="data-container">
        <div className="element">
          <img src={humidity_icon} alt="" className="icon small_icons" />
          <div className="data">
            <div className="humidity-percent">{data.humidity}</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={wind_icon} alt="" className="icon small_icons" />
          <div className="data">
            <div className="wind-rate">{data.wind}</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
