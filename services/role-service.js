import Role from '../model/roles/role-schema.js';

function getRoles(callback) {
    Role.find({}, null, {}, function (err, roles) {
            callback(err, roles)
        }
    );
}

export default {
    getRoles: getRoles
};