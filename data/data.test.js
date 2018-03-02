const data = require('./data');
const httpMocks = require('node-mocks-http');
const fs = require('fs');

describe.only('File Mod Funcs', function () {
    const authHeader = 'Basic ' + new Buffer('usr' + ':' + 'pwd').toString('base64');
    const file = './data/testOBJ.json';
    let fsWriteStub, redirectStub;
    let res = {
        redirect: () => this,
        set: () => this,
        end: () => { },
        status: () => this,
        json: () => res
    };
    beforeEach(() => {
        fsWriteStub = sinon.stub(fs, 'writeFile').yields(null);
        redirectStub = sinon.stub(res, 'redirect');
    });

    afterEach(() => {
        fsWriteStub.restore();
        redirectStub.restore();
    });

    describe.only('Save', function () {

        it('should save bob to file', function () {
            //given
            const expected = JSON.stringify([{
                id: 0,
                name: 'bob'
            }], null, 4);
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
            data.saveSomething(req, res, [], file);
            //then
            expect(fsWriteStub.getCall(0).args[0]).to.equal(file);
            expect(fsWriteStub.getCall(0).args[1]).to.deep.equal(expected);
            expect(redirectStub).to.have.been.calledOnce;
        });

        it('should save bob3 to file and be top of list', function () {
            const expected = JSON.stringify([{
                id: 0,
                name: 'bob'
            },
            {
                id: 1,
                name: 'bob3'
            }], null, 4);

            const testOBJ = [{
                id: 0,
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

            data.saveSomething(req, res, testOBJ, file, true);

            expect(fsWriteStub.getCall(0).args[1]).to.deep.equal(expected);
        });

        it('should change bob to bob2', function () {
            const expected = JSON.stringify([{
                id: 0,
                name: 'bob2'
            },
            {
                id: 1,
                name: 'bob3'
            }], null, 4);

            const testOBJ = [{
                id: 0,
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
            data.saveSomething(req, res, testOBJ, file);
            //then
            expect(fsWriteStub.getCall(0).args[1]).to.deep.equal(expected);
        });
    });
    describe.only('Delete', function () {
        let jsonStub;
        beforeEach(()=>{
            jsonStub = sinon.stub(res, 'json');
        });

        afterEach(()=>{
            jsonStub.restore();
        });

        it('should delete something from file', function () {
            const expected = JSON.stringify([], null, 4);

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
            data.deleteSomething(req, res, testOBJ, file);
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
            data.deleteSomething(req, res, testOBJ, file);
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
            data.deleteSomething(req, res, testOBJ, file);
            //then
            expect(jsonStub).to.have.been.calledWith({error:'Something went wrong!'});
        });
    });
});

describe('findIdx', function () {
    var req = [{ id: 1 }, { id: 0 }];
    it('should find by ID not index', function () {
        //when
        expect(data.findIdx(req, '1') === 0);
    });
    it('should return -1 when not found', function () {
        //when
        expect(data.findIdx(req, '2') === -1);
    });
});