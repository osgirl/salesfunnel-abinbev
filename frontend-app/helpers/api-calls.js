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

export function getSalesFunnelData(baseUrl, teamRef, periodRef) {
    var url = `${baseUrl}salesfunnel/${teamRef}/${periodRef}`;
    return axios.get(url);
}