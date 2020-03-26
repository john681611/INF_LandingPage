const webpush = require('web-push');
const data = require('../data/data');
const fs = require('fs');
const json = require('./json');

if(process.env.vapidPu &&  process.env.vapidPr) {
    webpush.setVapidDetails(
        'mailto:example@yourdomain.org',
        process.env.vapidPu,
        process.env.vapidPr
    );
}

const sendNotification = async (messageObj, sub) => {
    try {
        await webpush.sendNotification(sub, JSON.stringify(messageObj));
    } catch (err) {
        if(err.statusCode === 410) {
            const subs =  data.getPushSubscriptions();
            const existingSubIndex = subs.findIndex(subscriber => sub.endpoint === subscriber.endpoint);
            if(existingSubIndex != -1) {
                subs.splice(existingSubIndex, 1);
                fs.writeFileSync('./data/pushSubscriptions.json', json.stringify(subs));
                console.log('removed user');
            }
        } else {
            console.error(err);
        }
    }
}

function notify(message, url) {
    data.getPushSubscriptions().forEach(sub =>{
        sendNotification({message, url}, sub);
    });
}

function notifyMembers(message, url) {
    data.getMemberSubscriptions().forEach(sub =>{
        sendNotification({message, url}, sub, true);
    });
}

function singleNotify(message, sub) {
    sendNotification({message, url: ''}, sub);
}


module.exports = {
    notify,
    notifyMembers,
    singleNotify,
    sendNotification
};