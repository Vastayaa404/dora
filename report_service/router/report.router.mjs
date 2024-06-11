// Report Router Module
// Connect all dependencies
import express from 'express';
//import csp_middleware from '../middleware/csp.middleware.mjs';
const router = express.Router();

/////////////////////////////// !!! LIST OF ROUTES BELOW !!! ///////////////////////////////
// csp controller routes
//router.post('/csp', csp_middleware);

router.post('/csp', (req, res, next) => {
  try {
      if (!req.body || req.body.length < 1) {throw ApiError.BadRequest("no test string")};
  
      const test1 = req.body;

      res.status(200).send({response: `csp received, ${test1}, ${req.body}`});
    } catch (e) { next(e) };
});

export default router; 