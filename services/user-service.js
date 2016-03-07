import User from '../model/users/user-schema.js';
import uuid from 'uuid';

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
    user.isConfirmed = false;
    user.confirmationEmailCounter = 0;
    user.confirmationToken = uuid.v4();

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
        User.findOneAndUpdate({_id: userId}, {$set: {isVerified: true}}, {new: true}, function(err, updatedUser) {
            if (err) return reject(err);
            return resolve(updatedUser)
        })
    })
}

function updateVerificationEmailCounter(userId, verificationEmailCounter) {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate({_id: userId}, {$set: {verificationEmailCounter: verificationEmailCounter}}, {new: true}, function(err, updatedUser) {
            if (err) return reject(err);
            return resolve(updatedUser)
        })
    })
}

export default {
    getUsers: getUsers,
    createUser: createUser,
    findByEmail: findByEmail,
    findById: findById,
    updateAccountVerified: updateAccountVerified,
    updateVerificationEmailCounter: updateVerificationEmailCounter
};