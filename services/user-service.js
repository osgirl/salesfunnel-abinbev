import User from '../model/users/user-schema.js';

function getUsers(callback) {
    User.find({}, null, {sort: {userName: -1}}, function (err, users) {
            callback(err, users)
        }
    );
}

function createUser(user, callback) {
    user.isValidated = false;

    return new User(user).save(function (err, persistedUser) {
        callback(err, persistedUser)
    });
}

export default {
    getUsers: getUsers,
    createUser: createUser
};