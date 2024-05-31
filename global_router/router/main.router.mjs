// Main Router Module
// Connect all dependencies
import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';
const router = express.Router();

/////////////////////////////// !!! LIST OF ROUTES BELOW !!! ///////////////////////////////
// *** PROXY TO AUTHORIZATION SERVICE ***
const authorization = createProxyMiddleware({ target: 'http://localhost:6000', 
                                            changeOrigin: true, 
                                            onError: (err, req, res) => { res.status(504).send("..oops, our Auth service is unavailable, but we will fix it :)")} });
router.use('/auth', authorization);

// *** PROXY TO LITE MANAGER SERVICE ***
const liteProjects = createProxyMiddleware({ target: 'http://localhost:7000',
                                            changeOrigin: true, 
                                            onError: (err, req, res) => { res.status(504).send("..oops, our Manager service is unavailable, but we will fix it :)")} });
router.use('/lite', liteProjects);

export default router;