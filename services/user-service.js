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
        callback(err, persistedUser);
    });
}

function findByEmail(email, callback) {
    User.find({email: email}, (err, users) => {
        if (err) throw err;
        callback(null, users[0]);
    });
}

function findById(userId, callback) {
    User.findById(userId, (err, user) => {
        if (err) callback(err, null);
        callback(null, user);
    });
}

export default {
    getUsers: getUsers,
    createUser: createUser,
    findByEmail: findByEmail,
    findById: findById
};