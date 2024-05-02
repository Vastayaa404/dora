// Direct Origin Redirecting Api (Router) v1.1.2
// Connect all dependencies
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { morgan, morganFormat } from './exceptions/morgan.middleware.mjs';
import { createProxyMiddleware } from 'http-proxy-middleware';
const app = express();
const PORT = process.env.PORT;

app.use(cors({ // Access to hosts
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
}));

app.use(function(req, res, next) { // Default response headers
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('X-Timestamp', Date.now());
    res.header("X-Powered-By", "Dora");
    next();
});

app.use(morgan(morganFormat));

// *** PROXY TO AUTHORIZATION SERVICE ***
const authorization = createProxyMiddleware({ target: 'http://localhost:6000', 
                                            changeOrigin: true, 
                                            onError: (err, req, res) => { res.status(504).send("..oops, our Auth service is unavailable, but we will fix it :)")} });
app.use('/api/auth', authorization);

// *** PROXY TO AUTHORIZATION SERVICE ***
const liteProjects = createProxyMiddleware({ target: 'http://localhost:7000',
                                            changeOrigin: true, 
                                            onError: (err, req, res) => { res.status(504).send("..oops, our Manager service is unavailable, but we will fix it :)")} });
app.use('/api/lite', liteProjects);

// Start API process
app.listen(PORT, '127.0.0.1', () => console.log(`API started on port ${PORT}`));