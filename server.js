const express = require('express');
const app = express();
const router = new express.Router();
const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
const auth = require('basic-auth');
const data = require('./data/data');
const path = require('path');
const minifyHTML = require('express-minify-html');
const compression = require('compression');
require('dotenv').config();

app.use(express.static('page', { maxAge: 3.154e+10 })); // 1year
app.set('views', 'page/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(minifyHTML({
    override: false,
    htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true
    }
}));

app.use(compression({ level: 9 }));


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
    authenticate(req, res, function () {
        res.renderMin('edit.ejs', data);
    });
});

router.get('/serverFile', function (req, res) {
    authenticate(req, res, function () {
        res.sendFile(path.join(__dirname, 'data', 'servers.json'));
    });
});

router.post('/serverFile', function (req, res) {
    authenticate(req, res, function () {
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
    saveSomething(req, res, data.news, './data/newsItems.json', true);
});

router.post('/delete/news', function (req, res) {
    deleteSomething(req, res, data.news, './data/newsItems.json');
});

router.post('/member', function (req, res) {
    saveSomething(req, res, data.members, './data/members.json');
});

router.post('/delete/member', function (req, res) {
    deleteSomething(req, res, data.members, './data/members.json');
});

router.post('/donator', function (req, res) {
    saveSomething(req, res, data.donators, './data/donators.json');
});

router.post('/delete/donator', function (req, res) {
    deleteSomething(req, res, data.donators, './data/donators.json');
});


app.use('/', router);

http.createServer(app).listen(process.env.PORT || 8080, function () {
    process.stdout.write('Secure Server listening on port ' + 8080
    );
});

function authenticate(req, res, callback) {
    var credentials = auth(req);
    if (!credentials || credentials.name !== process.env.USR || credentials.pass !== process.env.pass) {
        res.status(401).set('WWW-Authenticate', 'Basic realm="example"').end('Access denied');
    } else {
        callback();
    }
}

function saveSomething(req, res, obj, file, unshift) {
    authenticate(req, res, function () {
        var item = req.body;
        if (item.id === '-1') {
            item.id = obj.length;
            if (unshift) {
                obj.unshift(item);
            } else {
                obj.push(item);
            }
        } else {
            let idx = findIdx(obj, item.id);
            if (idx > -1) {
                obj[idx] = item;
            } else {
                return res.status(404).json({ error: 'ID not found' });
            }
        }
        fs.writeFile(file, JSON.stringify(obj, null, 4), function (error) {
            if (error) {
                return res.status(500).json({ error: 'Something went wrong!' });
            }
            res.redirect('/edit');
        });
    });
}

function deleteSomething(req, res, obj, file) {
    authenticate(req, res, function () {
        let idx = findIdx(obj, req.body.id);
        if (idx > -1) {
            obj.splice(idx, 1);
        } else {
            return res.status(404).json({ error: 'ID not found' });
        }
        fs.writeFile(file, JSON.stringify(obj, null, 4), function (error) {
            if (error) {
                return res.status(500).json({ error: 'Something went wrong!' });
            }
            return res.redirect('/edit');
        });
    });
}

function findIdx(obj, id) {
    return obj.findIndex(el => el.id === id);
}

app.use(function (err, req, res) {
    res.status(500).send('Something broke!');
});

app.use(function (req, res) {
    res.status(404).send('This isnt the page your looking for!');
});

module.exports = {
    authenticate: authenticate,
    saveSomething: saveSomething,
    deleteSomething: deleteSomething,
    findIdx: findIdx
};
