import login from './login.js';
import signup from './signup/signup.js';
import logout from './logout.js';
import authenticatedRoutes from './authenticated-routes.js';
import redirect from './redirect.js';

export default {
    authenticatedRoutes: authenticatedRoutes,
    login: login,
    signup: signup,
    logout: logout,
    redirect: redirect
};
