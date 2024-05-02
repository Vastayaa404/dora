// Lite Projects Manager v1.0.0
// Connect all dependencies
import 'dotenv/config';
import express from 'express';
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/X-Storage', express.static('../X-Storage', { maxAge: '30d' }));
app.use(function(req, res, next) { res.header("X-Powered-By", "Dora Lite Manager"); next() });
app.use((e, req, res, next) => {
    if(e instanceof SyntaxError && e.status === 400 && 'body' in e) { res.status(400).send("Invalid DTO detected. Aborting") };
    next(e);
});

// *** ADD WEATHER MODULE ***
import weather from './weather_modules/weather.mjs';
app.use('/api/lite/weather', weather);

// *** ADD PHOTO MODULE ***
import photoapp from './photo_modules/photoapp.mjs';
app.use('/api/lite/photos', photoapp);

// Start API process
app.listen(PORT, '127.0.0.1', () => console.log(`API started on port ${PORT}`));