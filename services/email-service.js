import postmark from 'postmark';
import path from 'path';
import UserService from '../services/user-service.js';

export function sendVerificationEmails(user, baseUrl) {
    var client;

    if (process.env.NODE_ENV === "test") {
        client = {
            sendEmailWithTemplate: function (emailObject, callbackFunction) {
                callbackFunction()
            }
        }
    } else {
        client = new postmark.Client('ddd92f99-b69e-4393-8e7d-85e114ad0345');
    }


    return new Promise(function (resolve, reject) {
        if (user.verificationEmailCounter > 5) {
            return reject(new Error("Already more than five emails have been sent"));
        }

        var emailObject = {
            "From": "Sales Registration App <jonathan@cazamundo.be>",
            "To": user.email,
            "TemplateId": 463782,
            "TemplateModel": {
                "product_name": "The Sales Registration App",
                "name": user.userName,
                "action_url": createVerificationUrl(baseUrl, user),
                "username": user.email,
                "sender_name": "AB Inbev Sales Management Team"
            }
        };
        var callbackFunction = function (err, response) {
            if (err) return reject(new Error("Problem sending verification email: " + err.status + '-' + err.message));
            return UserService.updateVerificationEmailCounter(user._id, ++user.verificationEmailCounter)
                .then(function (result) {
                    return resolve(response);
                }).catch(function (err) {
                    error.log("unable to update to verificationEmailCounter");
                    return resolve(response)
                });
        };
        return client.sendEmailWithTemplate(emailObject, callbackFunction);
    });

    function createVerificationUrl(baseUrl, user) {
        return path.join(baseUrl, 'signup', 'accept', user.id, user.verificationToken);
    }
}

export function sendPasswordResetEmail(user, pwResetToken, baseUrl) {
    var client;

    if (process.env.NODE_ENV === "test") {
        client = {
            sendEmailWithTemplate: function (emailObject, callbackFunction) {
                callbackFunction()
            }
        }
    } else {
        client = new postmark.Client('ddd92f99-b69e-4393-8e7d-85e114ad0345');
    }

    return new Promise(function (resolve, reject) {
        var emailObject = {
            "From": "Sales Registration App <jonathan@cazamundo.be>",
            "To": user.email,
            "TemplateId": 503183,
            "TemplateModel": {
                "product_name": "The Sales Registration App",
                "name": user.userName,
                "action_url": createResetPasswordUrl(baseUrl, pwResetToken),
                "sender_name": "AB Inbev Sales Management Team"
            }
        };
        var callbackFunction = function (err) {
            if (err) return reject(new Error("Problem sending reset password email: " + err.status + '-' + err.message));
        };
        return client.sendEmailWithTemplate(emailObject, callbackFunction);
    });

    function createResetPasswordUrl(baseUrl, pwResetToken) {
        return path.join(baseUrl, 'reset-password', 'reset', pwResetToken);
    }
}

export function verifyEmailAndUpdateUser(verificationObject) {
    var userId = verificationObject.userId;
    var verificationToken = verificationObject.verificationToken;

    return new Promise(function (resolve, reject) {
        return UserService.findById(userId)
            .then(function (user) {
                if (user && user.verificationToken === verificationToken && !user.isVerified) {
                    return UserService.updateAccountVerified(user._id)
                        .then(function (result) {
                            return resolve(result)
                        })
                        .catch(function (err) {
                            return reject(err)
                        });
                }
                return reject(new Error('User not found, or already verified'));
            })
            .catch(function (err) {
                return reject(err)
            });
    });

}