import PasswordReset from './password-reset.js';
import PasswordResetRepository from './password-reset-schema.js';
import moment from 'moment';

function getCurrentDateMinusOne() {
    return moment().subtract(1, 'day');
}

function verifyNoDuplicateEntry(userId) {
    var gte = getCurrentDateMinusOne().toDate();
    var lte = moment().toDate();

    return new Promise(function (resolve, reject) {
        PasswordResetRepository.findOne({
            userRef: userId,
            isReset: false,
            creationDate: {$gte: gte, $lte: lte}
        }, (err, entry) => {
            if (err || entry) {
                return reject(new Error('reset password object for this user already created and still open'));
            }
            return resolve(userId);
        })
    })
}

export function createResetPasswordObject(userId) {
    return verifyNoDuplicateEntry(userId)
        .then(doCreateResetPasswordObject);

    function doCreateResetPasswordObject(userId) {
        return new PasswordResetRepository(new PasswordReset(userId))
            .save()
            .then(function (persistedPasswordReset) {
                return persistedPasswordReset.pwResetToken;
            });
    }
}

export function verifyValidPwResetToken(pwResetToken) {
    var gte = getCurrentDateMinusOne().toDate();
    var lte = moment().toDate();

    return new Promise(function(resolve, reject) {
        PasswordResetRepository.findOne({
            pwResetToken: pwResetToken,
            isReset: false,
            creationDate: {$gte: gte, $lte: lte}
        }, (err, entry) => {
            if (err || !entry) {
                return reject(new Error(`valid reset password object for this user doesn't exist`));
            }
            return resolve(entry.userRef);
        })
    })
}

export function updatePasswordObject(pwResetToken) {
    return new Promise(function (resolve, reject) {
        PasswordResetRepository.findOneAndUpdate({pwResetToken: pwResetToken}, {$set: {isReset: true}}, {new: true}, function (err, updatedPasswordObject) {
            if (err) return reject(err);
            return resolve(updatedPasswordObject)
        })
    })

}