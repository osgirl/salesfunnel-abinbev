import Registration from '../model/registration/registration-schema.js';


export function getRegistrations(callback) {
    Registration.find({}, null, {sort: {userName: -1}}, function (err, users) {
            callback(err, users)
        }
    );
}

export function saveRegistration(userId, teamId, date, registrationData) {
    var query = {
        userRef: userId,
        date: date
    };

    var registration = {
        userRef: userId,
        teamRef: teamId,
        date: date,
        visits: registrationData.visits,
        negos: registrationData.negos,
        proposals: registrationData.proposals,
        deals: registrationData.deals,
        updated: new Date()
    };

    return new Promise(function (resolve, reject) {
        Registration.findOneAndUpdate(query, registration, {upsert:true}, function (err, persistedRegistration) {
            if (err) return reject(err);
            return resolve(persistedRegistration)
        })
    })
}