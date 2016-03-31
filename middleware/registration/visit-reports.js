import { getRep } from '../../model/roles/role-fixture.js';
import { getAuthenticatedUser } from '../../middleware/passport/passport-middleware.js';
import { getWorkWeekUserRegistrationData } from '../../services/registration-service.js';

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
    if (!req.userObject) {
        return getAuthenticatedUser(req.user.id)
            .then(function (userObject) {
                req.userObject = userObject;
                return doEnsureRep();
            });
    } else {
        return doEnsureRep();
    }

    function doEnsureRep() {
        if (req.userObject.roleRef !== getRep()._id) {
            next();
            return Promise.reject();
        } else {
            return Promise.resolve();
        }
    }
}