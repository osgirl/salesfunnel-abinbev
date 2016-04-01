import { getNewObjectId, getRandomUUID } from '../../test/helpers/random-helpers.js';
import { getVerifiedUserAccount, getNewUserAccount } from '../users/user-fixture.js';
import moment from 'moment';

export const TODAY_REGISTRATION_DATA = {
    visits: 5,
    negos: 4,
    proposals: 3,
    deals: 2
};

export const LAST_WEEK_REGISTRATION_DATA = {
    visits: 15,
    negos: 14,
    proposals: 13,
    deals: 12
};

export const LAST_MONTH_REGISTRATION_DATA = {
    visits: 115,
    negos: 114,
    proposals: 113,
    deals: 112
};

export const LAST_YEAR_REGISTRATION_DATA = {
    visits: 1115,
    negos: 1114,
    proposals: 1113,
    deals: 1112
};

export const DEFAULT_USER = getVerifiedUserAccount();

export const startOfWeekRegistration = {
    userRef: DEFAULT_USER._id,
    teamRef: DEFAULT_USER.teamRef,
    date: moment().startOf('isoWeek').add(1, 'hours').toDate(),
    visits: TODAY_REGISTRATION_DATA.visits,
    negos: TODAY_REGISTRATION_DATA.negos,
    proposals: TODAY_REGISTRATION_DATA.proposals,
    deals: TODAY_REGISTRATION_DATA.deals
};

export const startOfWeekPlusOneRegistration = {
    userRef: DEFAULT_USER._id,
    teamRef: DEFAULT_USER.teamRef,
    date: moment().startOf('isoWeek').add(1, 'hours').add(1, 'days').toDate(),
    visits: TODAY_REGISTRATION_DATA.visits,
    negos: TODAY_REGISTRATION_DATA.negos,
    proposals: TODAY_REGISTRATION_DATA.proposals,
    deals: TODAY_REGISTRATION_DATA.deals
};

export const startOfWeekRegistrationOtherUser = {
    userRef: getNewUserAccount()._id,
    teamRef: getNewUserAccount().teamRef,
    date: moment().startOf('isoWeek').add(1, 'hours').toDate(),
    visits: TODAY_REGISTRATION_DATA.visits,
    negos: TODAY_REGISTRATION_DATA.negos,
    proposals: TODAY_REGISTRATION_DATA.proposals,
    deals: TODAY_REGISTRATION_DATA.deals
};

export const lastWeekRegistration = {
    userRef: DEFAULT_USER._id,
    teamRef: DEFAULT_USER.teamRef,
    date: moment().startOf('isoWeek').add(2, 'hours').subtract(1, 'weeks').toDate(),
    visits: LAST_WEEK_REGISTRATION_DATA.visits,
    negos: LAST_WEEK_REGISTRATION_DATA.negos,
    proposals: LAST_WEEK_REGISTRATION_DATA.proposals,
    deals: LAST_WEEK_REGISTRATION_DATA.deals

};

export const lastMonthRegistration = {
    userRef: DEFAULT_USER._id,
    teamRef: DEFAULT_USER.teamRef,
    date: moment().startOf('month').add(1, 'hours').subtract(1, 'months').toDate(),
    visits: LAST_MONTH_REGISTRATION_DATA.visits,
    negos: LAST_MONTH_REGISTRATION_DATA.negos,
    proposals: LAST_MONTH_REGISTRATION_DATA.proposals,
    deals: LAST_MONTH_REGISTRATION_DATA.deals
};

var lastYearRegistration = {
    userRef: DEFAULT_USER._id,
    teamRef: DEFAULT_USER.teamRef,
    date: moment().startOf('year').add(1, 'hours').subtract(1, 'years').toDate(),
    visits: LAST_YEAR_REGISTRATION_DATA.visits,
    negos: LAST_YEAR_REGISTRATION_DATA.negos,
    proposals: LAST_YEAR_REGISTRATION_DATA.proposals,
    deals: LAST_YEAR_REGISTRATION_DATA.deals
};

export function getRegistrationFixture() {
    return [
        startOfWeekRegistration,
        startOfWeekPlusOneRegistration,
        startOfWeekRegistrationOtherUser,
        lastWeekRegistration,
        lastMonthRegistration,
        lastYearRegistration
    ];
};
