// *** WEATHER SERVICE MODULE ***
// Connect all dependencies
import axios from 'axios';
import express from 'express';
const weather_router = express.Router();
const APIurl = process.env.WEA_API_KEY;

weather_router.use(express.urlencoded({ extended: true }));
weather_router.use(express.json());

// Module functionality
weather_router.post('/', async (req, res) => {
  try {
    const resp = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=${APIurl}`);
    const filteredData = {
      city: req.body.city.charAt(0).toUpperCase() + req.body.city.slice(1).toLowerCase(), // Translate to multiple languages
      country: resp.data.sys.country,
      temp: Math.round(resp.data.main.temp - 273.15),
      weather: resp.data.weather[0].main
    }

    res.status(resp.status).json({ state: resp.status, data: filteredData });
  } catch (e) {
    if (e.response && e.response.status) { res.status(e.response.status).json({ state: e.response.status }) } else { res.status(504).json({ state: 504 }) };
  }
});

export default weather_router;