const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
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

app.use('/', require('./routes').router);

app.use(function (err, req, res) {
    res.status(500).send('Something broke!');
});

app.use(function (req, res) {
    res.status(404).send('This isnt the page your looking for!');
});

http.createServer(app).listen(process.env.PORT || 8080, () => {
    process.stdout.write('Secure Server listening on port ' + (process.env.PORT || 8080)
    );
});
