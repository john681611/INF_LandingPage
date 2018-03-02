const httpMocks = require('node-mocks-http');
const auth = require('./auth');

describe('Authorization', function () {
    process.env.USR = 'usr';
    process.env.pass = 'pwd';
    let endSpy;
    let res = {
        redirect:() =>this,
        set:() =>this,
        end:() =>{
        },
        status:() =>this,
        json: () =>res
    };

    beforeEach(()=>{
        endSpy = sinon.spy(res,'end');
    });

    afterEach(() => {
        endSpy.restore();
    });
    it('should log in with correct Auth', function () {
        let spy =  sinon.spy();
        const req  = httpMocks.createRequest({
            headers : {
                'Authorization' : 'Basic ' + new Buffer('usr' + ':' + 'pwd').toString('base64')
            }
        });

        auth.authenticate(req,res,spy);

        expect(spy).to.have.been.calledOnce;
    });

    it('should fail with no Auth', function () {
        const req  = httpMocks.createRequest({
            headers : {
                'Authorization' : null
            }
        });

        auth.authenticate(req,res,function(){});

        expect(endSpy).to.have.been.calledOnce;
    });

    it('should fail with bad user Auth', function () {
        const req  = httpMocks.createRequest({
            headers : {
                'Authorization' : 'Basic ' + new Buffer('usr2' + ':' + 'pwd').toString('base64')
            }
        });

        auth.authenticate(req,res,function(){});

        expect(endSpy).to.have.been.calledOnce;
    });

    it('should fail with bad pw Auth', function () {
        const req  = httpMocks.createRequest({
            headers : {
                'Authorization' : 'Basic ' + new Buffer('usr' + ':' + 'pwd2').toString('base64')
            }
        });

        auth.authenticate(req,res,function(){});

        expect(endSpy).to.have.been.calledOnce;
    });
});