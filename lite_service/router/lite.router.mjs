// Lite Manager Router Module
// Connect all dependencies
import express from 'express';
import photoapp from '../photo_modules/photoapp.mjs';
import weather from '../weather_modules/weather.mjs';
const router = express.Router();

/////////////////////////////// !!! LIST OF ROUTES BELOW !!! ///////////////////////////////
// *** ADD WEATHER MODULE ***
router.use('/weather', weather);

// *** ADD PHOTO MODULE ***
router.use('/photos', photoapp);

export default router;