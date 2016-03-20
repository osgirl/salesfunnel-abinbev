import Team from '../model/teams/team-schema.js';

export function getTeams() {
    return new Promise(function (resolve, reject) {
        Team.find({}, (err, teams) => {
            if (err) return reject(err);
            return resolve(teams);
        });
    });
}

export function getTeamById(teamId) {
    return new Promise(function (resolve, reject) {
        Team.findOne({ '_id' : teamId}, (err, team) => {
            if (err) return reject(err);
            return resolve(team || {});
        });
    });
}