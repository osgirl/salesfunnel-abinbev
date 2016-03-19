import express from 'express';
import { Promise } from 'bluebird';
import { ensureAuthenticated } from '../../middleware/authentication/ensureAuthentication.js';
import { getCalculatedRegistrationData} from '../../services/registration-service.js';
import { getPeriodById } from '../../services/period-service.js';

var router = express.Router();

router.get('/:teamRef/:periodRef',
    ensureAuthenticated,
    getSalesfunnelData);

function getSalesfunnelData(req, res, next) {
    getPeriodById(req.params.periodRef)
        .then(function (period) {
            var periodData = {
                fromDate: period.getFromDate(),
                toDate: period.getToDate()
            };

            getCalculatedRegistrationData(req.params.teamRef, periodData)
                .then(function (results) {
                    res.status('200').send(results);
                })
                .catch(function (err) {
                    console.log("Unable to retrieve registration data: " + JSON.stringify(err));
                    //TODO how to handle this error?
                    return res.status('400').send("Unable to retrieve the data");
                });
        }).catch(function (err) {
            console.log("Unable to retrieve period data: " + JSON.stringify(err));
            //TODO how to handle this error?
            return res.status('400').send("Unable to retrieve the data");
        });
}

export default router;