const express = require('express');
const data = require('../data/data');

describe('router', () => {
    let app;
    beforeEach(() => {
        app = express().use('/', require('./routes').router)
        app.set('views', 'page/views');
        app.set('view engine', 'ejs');;
    });

    describe('/', () => {
        it('should render index.ejs', async () => {
            const res = await chai.request(app).get('/');
            expect(res.text).to.contain('<title>Iron-Fists Home</title>');
            expect(res.status).to.equal(200);
        });
    });

    describe('/api', () => {
        it('should return data from getData', async () => {
            const dataReturned = {something: 'bob'};
            sinon.stub(data, 'getData').returns(dataReturned)
            const res = await chai.request(app).get('/api');
            expect(res.text).to.equal(JSON.stringify(dataReturned));
        });
    });

    describe('/modlist/:id', () => {
        it('', () => {
            expect(1).to.equal(2)
        });
    });
});
