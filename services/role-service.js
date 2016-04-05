import Role from '../model/roles/role-schema.js';

export function getRoles() {
    return new Promise((resolve, reject) => {
        Role.find({}, (err, roles) => {
                if (err) return reject(err);
                return resolve(roles);
            }
        );
    });
}

export function getRolesMappedById() {
    return new Promise((resolve, reject) => {
        var stream = Role.find().stream(), results = {};
        stream.on('data', function (doc) {
            results[doc._id] = doc;
        }).on('error', function (err) {
            return reject(err)
        }).on('close', function () {
            return resolve(results)
        });
    });
}