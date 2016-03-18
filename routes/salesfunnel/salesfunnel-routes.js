import express from 'express';
import { Promise } from 'bluebird';
import { ensureAuthenticated } from '../../middleware/authentication/ensureAuthentication.js';
import { getCalculatedRegistrationData} from '../../services/registration-service.js';

var router = express.Router();

router.get('/:teamRef',
    ensureAuthenticated,
    getSalesfunnelDataByTeamRef);

function getSalesfunnelDataByTeamRef(req, res, next) {

    getCalculatedRegistrationData(req.params.teamRef)
        .then(function (results) {
            console.log("result: " + results);
            res.status('200').send(results);
        })
        .catch(function (err) {
            console.log("Unable to retrieve registration data: " + JSON.stringify(err));
            //TODO how to handle this error?
            return res.status('400').send("Unable to retrieve the data");
        });
}

export default router;