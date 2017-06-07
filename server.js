var express = require('express');
var app = express();
var router  = express.Router();
var ejs = require('ejs');
var https = require('https');
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser')
// Setup HTTPS
// var options = {
//   key: fs.readFileSync('./keys/private.key'),
//   cert: fs.readFileSync('./keys/certificate.pem')
// };
app.use(express.static('page'));
app.set('views', 'page/views');
app.set('view engine', 'ejs');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Front End
router.get('/', function(req, res) {
  res.render('index.ejs',{
    news:require('./newsItems.json'),
    members:require('./members.json'),
  });
});

app.use('/', router);

// var secureServer = https.createServer(options, app).listen(443,function() {
//   console.log('Secure Server listening on port ' + 433);
// });
var Server = http.createServer(app).listen(3000,function() {
  console.log('Secure Server listening on port ' + 3000
);
});
