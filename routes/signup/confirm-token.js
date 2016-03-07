export function addConfirmTokenRoutes(router) {

    router.get('/confirm/:userId/:verificationToken',
        confirmTokenRoute);

    function confirmTokenRoute(req, res, next) {

        //confirmEmailAndUpdateUser (via EmailService)
        //if err ==> goTo homePage with message ==> There is a small problem<br> This invitation link isn't valid. Perhaps you already used it?
        //if success ==> goTo homePage with message ==> You successfully confirmed this user.

        res.send(req.params.userId);
    }
}
