export const DEFAULT_ENSURE_NOT_AUTHENTICATED_ERROR = "This action cannot be performed when logged in";

export function ensureNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) return next();
    return res.redirect(`/?error=${req.authenticationError || DEFAULT_ENSURE_NOT_AUTHENTICATED_ERROR}`);
}

export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    if (req.authenticationError) return res.redirect(`/login?error=${req.authenticationError}`);
    return res.redirect('/login');
}