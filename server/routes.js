const express = require('express');
const router = new express.Router();
const data = require('../data/data');
const auth = require('../utils/auth');
const path = require('path');
const fs = require('fs');

router.get('/', function (req, res) {
    res.renderMin('index.ejs', data);
});

router.get('/modlist/:id', function (req, res) {
    if (0 <= req.params.id && req.params.id <= data.servers.length) {
        res.render('importModList.ejs', data.servers[req.params.id]);
    } else {
        res.status(404).send('No mod List found');
    }
});

router.get('/edit', function (req, res) {
    auth.authenticate(req, res, function () {
        res.renderMin('edit.ejs', data);
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
        fs.writeFile('./data/server.json', req.body.json, function (error) {
            if (error) {
                return res.status(500).json({ error: 'Something went wrong!' });
            }
            res.redirect('/edit');
        });
    });
});

router.post('/news', function (req, res) {
    data.saveSomething(req, res, data.news, './data/newsItems.json', true);
});

router.post('/delete/news', function (req, res) {
    data.deleteSomething(req, res, data.news, './data/newsItems.json');
});

router.post('/member', function (req, res) {
    data.saveSomething(req, res, data.members, './data/members.json');
});

router.post('/delete/member', function (req, res) {
    data.deleteSomething(req, res, data.members, './data/members.json');
});

router.post('/donator', function (req, res) {
    data.saveSomething(req, res, data.donators, './data/donators.json');
});

router.post('/delete/donator', function (req, res) {
    data.deleteSomething(req, res, data.donators, './data/donators.json');
});

module.exports = {
    router
};