const notify = require('./notification');
const data = require('../data/data');
const fs = require('fs');
const webpush = require('web-push');;

describe('Notification', function () {
    const bob = {name:'bob'}
    const mike = {name:'mike', member:true}
    beforeEach(()=>{
        sinon.stub(webpush, 'sendNotification');
        sinon.stub(data, 'getPushSubscriptions').returns([bob, mike]);
        sinon.stub(data, 'getMemberSubscriptions').returns([mike]);
    });

    afterEach(() => {
        data.getMemberSubscriptions.restore();
        data.getPushSubscriptions.restore();
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
            await notify.sendNotification({message:'lol'},bob);
            expect(webpush.sendNotification).to.have.been.calledWith(bob,'{"message":"lol"}');
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
            await notify.singleNotify('lol',bob);
            expect(webpush.sendNotification).to.have.been.calledWith(bob,'{"message":"lol","url":""}');
        })
    });

    describe('notify', function () {
        it('should singleNotify',  async function () {
            await notify.notify('lol','garry');
            expect(webpush.sendNotification).to.have.been.calledWith(bob,'{"message":"lol","url":"garry"}');
            expect(webpush.sendNotification).to.have.been.calledWith(mike,'{"message":"lol","url":"garry"}');
        })
    });

    describe('notifyMembers', function () {
        it('should singleNotify',  async function () {
            await notify.notifyMembers('lol','garry');
            expect(webpush.sendNotification).to.have.been.calledWith(mike,'{"message":"lol","url":"garry"}');
        })
    });

});
