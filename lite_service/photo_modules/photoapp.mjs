// *** PHOTO APPLICATION SERVICE MODULE ***
// Connect all dependencies
import compression from 'compression';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
const photoapp_router = express.Router();

photoapp_router.use(compression());

// Module functionality
const storage = multer.diskStorage({
  destination: '../X-Storage',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage });

photoapp_router.get('/', (req, res) => {
  fs.readdir('/var/www/dora/X-Storage', (err, files) => {
    if (err || files.length < 1) { res.status(405).send(`The directory is empty or an error has occurred, ${err}`) } 
    else { const photos = files.map(file => `https://dora-api.tech/api/lite/storage/${file}`); res.json(photos) };
  });
});

photoapp_router.post('/upload', upload.single('photo'), (req, res) => { res.status(200).json( { state: "Uploaded!" } ) });

export default photoapp_router;