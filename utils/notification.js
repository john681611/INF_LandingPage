const webpush = require('web-push');
const data = require('../data/data');
if(process.env.vapidPu &&  process.env.vapidPr){
    webpush.setVapidDetails(
        'mailto:example@yourdomain.org',
        process.env.vapidPu,
        process.env.vapidPr
    );
}


function notify(message, url) {
    data.getPushSubscriptions().forEach(sub =>{
        webpush.sendNotification(sub, JSON.stringify({message, url})).catch(e => console.log(e)); //eslint-disable-line no-console
    });
}

function notifyMembers(message, url) {
    data.getMemberSubscriptions().forEach(sub =>{
        webpush.sendNotification(sub, JSON.stringify({message, url})).catch(e => console.log(e)); //eslint-disable-line no-console
    });
}

function singleNotify(message, sub) {
    webpush.sendNotification(sub, JSON.stringify({message, url:''})).catch(e => console.log(e)); //eslint-disable-line no-console
}

module.exports = {
    notify,
    notifyMembers,
    singleNotify
};