import User from '../model/users/user-schema.js';

function getUsers(callback) {
    User.find({}, null, {sort: {userName: -1}}, function (err, users) {
            if (!users.length && !err) {
                var err = new Error('Not Found');
                err.status = 404;
                err.message = "No users found in DB"
            }
            callback(err, users)
        }
    );
}

export default {
    getUsers: getUsers
};