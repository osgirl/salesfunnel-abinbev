import Team from '../model/teams/team-schema.js';

function getTeams(callback) {
    Team.find({}, null, {}, function (err, teams) {
            if (!teams.length && !err) {
                var err = new Error('Not Found');
                err.status = 404;
                err.message = "No teams found in DB"
            }
            callback(err, teams)
        }
    );
}

export default {
    getTeams: getTeams
};