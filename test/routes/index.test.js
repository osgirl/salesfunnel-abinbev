import {expect} from 'chai';
import app from '../../app';
import supertest from 'supertest';
import SupertestHelpers from '../helpers/supertest-helpers.js'

var request = supertest(app);
var helpers = new SupertestHelpers(['<html>', '</html>', '<body>', '</body>', '<head>', '</head>']);

describe("API GET methods", function() {
    it("GET '/' gives the homepage", function(done) {
        var reponse = request.get("/");

        helpers.verifySuccess(reponse)
            .expect(function (res) {
                helpers.containsAllSubstrings(res.text, ['<title>Sales funnel - reporting tool - AB Inbev</title>'])
            }).end(done);
    });
});