import express from 'express';

var router = express.Router();

router.get('/', function(req, res, next) {
    req.logout();
    next();
});

export default router;