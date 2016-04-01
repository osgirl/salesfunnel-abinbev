import { getPeriods, getPeriodById, getStartOfWeekDate, getEndOfWeekDate, getStartOfMonthDate, getEndOfMonthDate, getStartOfYearDate, getEndOfYearDate,
    CURRENT_WEEK, LAST_WEEK, CURRENT_MONTH, LAST_MONTH, CURRENT_YEAR, LAST_YEAR, monthNames } from '../../services/period-service.js';
import {expect, assert} from 'chai';
import moment from 'moment';

var chai = require('chai');
chai.use(require('chai-datetime'));

import { check } from '../helpers/chai-helpers.js';

describe("Default periods", function () {
    it("should return six default periods", function (done) {
        getPeriods()
            .then(periods => {
                check(done, function () {
                    expect(periods.length).to.equal(6);
                });
            });
    });
});

describe("Get Period By Id", function () {
    it(`calling ${CURRENT_WEEK} returns an object containing a function to receive the correct startDate and endDate`, function (done) {
        getPeriodById(CURRENT_WEEK)
            .then(period => {
                check(done, function () {
                    expect(period.name).to.contain(moment().isoWeek());
                    expect(period.getFromDate().toDate()).to.equalDate(getStartOfWeekDate().toDate());
                    expect(period.getToDate().toDate()).to.equalDate(getEndOfWeekDate().toDate());
                });
            })
    });

    it(`calling ${LAST_WEEK} returns an object containing a function to receive the correct startDate and endDate`, function(done) {
        getPeriodById(LAST_WEEK)
            .then(period => {
                check(done, function () {
                    expect(period.name).to.contain(moment().subtract(1, 'weeks').isoWeek());
                    expect(period.getFromDate().toDate()).to.equalDate(getStartOfWeekDate(1).toDate());
                    expect(period.getToDate().toDate()).to.equalDate(getEndOfWeekDate(1).toDate());
                });
            })
    });

    it(`calling ${CURRENT_MONTH} returns an object containing a function to receive the correct startDate and endDate`, function(done) {
        getPeriodById(CURRENT_MONTH)
            .then(period => {
                check(done, function () {
                    expect(period.name).to.contain(monthNames[moment().month()]);
                    expect(period.getFromDate().toDate()).to.equalDate(getStartOfMonthDate().toDate());
                    expect(period.getToDate().toDate()).to.equalDate(getEndOfMonthDate().toDate());
                });
            })
    });

    it(`calling ${LAST_MONTH} returns an object containing a function to receive the correct startDate and endDate`, function(done) {
        getPeriodById(LAST_MONTH)
            .then(period => {
                check(done, function () {
                    expect(period.name).to.contain(monthNames[moment().subtract(1, 'months').month()]);
                    expect(period.getFromDate().toDate()).to.equalDate(getStartOfMonthDate(1).toDate());
                    expect(period.getToDate().toDate()).to.equalDate(getEndOfMonthDate(1).toDate());
                });
            })
    });

    it(`calling ${CURRENT_YEAR} returns an object containing a function to receive the correct startDate and endDate`, function(done) {
        getPeriodById(CURRENT_YEAR)
            .then(period => {
                check(done, function () {
                    expect(period.name).to.contain(moment().year());
                    expect(period.getFromDate().toDate()).to.equalDate(getStartOfYearDate().toDate());
                    expect(period.getToDate().toDate()).to.equalDate(getEndOfYearDate().toDate());
                });
            })
    });

    it(`calling ${LAST_YEAR} returns an object containing a function to receive the correct startDate and endDate`, function(done) {
        getPeriodById(LAST_YEAR)
            .then(period => {
                check(done, function () {
                    expect(period.name).to.contain(moment().subtract(1, 'years').year());
                    expect(period.getFromDate().toDate()).to.equalDate(getStartOfYearDate(1).toDate());
                    expect(period.getToDate().toDate()).to.equalDate(getEndOfYearDate(1).toDate());
                });
            })
    });
});