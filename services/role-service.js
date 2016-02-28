import Role from '../model/roles/role-schema.js';

function getRoles(callback) {
    Role.find({}, null, {}, function (err, roles) {
            if (!roles.length && !err) {
                var err = new Error('Not Found');
                err.status = 404;
                err.message = "No roles found in DB";
            }
            callback(err, roles)
        }
    );
}

export default {
    getRoles: getRoles
};