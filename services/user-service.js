import User from '../model/users/user-schema.js';
import uuid from 'uuid';
import _ from 'lodash';
import SearchableUser from '../model/users/searchable-user.js';

function getUsers() {
    return new Promise((resolve, reject) => {
        User.find({isDeleted: false}, null, {sort: {userName: -1}}, (err, users) => {
            if (err) return reject(err);
            return resolve(users);
        });
    });
}

function getDeletedUsers() {
    return new Promise((resolve, reject) => {
        User.find({isDeleted: true}, null, {sort: {userName: -1}}, (err, users) => {
            if (err) return reject(err);
            return resolve(users);
        });
    });
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

function updatePassword(userId, password) {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate({_id: userId}, {$set: {pw: password}}, {new: true}, function (err, updatedUser) {
            if (err) return reject(err);
            return resolve(updatedUser)
        })
    })
}

function updateUser(userId, adminId, adminUser) {
    return new Promise(function (resolve, reject) {
        if (adminUser.role.roleRef === 'M1' && adminUser.team.teamRef === 'NA') {
            return reject("Role 'M1' and Team 'Overall' is a bad combination")
        }
        User.findOneAndUpdate({_id: userId}, {$set: {roleRef: adminUser.role.roleRef, teamRef: adminUser.team.teamRef, isAdmin: adminUser.isAdmin, isDeleted: adminUser.isDeleted, updatedBy: adminId}}, {new: true}, (err, updatedUser) => {
            if (err) return reject(err);
            return resolve(updatedUser);
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
    var query = {roleRef: "M1", isDeleted: false};
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
    getDeletedUsers: getDeletedUsers,
    createUser: createUser,
    findByEmail: findByEmail,
    findById: findById,
    updateAccountVerified: updateAccountVerified,
    getSearchableUsers: getSearchableUsers,
    updateVerificationEmailCounter: updateVerificationEmailCounter,
    updatePassword: updatePassword,
    updateUser: updateUser
};