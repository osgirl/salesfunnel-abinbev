import login from './login.js';
import signup from './signup/signup.js';
import logout from './logout.js';
import resetPassword from './reset-password.js';
import authenticatedRoutes from './authenticated-routes.js';
import registration from './registration/registration-routes.js';
import salesfunnel from './salesfunnel/salesfunnel-routes.js';
import redirect from './redirect.js';

export default {
    authenticatedRoutes: authenticatedRoutes,
    login: login,
    signup: signup,
    logout: logout,
    resetPassword: resetPassword,
    registration: registration,
    salesfunnel: salesfunnel,
    redirect: redirect
};
