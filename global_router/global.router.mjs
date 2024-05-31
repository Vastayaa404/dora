// Direct Origin Redirecting Api (Router) v1.1.3
// Connect all dependencies
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import main from './router/main.router.mjs'; // Import local router module (Main, proxy)
import { morgan, morganFormat } from './exceptions/morgan.middleware.mjs';
const app = express();
const PORT = process.env.PORT;

app.disable('x-powered-by');

app.use(morgan(morganFormat));

app.use(cors({
    // Access to hosts
    origin: ['http://localhost:3000', 'https://weather-now.ru', 'https://www.weather-now.ru'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
}));

app.use(function(req, res, next) {
    // Default response headers
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('X-Timestamp', Date.now());
    next();
});

// *** USE SERVICE ROUTER ***
app.use('/api', main);
// **************************

app.listen(PORT, '127.0.0.1', () => console.log(`API started on port ${PORT}`));