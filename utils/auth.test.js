const httpMocks = require('node-mocks-http');
const auth = require('./auth');

describe.only('Authorization', function () {
    process.env.USR = 'usr';
    process.env.pass = 'pwd';
    var res = {
        redirect:() =>this,
        set:() =>this,
        end:() =>{
            throw new Error();
        },
        status:() =>this,
        json: () =>res
    };

    it('should log in with correct Auth', function () {
    //given
        const req  = httpMocks.createRequest({
            headers : {
                'Authorization' : 'Basic ' + new Buffer('usr' + ':' + 'pwd').toString('base64')
            }
        });
        //when
        auth.authenticate(req,res,function(){
        });
    //then
    });

    it('should fail with no Auth', function () {
    //given
        const req  = httpMocks.createRequest({
            headers : {
                'Authorization' : null
            }
        });
        //when + then
        expect(auth.authenticate(req,res,function(){})).to.throw(Error);
    });

    it('should fail with bad user Auth', function () {
    //given
        const req  = httpMocks.createRequest({
            headers : {
                'Authorization' : 'Basic ' + new Buffer('usr2' + ':' + 'pwd').toString('base64')
            }
        });
        //when + then
        expect(auth.authenticate(req,res,function(){})).to.throw(Error);
    });

    it('should fail with bad pw Auth', function () {
    //given
        const req  = httpMocks.createRequest({
            headers : {
                'Authorization' : 'Basic ' + new Buffer('usr' + ':' + 'pwd2').toString('base64')
            }
        });
        //when + then
        expect(auth.authenticate(req,res,function(){})).to.throw(Error);
    });
});