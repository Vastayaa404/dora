// Lite Projects Manager v1.0.0
// Connect all dependencies
import 'dotenv/config';
import express from 'express';
import lite from './router/lite.router.mjs'; // Import local router module (Lite projects manager)
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/api/lite/storage', express.static('/var/www/dora/X-Storage', { maxAge: '30d' }));
app.use(function(req, res, next) { res.header("X-Powered-By", "Dora Lite Manager"); next() });
app.use((e, req, res, next) => {
    if(e instanceof SyntaxError && e.status === 400 && 'body' in e) { res.status(400).send("Invalid DTO detected. Aborting") };
    next(e);
});

// *** USE LITE MANAGER ROUTER ***
app.use('/api/lite', lite);
// *******************************

// Start API process
app.listen(PORT, '127.0.0.1', () => console.log(`API started on port ${PORT}`));