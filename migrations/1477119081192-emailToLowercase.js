import User from '../model/users/user-schema';

exports.up = function (next) {
    return User.find({}, function (err, users) {
        if (err) return next(err);
        return Promise.all(users.map((user) => User.findOneAndUpdate({ _id: user._id })))
            .then(next)
            .catch(next);
    });
};

exports.down = function (next) {
    next();
};
