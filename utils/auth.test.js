const httpMocks = require('node-mocks-http');
const auth = require('./auth');
const res = require('../test/res.mock');

describe('Authorization', function () {
    process.env.USR = 'usr';
    process.env.PASS = 'pwd';
    let endSpy;

    beforeEach(() => {
        endSpy = sinon.spy(res, 'end');
    });

    afterEach(() => {
        endSpy.restore();
    });
    it('should log in with correct Auth', function () {
        const spy = sinon.spy();
        const req = httpMocks.createRequest({
            headers: {
                'Authorization': 'Basic ' + new Buffer('usr' + ':' + 'pwd').toString('base64')
            }
        });

        auth.authenticate(req, res, spy);

        expect(spy).to.have.been.calledOnce;
    });

    it('should fail with no Auth', function () {
        const req = httpMocks.createRequest({
            headers: {
                'Authorization': null
            }
        });

        auth.authenticate(req, res, function () { });

        expect(endSpy).to.have.been.calledOnce;
    });

    it('should fail with bad user Auth', function () {
        const req = httpMocks.createRequest({
            headers: {
                'Authorization': 'Basic ' + new Buffer('usr2' + ':' + 'pwd').toString('base64')
            }
        });

        auth.authenticate(req, res, function () { });

        expect(endSpy).to.have.been.calledOnce;
    });

    it('should fail with bad pw Auth', function () {
        const req = httpMocks.createRequest({
            headers: {
                'Authorization': 'Basic ' + new Buffer('usr' + ':' + 'pwd2').toString('base64')
            }
        });

        auth.authenticate(req, res, function () { });

        expect(endSpy).to.have.been.calledOnce;
    });
});

describe('Member Auth', function () {
    process.env.MEMPASS = 'pwd';


    it('should log in with correct Auth', function () {
        expect(auth.authenticateMember('pwd')).to.be.true;
    });

    it('should reject with bad pass', function () {
        expect(auth.authenticateMember('wrong')).to.be.false;
    });
});

describe('allowMultiOrigin', () => {
    const res = {
        header: sinon.stub()
    };
    it('should add headers and content type', () => {
       

        auth.allowMultiOrigin(res);
        expect(res.header).to.have.been.calledWith('Access-Control-Allow-Origin', '*');
        expect(res.header).to.have.been.calledWith('Access-Control-Allow-Headers', 'X-Requested-With');
        expect(res.header).to.have.been.calledWith('Content-Type', 'application/json');
    });

    it('should add headers and content type with post true', () => {

        auth.allowMultiOrigin(res, true);
        expect(res.header).to.have.been.calledWith('Access-Control-Allow-Origin', '*');
        expect(res.header).to.have.been.calledWith('Access-Control-Allow-Headers', 'Content-Type');
        expect(res.header).to.have.been.calledWith('Content-Type', 'application/json');
    });
});