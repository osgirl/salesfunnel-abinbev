import { User } from '../model/db';


function getUsers(callback) {
    User.find({}, null, { sort: { userName: -1}}, function(err, users) {
        callback(err, users)
    });
}

export default {
    getUsers: getUsers
};