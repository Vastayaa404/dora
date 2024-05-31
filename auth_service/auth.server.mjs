// Authentication Server v1.3.0
// Connect all dependencies
import ApiError from '../global_router/exceptions/api.errors.mjs';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import auth from './router/auth.router.mjs'; // Import local router module (Auth)
import express from 'express';
import errorMiddleware from '../global_router/exceptions/errors.middleware.mjs';
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(function(req, res, next) { res.header("X-Powered-By", "Dora Auth Service"); next() });
app.use((e, req, res, next) => {
    if(e instanceof SyntaxError && e.status === 400 && 'body' in e) { throw ApiError.BadRequest("Invalid DTO detected. Aborting") };
    next(e);
});

// *** USE AUTHORIZATION ROUTER ***
app.use('/api/auth', auth);
// ********************************

app.use(errorMiddleware); // Custom Error Handler

app.listen(PORT, '127.0.0.1', () => console.log(`Authorization Server started on port ${PORT}`));