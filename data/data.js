const fs = require('fs');
const auth = require('../utils/auth');
const path = require('path');
const json  = require('../utils/json');

const redirectMap = {
    './data/newsItems.json': 'news',
    './data/servers.json': 'servers',
    './data/members.json': 'roster',
    './data/donators.json': 'donate',
    './data/notifications.json': 'notify'
};

const findIndex = (obj, id) => {
    return obj.findIndex(el => el.id.toString() === id.toString());
};

const reportError = (error, res) => {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(500).json({ error: 'Something went wrong!' });
};

const writeToFileAndRedirect = (file, obj, res) => {
    try {
        fs.writeFileSync(file, json.stringify(obj));
        res.redirect(`/edit#${redirectMap[file]}`);
    } catch (error) {
        reportError(error, res);
    }
};

const addItem = (req, res, obj, file) => {
    auth.authenticate(req, res, function () {
        var item = req.body;
        if (item.id === '-1') {
            item.id = obj.length.toString();
            obj.push(item);
            writeToFileAndRedirect(file, obj, res);
        } else {
            const index = findIndex(obj, item.id);
            if (index !== -1) {
                obj[index] = item;
                writeToFileAndRedirect(file, obj, res);
            } else {
                res.status(404).json({ error: 'ID not found' });
            }
        }
    });
};

const deleteItem = (req, res, obj, file) => {
    auth.authenticate(req, res, function () {
        const index = findIndex(obj, req.body.id);
        if (index !== -1) {
            obj.splice(index, 1);
        } else {
            return res.status(404).json({ error: 'ID not found' });
        }
        return writeToFileAndRedirect(file, obj, res);
    });
};

const getFile = (file) => {
    return JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
};

const addSub = (req, res, obj) => {
    try {
        fs.writeFileSync('./data/pushSubscriptions.json', json.stringify(obj));
        res.status(201).json({message: 'Added Sub'});
    } catch (error) {
        reportError(error, res);
    }
};


const getPushSubscriptions = () => {
    return getFile('./data/pushSubscriptions.json');
};
const getMemberSubscriptions = () => {
    return getFile('./data/pushSubscriptions.json').filter(sub => sub.member);
};

const getData = () => {
    return {
        news: getFile('./data/newsItems.json').sort((a, b) => Date.parse(b.date) - Date.parse(a.date)),
        servers: getFile('./data/servers.json'),
        members: getFile('./data/members.json'),
        donators: getFile('./data/donators.json'),
        squads: getFile('./data/squads.json'),
        memberNotifications: getFile('./data/notifications.json').reverse(),
        key: process.env.vapidPu,
        moment: require('moment')
    };
};

module.exports = {
    addItem,
    addSub,
    deleteItem,
    findIndex,
    getData,
    getPushSubscriptions,
    getMemberSubscriptions
};