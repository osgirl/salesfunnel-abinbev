import Team from '../model/teams/team-schema.js';

function getTeams(callback) {
    Team.find({}, null, {}, function (err, teams) {
            callback(err, teams)
        }
    );
}

export default {
    getTeams: getTeams
};