const express = require('express');
const router = new express.Router();
const data = require('../data/data');
const auth = require('../utils/auth');
const path = require('path');
const notification = require('../utils/notification');
const fs = require('fs');

router.get('/', function (req, res) {
    res.renderMin('index.ejs', data.getData());
});

router.get('/forum', function (req, res) {
    res.renderMin('forum.ejs', data.getData());
});

router.get('/modlist/:id', function (req, res) {
    if (req.params.id >= 0  && req.params.id <= data.servers.length) {
        res.render('importModList.ejs', data.servers[req.params.id]);
    } else {
        res.status(404).send('No mod List found');
    }
});

router.get('/edit', function (req, res) {
    auth.authenticate(req, res, function () {
        res.renderMin('edit.ejs', data.getData());
    });
});

router.get('/serverFile', function (req, res) {
    auth.authenticate(req, res, function () {
        res.sendFile(path.join(__dirname, 'data', 'servers.json'));
    });
});

router.post('/serverFile', function (req, res) {
    auth. authenticate(req, res, function () {
        data.servers = JSON.parse(req.body.json);
        fs.writeFile('./data/servers.json', req.body.json, function (error) {
            if (error) {
                return res.status(500).json({ error: 'Something went wrong!' });
            }
            res.redirect('/edit');
        });
    });
});

router.post('/news', function (req, res) {
    data.addItem(req, res, data.getData().news, './data/newsItems.json', true);
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


router.post('/pwa', function(req,res){
    const sub = JSON.parse(req.body.sub);
    let subs =  data.getPushSubscriptions();
    subs.push(sub);
    data.addSub(req, res, subs);
});

router.get('/ping', function(req,res) {
    notification.notify('pong');
    res.redirect('/');
});

module.exports = {
    router
};