const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
var cookieParser = require('cookie-parser');

require('dotenv').config();
app.set('views', 'page/views');
app.set('view engine', 'ejs');
app.use(cors());
app.use('/', express.static('assets'));
app.use('/', express.static('page'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(compression({ level: 9 }));

app.use('/', require('./routes').router);

app.use(function (req, res) {
    res.status(404).send('This isn\'t the page your looking for!');
});

app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') {return next(err);}
    res.status(403);
    res.send('form tampered with');
});

app.use(function (err, req, res) {
    res.status(500).send('Something broke!');
});


http.createServer(app).listen(process.env.PORT || 8080, () => {
    process.stdout.write('Secure Server listening on port ' + (process.env.PORT || 8080)
    );
});
