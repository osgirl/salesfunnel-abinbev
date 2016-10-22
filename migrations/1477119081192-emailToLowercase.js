import User from '../model/users/user-schema';
import _ from 'lodash';

exports.up = function (next) {
    User.find({}, function (err, users) {
        if (err) return next();
        _(users).forEach(function (user) {
            // lowercase will be set by the adaptation in the scheme itself
            User.findOneAndUpdate({ _id: user._id })
        });
        next();
    });
};

exports.down = function (next) {
    next();
};
