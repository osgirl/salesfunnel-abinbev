import {expect} from 'chai';
import app from '../../app';
import supertest from 'supertest';
import SupertestHelpers from '../helpers/supertest-helpers.js'
import { getRandomPathReq } from '../helpers/random-helpers.js'

var request = supertest(app);
var helpers = new SupertestHelpers([]);

describe("API GET methods", function() {
    var randomText = getRandomPathReq();
    var homePage = '/';
    it(`GET ${randomText} redirects to the homepage`, function(done) {

        request.get(`/*${randomText}`)
            .expect(302)
            .expect(function (res) {
                if (res.redirect === false) {
                    helpers.throwError("function should redirect")
                }
                if (res.header.location !== homePage) {
                    helpers.throwError(`should redirect to "${homePage}" but instead was redirected to "${res.header.location}"`)
                }
            })
        .end(done);
    });
});