import express from 'express';
var router = express.Router();

router.all('/*', function (req, res) {
    res.redirect("/")
});

export default router;