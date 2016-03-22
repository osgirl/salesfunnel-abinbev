import User from '../model/users/user-schema.js';
import uuid from 'uuid';
import _ from 'lodash';
import SearchableUser from '../model/users/searchable-user.js';

function getUsers(callback) {
    User.find({}, null, {sort: {userName: -1}}, function (err, users) {
            callback(err, users)
        }
    );
}

function createUser(user, callback) {
    user.isVerified = false;
    user.verificationEmailCounter = 0;
    user.verificationToken = uuid.v4();

    return new User(user).save(function (err, persistedUser) {
        callback(err, persistedUser);
    });
}

function findByEmail(email) {
    return new Promise(function (resolve, reject) {
        User.find({email: email}, (err, users) => {
            if (err) return reject(err);
            return resolve(users[0]);
        });
    })
}

function findById(userId) {
    return new Promise(function (resolve, reject) {
        User.findById(userId, (err, user) => {
            if (err) return reject(err);
            return resolve(user);
        });
    });
}

function updateAccountVerified(userId) {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate({_id: userId}, {$set: {isVerified: true}}, {new: true}, function (err, updatedUser) {
            if (err) return reject(err);
            return resolve(updatedUser)
        })
    })
}

function updateVerificationEmailCounter(userId, verificationEmailCounter) {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate({_id: userId}, {$set: {verificationEmailCounter: verificationEmailCounter}}, {new: true}, function (err, updatedUser) {
            if (err) return reject(err);
            return resolve(updatedUser)
        })
    })
}

function _mapUsersToSearchableUsers(users) {
    var searchableUsers = [];
    _(users).forEach(function (user) {
        _isSearchableUser(user) && searchableUsers.push(new SearchableUser(user))
    });

    return searchableUsers;

    function _isSearchableUser(user) {
        return user.isVerified
    }
}

function getSearchableUsers(teamRef) {
    var query = {roleRef: "M1", isVerified: true};
    teamRef !== 'NA' && _.assign(query, {teamRef: teamRef});

    return new Promise(function (resolve, reject) {
        User.find(query, (err, users) => {
            if (err) return reject(err);
            return resolve(_mapUsersToSearchableUsers(users));
        });
    });

}

export default {
    getUsers: getUsers,
    createUser: createUser,
    findByEmail: findByEmail,
    findById: findById,
    updateAccountVerified: updateAccountVerified,
    getSearchableUsers: getSearchableUsers,
    updateVerificationEmailCounter: updateVerificationEmailCounter
};