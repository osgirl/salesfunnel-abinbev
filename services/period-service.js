import _ from 'lodash';
import moment from 'moment';

export function getFromCurrentDate(momentDate) {
    var momentDate = (momentDate || moment());
    return momentDate.startOf('day');
};

export function getToCurrentDate(momentDate) {
    var momentDate = (momentDate || moment());
    return momentDate.endOf('day');
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
    return moment().subtract(nrOfWeeksInThePast, 'weeks').startOf('isoWeek');
};

export function getEndOfWeekDate(nrOfWeeksInThePast) {
    return moment().subtract(nrOfWeeksInThePast, 'weeks').endOf('isoWeek');
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

export const DEFAULT_PERIOD = {
    _id: 'YEAR',
    name: 'Last year',
    getFromDate: getLastYearDate,
    getToDate: getToCurrentDate
};

const periods = [
    DEFAULT_PERIOD,
    {
        _id: 'MONTH',
        name: 'Last month',
        getFromDate: getLastMonthDate,
        getToDate: getToCurrentDate
    }, {
        _id: 'WEEK',
        name: 'Last week',
        getFromDate: getLastWeekDate,
        getToDate: getToCurrentDate
    }, {
        _id: 'TODAY',
        name: 'Today',
        getFromDate: getFromCurrentDate,
        getToDate: getToCurrentDate
    }
];