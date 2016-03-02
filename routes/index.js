import users from './users.js';
import login from './login.js';
import signup from './signup.js';
import logout from './logout.js';
import authenticatedRoutes from './authenticated-routes.js';
import redirect from './redirect.js';

export default {
    authenticatedRoutes: authenticatedRoutes,
    users: users,
    login: login,
    signup: signup,
    logout: logout,
    redirect: redirect
};
