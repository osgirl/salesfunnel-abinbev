import express from 'express';
var router = express.Router();

router.get('/*', function (req, res) {
    res.redirect("/")
});

export default router;