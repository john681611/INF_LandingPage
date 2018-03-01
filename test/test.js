const request = require('supertest');
const url = 'http://localhost:8080';

describe('Front Page', function () {
    it('should Load Page', function (done) {
        request(url)
            .get('/')
            .send()
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect.equal(res.statusCode, 200);
                if (res.text.indexOf('Iron</span>-Fists','Incorrect Page served') > -1) {
                    expect.to.ok(true);
                }else{
                    expect.to.ok(false);
                }
                done();
            });
    });
});

describe('Edit', function () {
    it('should Load Page', function (done) {
        request(url)
            .get('/edit')
            .auth('usr', 'pwd')
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect.equal(res.statusCode, 200);
                if (res.text.indexOf('Iron</span>-Fists Editing','Incorrect Page served') > -1) {
                    expect.to.ok(true);
                }else{
                    expect.to.ok(false);
                }
                done();
            });
    });
});

describe('Front Page', function () {
    it('should Load Page', function (done) {
        request(url)
            .get('/modlist/0')
            .send()
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect.to.equal(res.statusCode, 200);
                if (res.text.indexOf('RESISTANCE') > -1) {
                    expect.to.ok(true);
                }else{
                    expect.to.ok(false);
                }
                done();
            });
    });

    it('Deal with invalid ID', function (done) {
        request(url)
            .get('/modlist/-1')
            .send()
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect.to.equal(res.statusCode, 404);
                if (res.text.indexOf('No mod List found') > -1) {
                    expect.to.ok(true);
                }else{
                    expect.to.ok(false);
                }
                done();
            });
    });
});

describe('InvalidPage', function () {
    it('safely deal with invalid page', function (done) {
        request(url)
            .get('/fgdhjdfujhg')
            .send()
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect.to.equal(res.statusCode, 404);
                if (res.text.indexOf('This isnt the page your looking for!') > -1) {
                    expect.to.ok(true);
                }else{
                    expect.to.ok(false);
                }
                done();
            });
    });
});