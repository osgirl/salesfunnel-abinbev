import User from '../model/users/user-schema';
import _ from 'lodash';

exports.up = function (next) {
    return User.find({}, function (err, users) {
        if (err) return next();
        return _(users).forEach((user) => {
            // lowercase will be set by the adaptation in the scheme itself
            return User.findOneAndUpdate({ _id: user._id });
        })
            .then(() => next())
            .catch(next);
    });
};

exports.down = function (next) {
    next();
};
