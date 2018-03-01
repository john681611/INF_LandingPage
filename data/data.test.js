const data = require('./data');
const httpMocks = require('node-mocks-http');

describe('File Mod Funcs', function () {
    const authHeader = 'Basic ' + new Buffer('usr' + ':' + 'pwd').toString('base64');
    var testObj = require('../data/testOBJ.json');
    var res = {
        redirect:() =>this,
        set:() =>this,
        end:() =>{
            throw new Error();
        },
        status:() =>this,
        json: () =>res
    };

    it('should save bob to file', function () {
    //given
        var req  = httpMocks.createRequest({
            body:{
                id:'-1',
                name:'bob'
            },
            headers : {
                'Authorization' : authHeader
            }
        });
        //when
        data.saveSomething(req,res,testObj,'./data/testOBJ.json');
        //then
        expect(testObj.length === 1,'object not changed');
        expect(testObj[0].name, 'bob');
        expect(require('../data/testOBJ.json')).deepEqual(testObj, 'object not saved');
    });

    it('should save bob3 to file and be top of list', function () {
    //given
        var req  = httpMocks.createRequest({
            body:{
                id:'-1',
                name:'bob3'
            },
            headers : {
                'Authorization' : authHeader
            }
        });
        //when
        data.saveSomething(req,res,testObj,'./data/testOBJ.json',true);
        //then
        expect(testObj.length === 2,'object not changed');
        expect(testObj[0].name === 'bob3', 'bob3 not first ' + testObj[0].name + ' was.');
        expect(require('../data/testOBJ.json')).deepEqual( testObj, 'object not saved');
    });

    it('should change bob to bob2', function () {
    //given
        var req  = httpMocks.createRequest({
            body:{
                id:'0',
                name:'bob2'
            },
            headers : {
                'Authorization' : authHeader
            }
        });
        //when
        data.saveSomething(req,res,testObj,'./data/testOBJ.json');
        //then
        expect(testObj.length === 2,'object not changed');
        expect(testObj[1].name === 'bob2','name not changed');
        expect(require('../data/testOBJ.json')).deepEqual(testObj, 'object not saved');
    });

    it('should delete something from file file', function () {
    //given
        var req  = httpMocks.createRequest({
            body:{
                id:'0'
            },
            headers : {
                'Authorization' : authHeader
            }
        });
        //when
        data.deleteSomething(req,res,testObj,'./data/testOBJ.json');
        //then
        expect(testObj.length === 1,'object not deleted');
        expect(require('../data/testOBJ.json')).deepEqual(testObj, 'object not saved');
    });

    it('should delete something from file file', function () {
    //given
        var req  = httpMocks.createRequest({
            body:{
                id:'1'
            },
            headers : {
                'Authorization' : authHeader
            }
        });
        //when
        data.deleteSomething(req,res,testObj,'./data/testOBJ.json');
        //then
        expect(testObj.length === 0,'object not deleted');
        expect(require('../data/testOBJ.json')).deepEqual(testObj, 'object not saved');
    });
});

describe('findIdx', function () {
    var req  = [{id:1},{id:0}];
    it('should find by ID not index', function () {
    //when
        expect(data.findIdx(req,'1') === 0);
    });
    it('should return -1 when not found', function () {
    //when
        expect(data.findIdx(req,'2') === -1);
    });
});