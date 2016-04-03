'use strict'
import User from "../model/users/user-schema";
import _ from "lodash";

exports.up = function (next) {
    User.find({}, function (err, users) {
        if (err) return next();
        _(users).forEach(function(user) {
            User.findOneAndUpdate({_id: user._id}, {$set: {isDeleted: false, isAdmin: false}}, {new: true}, function (err, updatedUser) {
                console.log("updated user " + user.email);
            })
        });
        next();
    });
};

exports.down = function (next) {
    next();
};
