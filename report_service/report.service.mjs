// Report Server v1.0.0
// Connect all dependencies
import ApiError from '../router_service/middleware/api.errors.mjs';
import 'dotenv/config';
import report from './router/report.router.mjs'; // Import local router module (Report)
import express from 'express';
import errorMiddleware from '../router_service/middleware/errors.middleware.mjs';
const app = express();
const PORT = process.env.PORT;

app.use(express.json({ type: 'application/csp-report' }));

app.use(function(req, res, next) { res.header("X-Powered-By", "Dora Report Service"); next() });
app.use((e, req, res, next) => {
    if(e instanceof SyntaxError && e.status === 400 && 'body' in e) { throw ApiError.BadRequest("Invalid DTO detected. Aborting") };
    next(e);
});

// *** USE REPORT ROUTER ***
app.use('/api/report', report);
// *************************

app.use(errorMiddleware); // Custom Error Handler

app.listen(PORT, '127.0.0.1', () => console.log(`Report Server started on port ${PORT}`));