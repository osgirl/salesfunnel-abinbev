import Team from '../model/teams/team-schema.js';

export function getTeams() {
    return new Promise((resolve, reject) => {
        Team.find({}, (err, teams) => {
            if (err) return reject(err);
            return resolve(teams);
        });
    });
}

export function getTeamsMappedById() {
    return new Promise((resolve, reject) => {
        var stream = Team.find().stream(), results = {};
        stream.on('data', function (doc) {
            results[doc._id] = doc;
        }).on('error', function (err) {
            return reject(err)
        }).on('close', function () {
            return resolve(results)
        });
    });
}


export function getTeamById(teamId) {
    return new Promise((resolve, reject) => {
        Team.findOne({'_id': teamId}, (err, team) => {
            if (err) return reject(err);
            return resolve(team || {});
        });
    });
}