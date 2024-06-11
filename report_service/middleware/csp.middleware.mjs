
router.post('/', (req, res, next) => {
    try {
        if (!req.body || req.body.length < 1) {throw ApiError.BadRequest("no test string")};
    
        const test1 = req.body;

        res.status(200).send({response: `csp received, ${test1}, ${req.body}`});
      } catch (e) { next(e) };
});