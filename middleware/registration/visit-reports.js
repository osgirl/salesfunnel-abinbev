import { getRep } from '../../model/roles/role-fixture.js';
import { getWorkWeekUserRegistrationData } from '../../services/registration-service.js';

/**
 * Prerequisite: user has to be authenticated to perform this action
 * @param req.userObject is mandatory
 */
export function getVisitReport(req, res, next) {
    return _ensureRep(req, res, next)
        .then(doGetVisitReport);

    function doGetVisitReport() {
        return getWorkWeekUserRegistrationData(req.user.id, 5)
            .then(registrationData => {
                res.visitReport = registrationData;
                return next();
            }).catch(() => {
                return next()
            });
    }
}

function _ensureRep(req, res, next) {
    if (req.userObject) {
        if (req.userObject.roleRef !== getRep()._id) {
            next();
            return Promise.reject();
        } else {
            return Promise.resolve();
        }
    } else {
        console.log("req.userObject should exist, please use the ensureAuthentication method before calling the getVisitReport.");
    }
}