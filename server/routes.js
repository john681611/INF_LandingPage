const express = require('express');
const router = new express.Router();
const data = require('../data/data');
const auth = require('../utils/auth');
const path = require('path');
const notification = require('../utils/notification');
const fs = require('fs');

router.get('/', function (req, res) {
    res.render('index.ejs');
});

router.get('/edit', function (req, res) {
    auth.authenticate(req, res, function () {
        res.render('edit.ejs', data.getData());
    });
});

router.get('/api', function (req, res) {
    res.end(JSON.stringify(data.getData()));
});

router.get('/modlist/:id', function (req, res) {
    const servers =  data.getData().servers;
    if (req.params.id >= 0  && req.params.id <= servers.length) {
        res.render('importModList.ejs', servers[req.params.id]);
    } else {
        res.status(404).send('No mod List found');
    }
});

router.get('/serverFile', function (req, res) {
    auth.authenticate(req, res, function () {
        res.sendFile(path.join(__dirname, 'data', 'servers.json'));
    });
});

router.post('/serverFile', function (req, res) {
    auth.authenticate(req, res, function () {
        data.servers = JSON.parse(req.body.json);
        fs.writeFile('./data/servers.json', req.body.json, function (error) {
            if (error) {
                return res.status(500).json({ error: 'Something went wrong!' });
            }
            res.redirect('/edit#servers');
        });
    });
});

router.get('/trip', function (req, res) {
    res.end(JSON.stringify(data.getTripData()));
});

router.post('/trip', function (req, res) {
    trips = data.getTripData()
    trip = req.body
    trips.push(trip)
    fs.writeFile('./data/trips.json', JSON.stringify(trips), function (error) {
        if (error) {
            return res.status(500).json({ error: 'Something went wrong!' });
        }
        return res.send("done")
    });
});

router.post('/news', function (req, res) {
    auth. authenticate(req, res, function () {
        const updateType =  req.body.id === '-1'? 'New' : 'Updated';
        const newsType = req.body.event === 'on'? 'event': 'news';
        notification.notify(`${updateType} ${newsType}: ${req.body.title}.`, req.body.link);
        data.addItem(req, res, data.getData().news, './data/newsItems.json', true);
    });
});

router.post('/delete/news', function (req, res) {
    data.deleteItem(req, res, data.getData().news, './data/newsItems.json');
});

router.post('/member', function (req, res) {
    data.addItem(req, res, data.getData().members, './data/members.json');
});

router.post('/delete/member', function (req, res) {
    data.deleteItem(req, res, data.getData().members, './data/members.json');
});

router.post('/donator', function (req, res) {
    data.addItem(req, res, data.getData().donators, './data/donators.json');
});

router.post('/delete/donator', function (req, res) {
    data.deleteItem(req, res, data.getData().donators, './data/donators.json');
});

router.post('/sendMessage', function (req, res) {
    auth.authenticate(req, res, function () {
        notification.notifyMembers(`Member Message: ${req.body.message}.`, req.body.url);
        data.addItem(req, res, data.getData().memberNotifications, './data/notifications.json');
    });
});


router.post('/subscription', function(req, res){
    if(req.body.member) {
        if(auth.authenticateMember(req.body.member)){
            req.body.member = true;
        } else {
            return res.status(401).send('failed Auth');
        }
    }
    if(req.body.endpoint) {
        const subs = data.getPushSubscriptions();
        if (!subs.find(sub => req.body.endpoint === sub.endpoint)){
            subs.push(req.body);
            notification.singleNotify(`News ${req.body.member? 'and Member' : ''} Notifications Active`, req.body);
            return data.addSub(req, res, subs);
        }
    }
    return res.status(400).send('bad request');
});

router.post('/delete/subscription', function(req, res){
    if(req.body.endpoint) {
        const subs = data.getPushSubscriptions();
        const found = subs.indexOf(subs.find(sub => sub.endpoint = req.body.endpoint));
        if (found !== -1){
            subs.splice(found, 1);
            return data.addSub(req, res, subs);
        }
    }
    return res.status(400).send('bad request');
});

module.exports = {
    router
};