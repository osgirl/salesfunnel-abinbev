import { ensureNotAuthenticated } from '../../middleware/authentication/ensureAuthentication.js';
import { verifyEmailAndUpdateUser } from '../../services/email-service.js';

export const VERIFICATION_FAILURE = "This invitation link isn't valid. Perhaps you already used it?";
export const VERIFICATION_SUCCESS = "Verifying your account was successful, please login now to start working";

export function addVerifyAccountRoutes(router) {

    router.get('/accept/:userId/:verificationToken',
        function (req, res, next) {
            req.authenticationError = `Please log out before verifying somebody else his token`;
            next();
        },
        ensureNotAuthenticated,
        verifyTokenRoute);


    function verifyTokenRoute(req, res, next) {
        var verificationObject = {
            userId: req.params.userId,
            verificationToken: req.params.verificationToken
        };

        verifyEmailAndUpdateUser(verificationObject)
            .then(function (result) {
                return res.redirect(`/login?info=${VERIFICATION_SUCCESS}`)
            })
            .catch(function (err) {
                return res.redirect(`/login?error=${VERIFICATION_FAILURE}`)
            });
    }

}