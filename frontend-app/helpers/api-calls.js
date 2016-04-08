import axios from 'axios';

export function saveRegistrationData(baseUrl, registrationForm) {
    var date = registrationForm.date.toJSON();

    var registrationData = {
        visits: registrationForm.visits,
        negos: registrationForm.negos,
        proposals: registrationForm.proposals,
        deals: registrationForm.deals
    };

    var url = baseUrl + "registration" + "/" + date;

    return axios.post(url, registrationData);
}

export function getTeamSalesFunnelData(baseUrl, teamRef, periodRef) {
    var url = `${baseUrl}salesfunnel/teams/${teamRef}/${periodRef}`;
    return axios.get(url);
}

export function getUserSalesFunnelData(baseUrl, userRef, periodRef) {
    var url = `${baseUrl}salesfunnel/users/${userRef}/${periodRef}`;
    return axios.get(url);
}

export function getVisitReport(baseUrl) {
    var url = `${baseUrl}registration/visits`;
    return axios.get(url);
}

export function getUsers(baseUrl) {
    var url = `${baseUrl}admin/users`;
    return axios.get(url);
}

export function updateUser(baseUrl, user) {
    var url = `${baseUrl}admin/users/${user.id}`;
    return axios.put(url, user);
}