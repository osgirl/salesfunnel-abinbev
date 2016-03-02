import users from './users.js';
import login from './login.js';
import logout from './logout.js';
import authenticatedRoutes from './authenticated-routes.js';
import redirect from './redirect.js';

export default {
    authenticatedRoutes: authenticatedRoutes,
    users: users,
    login: login,
    logout: logout,
    redirect: redirect
};
