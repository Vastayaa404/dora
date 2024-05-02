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
  const directoryPath = `${import.meta.url}/../../X-Storage`;
  fs.readdir(directoryPath, (err, files) => {
    if (err) { res.status(500).send("Error reading photos directory") } else {
      const photos = files.map(file => `http://localhost:7000/X-Storage/${file}`); res.json(photos) };
  });
});

photoapp_router.post('/upload', upload.single('photo'), (req, res) => { res.status(200).json( { state: "Uploaded!" } ) });

export default photoapp_router;