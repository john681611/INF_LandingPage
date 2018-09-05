const webpush = require('web-push');
const data = require('../data/data');
if(process.env.vapidPu &&  process.env.vapidPr){
    webpush.setVapidDetails(
        'mailto:example@yourdomain.org',
        process.env.vapidPu,
        process.env.vapidPr
    );
}


function notify(message) {
    data.getPushSubscriptions().forEach(sub =>{
        webpush.sendNotification(sub, message).catch(e => console.log(e)); //eslint-disable-line no-console
    });
}

module.exports = {
    notify
};