/**
 * Created by amills001c on 6/23/15.
 */


//core
var URL = require('url');
var supertest = require('supertest');
var http = require('http');
var assert = require('assert');


describe('@Test_Live_Deployment*', function () {

    var self = null;

    before(function (done) {

        self = this;

        var config = require('univ-config')(module, this.test.parent.title, 'config/test-config');
        var constants = config.get('sc_constants');
        var serverURL = config.get('test_env').smartconnect_server_config.url;
        var serverPort = config.get('test_env').smartconnect_server_config.port;


        // Payloads
        self.stbNoEnrich = require('../test_data/other_payloads/stb_no_enrich.json');
        self.ivrNoEnrich = require('../test_data/other_payloads/ivr_no_enrich.json');
        self.otherNoEnrich = require('../test_data/other_payloads/other_no_enrich.json');
        self.stbEnrich = require('../test_data/other_payloads/stb_enrich.json');
        self.ivrEnrich = require('../test_data/other_payloads/ivr_enrich.json');
        self.STBTestJson = require('../test_data/other_payloads/testSTB_bogus.json');
        self.IVRTestJson = require('../test_data/other_payloads/testIVR_bogus.json');


        var getFirstPath = function (accountNum) {
            var firstPath = constants.contextstore.BasePath + 'Customers/' + accountNum + '/Incidents/Ingest';
            return firstPath;
        };

        self.$url = serverURL.concat(':').concat(serverPort);
        log.info(colors.bgYellow('Server being hit:', self.$url));


    });


    it('Should return error 400 when message is not application/json', function (done) {

        supertest(self.$url)
            .post('/event')
            .send('test')
            .expect(400)
            .end(function (err, res) {
                if (err) {
                    //TODO: handle this error
                    return done(err);
                } else {
                    assert(res.statusCode === 400);
                    done();
                }

            });
    });

    it('Should accept request with source STB and the request body received should not be enriched.', function (done) {
        var postPath = getFirstPath(stbNoEnrich.customer.accountnum);
        supertest(self.$url)
            .post('/event')
            .send(self.stbNoEnrich)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    //TODO: handle this error
                    return done(err);
                } else {
                    //res.text.should.equal(JSON.stringify(successReply));
                    done();
                }

            });
    });

    it('Should accept request with source IVR and the request body received should not be enriched.', function (done) {
        var postPath = getFirstPath(ivrNoEnrich.customer.accountnum);

        supertest(self.$url)
            .post('/event')
            .send(self.ivrNoEnrich)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    //TODO: handle this error
                    return done(err);
                } else {
                    //var str = JSON.stringify(successReply);
                    //res.text.should.equal(str);
                    done();
                }
            });
    });

    it('Should accept request that is not source IVR and not source STB. The request body received should not be enriched.', function (done) {
        var postPath = getFirstPath(otherNoEnrich.customer.accountnum);

        supertest(self.$url)
            .post('/event')
            .send(self.otherNoEnrich)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    //TODO: handle this error
                    return done(err);
                } else {
                    assert(res.statusCode === 201);

                    // If the message received equals the message sent
                    // it means the data was not enriched

                    //var str = JSON.stringify(successReply);
                    //res.text.should.equal(str);
                    done();
                }

            });
    });

    it('Should should enrich data for source STB.', function (done) {
        var postPath = getFirstPath(stbEnrich.customer.accountnum);
        supertest(self.$url)
            .post('/event')
            .send(self.stbEnrich)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    //TODO: handle this error
                    done(err);
                } else {
                    assert(res.statusCode === 201);
                    //res.text.should.equal(JSON.stringify(successReply));
                    done();
                }

            });
    });

    it('Should enrich data for source IVR.', function (done) {
        var postPath = getFirstPath(ivrEnrich.customer.accountnum);

        supertest(self.$url)
            .post('/event')
            .send(self.ivrEnrich)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    //TODO: handle this error
                    done(err);
                } else {
                    assert(res.statusCode === 201);
                    //var str = JSON.stringify(successReply);
                    //res.text.should.equal(str);
                    done();
                }

            });
    });


    it('Should return 201 contextstore is up.', function (done) {
        var postPath = getFirstPath(otherNoEnrich.customer.accountnum);

        supertest(self.$url)
            .post('/event')
            .send(self.otherNoEnrich)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    // This should return an error if the contextstore is down.
                    done(err);
                } else {
                    assert(res.statusCode === 201);
                    done();
                }

            });
    });


    it('Should forward empty payload to contextstore.', function (done) {
        var postPath = getFirstPath('');

        supertest(self.$url)
            .post('/event')
            .send({})
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    //var str = JSON.stringify(successReply);
                    //res.text.should.equal(str);
                    done();
                }

            });
    });

    //TODO:figure out a good test for no-enrich on prod

    //it('Should should not enrich data for source STB when no_enrich is set to true.', function (done) {
    //
    //    // Set the no_enrich to true.
    //
    //    nconf.set('no_enrich', true);
    //    var postPath = getFirstPath(stbEnrich.customer.accountnum);
    //
    //    request(url.parse(serverURL.concat(':').concat(serverPort)))
    //        .post('/event')
    //        .send(stbEnrich)
    //        .expect(201)
    //        .end(function (err, res) {
    //            if (err) {
    //                //TODO: handle this error
    //                return done(err);
    //            }
    //            res.statusCode.should.equal(201);
    //            res.text.should.equal(JSON.stringify(successReply));
    //            done();
    //        });
    //});

    it('Should return 200 when /info is called.', function (done) {
        supertest(self.$url)
            .get('/info')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    assert(res.statusCode === 200);
                    done();
                }

            });
    });

    it('Should return 200 when /log_stdout is called.', function (done) {
        supertest(self.$url)
            .get('/log_stdout')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    assert(res.statusCode === 200);
                    done();
                }

            });
    });

    it('Should return 200 when /log_stderr is called.', function (done) {
        supertest(self.$url)
            .get('/log_stderr')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    assert(res.statusCode === 200);
                    done();
                }

            });
    });

    it('Should return 201 Status when given erroneous STB json', function (done) {
        var reqServer = request(self.$url);
        var getPath = reqServer.post('/event');
        var send = getPath.send(self.STBTestJson);
        var expect = send.expect(201);
        send.end(function (err, res) {
            if (err) {
                done(err);
            } else {
                //var str = JSON.stringify(successReply);
                //res.text.should.equal(str);
                done();
            }

        });
    });

    it('Should return 201 Status when given errneous IVR json', function (done) {

        supertest(self.$url)
            .post('/event')
            .send(self.IVRTestJson)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    //var str = JSON.stringify(successReply);
                    //res.text.should.equal(str);
                    done();
                }
            });
    });

});
