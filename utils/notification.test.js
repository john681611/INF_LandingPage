const notify = require('./notification');
const data = require('../data/data');
const fs = require('fs');
const webpush = require('web-push');;

describe('Notification', function () {
    beforeEach(()=>{
        sinon.stub(webpush, 'sendNotification');
        sinon.stub(data, 'getPushSubscriptions').returns(['bob', 'garry']);
        sinon.stub(data, 'getMemberSubscriptions').returns(['bangie', 'rhys']);
    });

    afterEach(() => {
        data.getPushSubscriptions.restore();
        data.getMemberSubscriptions.restore();
        webpush.sendNotification.restore();
    });

    describe('sendNotification', function () {

        beforeEach(()=>{
            sinon.stub(fs,'writeFileSync');
            sinon.stub(console, 'error');
            sinon.stub(console, 'log');
        });
    
        afterEach(() => {
            fs.writeFileSync.restore();
            console.error.restore();
            console.log.restore();
        });
    

        it('should send notification',  async function () {
            await notify.sendNotification({message:'lol'},'garry');
            expect(webpush.sendNotification).to.have.been.calledWith('garry','{"message":"lol"}');
        })

        it('should log odd error',  async function () {
            webpush.sendNotification.rejects({statusCode: 500})
            await notify.sendNotification({message:'lol'},'garry');
            expect(console.error).to.have.been.calledWith({statusCode: 500});
        })

        it('should remove rejected subscription if not member',  async function () {
            data.getPushSubscriptions.returns([{endpoint: 101}])
            webpush.sendNotification.rejects({statusCode: 410})
            await notify.sendNotification({message:'lol'},{endpoint: 101});
            expect(fs.writeFileSync).to.have.been.calledWith('./data/pushSubscriptions.json','[]');
            expect(console.log).to.have.been.calledWith('removed user');
        })

        it('should remove rejected subscription if a member',  async function () {
            data.getMemberSubscriptions.returns([{endpoint: 101}])
            webpush.sendNotification.rejects({statusCode: 410})
            await notify.sendNotification({message:'lol'},{endpoint: 101}, true);
            expect(fs.writeFileSync).to.have.been.calledWith('./data/member/pushSubscriptions.json','[]');
            expect(console.log).to.have.been.calledWith('removed user');
        })

        it('should not remove rejected subscription if not found',  async function () {
            data.getPushSubscriptions.returns([{endpoint: 102}])
            webpush.sendNotification.rejects({statusCode: 410})
            await notify.sendNotification({message:'lol'},{endpoint: 101});
            expect(fs.writeFileSync).to.have.not.been.called;
            expect(console.log).to.have.not.been.called;
        })
    })

    describe('singleNotify', function () {
        it('should singleNotify',  async function () {
            await notify.singleNotify('lol','garry');
            expect(webpush.sendNotification).to.have.been.calledWith('garry','{"message":"lol","url":""}');
        })
    });

    describe('notify', function () {
        it('should singleNotify',  async function () {
            await notify.notify('lol','garry');
            expect(webpush.sendNotification).to.have.been.calledWith('garry','{"message":"lol","url":"garry"}');
            expect(webpush.sendNotification).to.have.been.calledWith('bob','{"message":"lol","url":"garry"}');
        })
    });

    describe('notifyMembers', function () {
        it('should singleNotify',  async function () {
            await notify.notifyMembers('lol','garry');
            expect(webpush.sendNotification).to.have.been.calledWith('bangie','{"message":"lol","url":"garry"}');
            expect(webpush.sendNotification).to.have.been.calledWith('rhys','{"message":"lol","url":"garry"}');
        })
    });

});
