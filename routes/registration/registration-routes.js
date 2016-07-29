import express from 'express';
import { Promise } from 'bluebird';
import { ensureAuthenticated } from '../../middleware/authentication/ensureAuthentication.js';
import { saveRegistration } from '../../services/registration-service.js';
import { getVisitReport } from '../../middleware/registration/visit-reports.js';
import moment from 'moment';

var router = express.Router();

router.post('/:date',
    ensureAuthenticated,
    postRegistrationData);

router.get('/visits',
    ensureAuthenticated,
    getVisitReport,
    sendVisitReport);

function postRegistrationData(req, res, next) {
    var date = req.params.date;
    var momentDate = moment(date);
    console.log(`saved as day:${momentDate.date()}`);
    console.log(`saved as hour:${momentDate.hour()}`);

    var formattedDate = momentDate.format("YYYY-MM-DD");

    return saveRegistration(req.user.id, req.user.teamRef, momentDate, req.body)
        .then(function (result) {
            return res.status('200').send("Thank you for registering your sales of: " + moment(date));
        })
        .
        catch(function (err) {
            console.log("Unable to save registration: " + JSON.stringify(err));
            return res.status('400').send("We are sorry, we were unable to register your sales of: " + formattedDate + ". Please retry");
        })
        ;
}

function sendVisitReport(req, res) {
    return res.status('200').send(res.visitReport);
}

export default router;