import _ from 'lodash';
import moment from 'moment';

var getFromCurrentDate = function () {
    return moment().startOf('day');
};

var getToCurrentDate = function () {
    return moment().endOf('day');
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