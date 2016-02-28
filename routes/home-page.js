import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home-page',{
            metaData: {
                title: 'Sales funnel - reporting tool - AB Inbev',
                description: 'This is a reporting tool by and from AB Inbev to report about sales prospects'
            }
        }
    );
});

export default router;