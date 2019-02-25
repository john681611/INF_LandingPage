const data = require('./data');
const httpMocks = require('node-mocks-http');
const fs = require('fs');
const res = require('../test/res.mock');
const json  = require('../utils/json');

describe('File Mod Funcs', function () {
    const authHeader = 'Basic ' + new Buffer('usr:pwd').toString('base64');
    const file = './data/testOBJ.json';
    let fsWriteStub, redirectStub, jsonStub, statusStub;
    beforeEach(() => {
        fsWriteStub = sinon.stub(fs, 'writeFile').yields(null);
        redirectStub = sinon.stub(res, 'redirect');
        jsonStub = sinon.stub(res, 'json');
        statusStub = sinon.stub(res, 'status').returns({json: jsonStub});
    });

    afterEach(() => {
        fsWriteStub.restore();
        redirectStub.restore();
        jsonStub.restore();
        statusStub.restore();
    });

    describe('AddItem', function () {

        it('should add new item to empty file', function () {
            //given
            const expected = json.stringify([{
                id: '0',
                name: 'bob'
            }]);
            const req = httpMocks.createRequest({
                body: {
                    id: '-1',
                    name: 'bob'
                },
                headers: {
                    'Authorization': authHeader
                }
            });
            //when
            data.addItem(req, res, [], file);
            //then
            expect(fsWriteStub.getCall(0).args[0]).to.equal(file);
            expect(fsWriteStub.getCall(0).args[1]).to.deep.equal(expected);
            expect(redirectStub).to.have.been.calledOnce;
        });

        it('should add new item to a non empty file', function () {
            const expected = json.stringify([{
                id: '0',
                name: 'bob'
            },
            {
                id: '1',
                name: 'bob3'
            }]);

            const testOBJ = [{
                id: '0',
                name: 'bob'
            }];

            const req = httpMocks.createRequest({
                body: {
                    id: '-1',
                    name: 'bob3'
                },
                headers: {
                    'Authorization': authHeader
                }
            });

            data.addItem(req, res, testOBJ, file, true);

            expect(fsWriteStub.getCall(0).args[1]).to.deep.equal(expected);
        });

        it('should change bob to bob2', function () {
            const expected = json.stringify([{
                id: '0',
                name: 'bob2'
            }]);

            const testOBJ = [{
                id: '0',
                name: 'bob'
            }];

            const req = httpMocks.createRequest({
                body: {
                    id: '0',
                    name: 'bob2'
                },
                headers: {
                    'Authorization': authHeader
                }
            });
            //when
            data.addItem(req, res, testOBJ, file);
            //then
            expect(fsWriteStub.getCall(0).args[1]).to.deep.equal(expected);
        });

        it('should handle index error', function () {

            const testOBJ = [{
                id: 1,
                name: 'bob'
            }];

            const req = httpMocks.createRequest({
                body: {
                    id: '0'
                },
                headers: {
                    'Authorization': authHeader
                }
            });
            //when
            data.deleteItem(req, res, testOBJ, file);
            //then
            expect(statusStub).to.have.been.calledWith(404);
            expect(jsonStub).to.have.been.calledWith({error:'ID not found'});
        });

        it('should handle fileWrite error', function () {
            fsWriteStub.yields('fuck');
            const testOBJ = [{
                id: 1,
                name: 'bob'
            }];

            const req = httpMocks.createRequest({
                body: {
                    id: '1'
                },
                headers: {
                    'Authorization': authHeader
                }
            });
            //when
            data.deleteItem(req, res, testOBJ, file);
            //then
            expect(statusStub).to.have.been.calledWith(500);
            expect(jsonStub).to.have.been.calledWith({error:'Something went wrong!'});
        });
    });

    describe('deleteItem', function () {

        it('should delete something from file', function () {
            const expected = json.stringify([]);

            const testOBJ = [{
                id: 0,
                name: 'bob'
            }];

            const req = httpMocks.createRequest({
                body: {
                    id: '0'
                },
                headers: {
                    'Authorization': authHeader
                }
            });
            //when
            data.deleteItem(req, res, testOBJ, file);
            //then
            expect(fsWriteStub.getCall(0).args[0]).to.equal(file);
            expect(fsWriteStub.getCall(0).args[1]).to.deep.equal(expected);
            expect(redirectStub).to.have.been.calledOnce;
        });

        it('should handle index error', function () {

            const testOBJ = [{
                id: 1,
                name: 'bob'
            }];

            const req = httpMocks.createRequest({
                body: {
                    id: '0'
                },
                headers: {
                    'Authorization': authHeader
                }
            });
            //when
            data.deleteItem(req, res, testOBJ, file);
            //then
            expect(jsonStub).to.have.been.calledWith({error:'ID not found'});
        });

        it('should handle fileWrite error', function () {
            fsWriteStub.yields('fuck');
            const testOBJ = [{
                id: 1,
                name: 'bob'
            }];

            const req = httpMocks.createRequest({
                body: {
                    id: '1'
                },
                headers: {
                    'Authorization': authHeader
                }
            });
            //when
            data.deleteItem(req, res, testOBJ, file);
            //then
            expect(jsonStub).to.have.been.calledWith({error:'Something went wrong!'});
        });
    });

    describe('addSub', function  () {
        it('should add subscriptions to file', function () {
            const obj = {bob:'bob'};
            data.addSub(null, null, obj);
            expect(fsWriteStub.getCall(0).args[0]).to.be.equal('./data/pushSubscriptions.json');
            expect(fsWriteStub.getCall(0).args[1]).to.be.equal(json.stringify(obj));
        });

        it('should respond with error message', function () {
            fsWriteStub.yields('fuck');
            data.addSub(null, res, {});
            expect(jsonStub).to.have.been.calledWith({error:'Something went wrong!'});
        });
    });

    describe('addMemberSub', function  () {
        it('should add subscriptions to file', function () {
            const obj = {bob:'bob'};
            data.addMemberSub(null, null, obj);
            expect(fsWriteStub.getCall(0).args[0]).to.be.equal('./data/member/pushSubscriptions.json');
            expect(fsWriteStub.getCall(0).args[1]).to.be.equal(json.stringify(obj));
        });

        it('should respond with error message', function () {
            fsWriteStub.yields('fuck');
            data.addMemberSub(null, res, {});
            expect(jsonStub).to.have.been.calledWith({error:'Something went wrong!'});
        });
    });
});

describe('findIndex', function () {
    var req = [{ id: 2 },{ id: '1' }, { id: '0' }];
    it('should find by ID not index', function () {
        //when
        expect(data.findIndex(req, '1') === 1);
    });

    it('should return -1 when not found', function () {
        //when
        expect(data.findIndex(req, '3') === -1);
    });

    it('should deal with num and string', function () {
        //when
        expect(data.findIndex(req, '2') === 0);
    });
});


describe('getData', function () {
    let fsStub;
    beforeEach(() => {
        fsStub = sinon.stub(fs,'readFileSync').returns('[{"date":"2018-01-28"}]');
    });

    afterEach(() => {
        fsStub.restore();
    });

    it('should get data files via FS', function () {
        //when
        data.getData();
        expect(fsStub).to.have.been.callCount(7);
    });

    it('should return a set of objects', function () {
        //when
        expect(data.getData()).to.be.a('object');
    });

    it('should update when files change', function () {
        const inital = data.getData();
        fsStub.returns('[{"date":"2019-01-28"}]');
        const after = data.getData();
        expect(after).not.to.deep.equal(inital);
        expect(after.servers).not.to.deep.equal(inital.servers);
    });
});
