const axios = require("axios");
require("dotenv").config();

async function getWeather(lat, lon) {
  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API}&units=metric`
  );
  return data;
}

async function getForecast(lat, lon) {
  const { data } = await axios.get(`
  https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API}&units=metric`);
  return data;
}

async function getCoords(city) {
  const { data } = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${process.env.WEATHER_API}`
  );
  return data;
}

module.exports = {
  getWeather,
  getCoords,
  getForecast,
};
