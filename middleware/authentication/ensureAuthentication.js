export function ensureNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) return next();
    if (req.authenticationError) return res.redirect(`/?error=${req.authenticationError}`);
    if (req.query.info) return res.redirect(`/?info=${req.query.info}`);
    if (req.query.error) return res.redirect(`/?error=${req.query.error}`);
    return res.redirect(`/`);
}

export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    if (req.authenticationError) return res.redirect(`/login?error=${req.authenticationError}`);
    if (req.query.info) return res.redirect(`/login?info=${req.query.info}`);
    if (req.query.error) return res.redirect(`/login?error=${req.query.error}`);
    return res.redirect('/login');
}