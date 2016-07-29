import _ from 'lodash';
import moment from 'moment';

export const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export const CURRENT_WEEK = `CURRENT_WEEK`;
export const LAST_WEEK = `LAST_WEEK`;
export const CURRENT_MONTH = `CURRENT_MONTH`;
export const LAST_MONTH = `LAST_MONTH`;
export const CURRENT_YEAR = `CURRENT_YEAR`;
export const LAST_YEAR = `LAST_YEAR`;

export function getFromCurrentDate(momentDate) {
    var momentDate = (momentDate || moment());
    var fromCurrentDate = momentDate.startOf('day');
    return fromCurrentDate;
};

export function getToCurrentDate(momentDate) {
    var momentDate = (momentDate || moment());
    var endCurrentDate = momentDate.endOf('day');
    return endCurrentDate;
};

var getLastYearDate = function () {
    return moment(getFromCurrentDate()).subtract(1, 'year');
};

var getLastMonthDate = function () {
    return moment(getFromCurrentDate()).subtract(1, 'month');
};

var getLastWeekDate = function () {
    return moment(getFromCurrentDate()).subtract(1, 'week');
};

export function getStartOfWeekDate(nrOfWeeksInThePast) {
    return moment({hour: 0, minute: 0, seconds: 0}).subtract(nrOfWeeksInThePast, 'weeks').startOf('isoWeek');
};

export function getEndOfWeekDate(nrOfWeeksInThePast) {
    return moment({hour: 23, minute: 59, seconds: 59}).subtract(nrOfWeeksInThePast, 'weeks').endOf('isoWeek');
};

export function getStartOfMonthDate(nrOfMonthsInThePast) {
    return moment({hour: 0, minute: 0, seconds: 0}).subtract(nrOfMonthsInThePast, 'months').startOf('month');
};
export function getEndOfMonthDate(nrOfMonthsInThePast) {
    return moment({hour: 23, minute: 59, seconds: 59}).subtract(nrOfMonthsInThePast, 'months').endOf('month');
};
export function getStartOfYearDate(nrOfYearsInThePast) {
    return moment({hour: 0, minute: 0, seconds: 0}).subtract(nrOfYearsInThePast, 'years').startOf('year');
};
export function getEndOfYearDate(nrOfYearsInThePast) {
    return moment({hour: 23, minute: 59, seconds: 59}).subtract(nrOfYearsInThePast, 'years').endOf('year');
};

export function getWeekNumber(nrOfWeeksInThePast) {
    return getStartOfWeekDate(nrOfWeeksInThePast).isoWeek();
}

export function getPeriods() {
    return new Promise(function (resolve) {
        return resolve(periods);
    });
}

export function getPeriodById(periodId) {
    return new Promise(function (resolve, reject) {
        var periodIndex = _.findIndex(periods, {'_id': periodId});
        if (periodIndex !== -1) {
            return resolve(periods[periodIndex])
        } else {
            return reject(`The period with id ${periodId} does not exist`);
        }
    });
}

var getStartOfCurrentWeek = function () {
    return getStartOfWeekDate();
};

var getEndOfCurrentWeek = function () {
    return getEndOfWeekDate();
};

var getStartOfPreviousWeek = function () {
    return getStartOfWeekDate(1);
};

var getEndOfPreviousWeek = function () {
    return getEndOfWeekDate(1);
};

var getStartOfCurrentMonth = function () {
    return getStartOfMonthDate();
};

var getStartOfPreviousMonth = function () {
    return getStartOfMonthDate(1);
};
var getEndOfCurrentMonth = function () {
    return getEndOfMonthDate();
};

var getEndOfPreviousMonth = function () {
    return getEndOfMonthDate(1);
};

var getStartOfCurrentYear = function () {
    return getStartOfYearDate();
};

var getEndOfCurrentYear = function () {
    return getEndOfYearDate();
};

var getStartOfPreviousYear = function () {
    return getStartOfYearDate(1);
};

var getEndOfPreviousYear = function () {
    return getEndOfYearDate(1);
};

export const DEFAULT_PERIOD = {
    _id: CURRENT_YEAR,
    name: `Year ${getStartOfCurrentYear().year()}`,
    getFromDate: getStartOfCurrentYear,
    getToDate: getEndOfCurrentYear
};

const periods = [
    DEFAULT_PERIOD,
    {
        _id: CURRENT_WEEK,
        name: `Current week (${getStartOfCurrentWeek().isoWeek()})`,
        getFromDate: getStartOfCurrentWeek,
        getToDate: getEndOfCurrentWeek
    },
    {
        _id: LAST_WEEK,
        name: `Previous week (${getStartOfPreviousWeek().isoWeek()})`,
        getFromDate: getStartOfPreviousWeek,
        getToDate: getEndOfPreviousWeek
    }, {
        _id: CURRENT_MONTH,
        name: `Current month (${monthNames[getStartOfCurrentMonth().month()]})`,
        getFromDate: getStartOfCurrentMonth,
        getToDate: getEndOfCurrentMonth
    }, {
        _id: LAST_MONTH,
        name: `Previous month (${monthNames[getStartOfPreviousMonth().month()]})`,
        getFromDate: getStartOfPreviousMonth,
        getToDate: getEndOfPreviousMonth
    }, {
        _id: LAST_YEAR,
        name: `Year ${getStartOfPreviousYear().year()}`,
        getFromDate: getStartOfPreviousYear,
        getToDate: getEndOfPreviousYear
    }
];