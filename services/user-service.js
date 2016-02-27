import User from '../model/users/user-schema.js';

function getUsers(callback) {
    User.find({}, null, {sort: {userName: -1}}, function (err, users) {
            if (!users.length && !err) {
                err = {
                    status: 404,
                    message: "No users found in DB"
                }
            }
            callback(err, users)
        }
    );
}

export default {
    getUsers: getUsers
};