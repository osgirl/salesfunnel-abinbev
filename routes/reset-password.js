import express from 'express';
import { ensureNotAuthenticated } from '../middleware/authentication/ensureAuthentication.js';

var router = express.Router();

/* GET home page. */
router.get('/', ensureNotAuthenticated, doRenderResetPasswordPage);

function doRenderResetPasswordPage(req, res, next) {
    res.render('reset-password-page', {
        metaData: {
            title: 'Sales funnel - reporting tool - AB Inbev',
            description: 'This is a reporting tool by and from AB Inbev to report about sales prospects'
        },
        isAuthenticated: false
    })
}

export default router;