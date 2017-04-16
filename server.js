var express = require('express');
var app = express();
var router  = express.Router();
var ejs = require('ejs');
var https = require('https');
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser')
var newitems = require('./newsItems.json');
console.log(newitems);
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
    news:newitems,
  });
});
//
// router.get('/dashboard', function(req, res) {
//   res.render('dashboard');
// });
//
// router.get('/settings', function(req, res) {
//   res.render('settings');
// });
//
// //API
// router.get('/responses/', function(req, res) {
// 	responses.getAll(res);
// });
//
// router.get('/stores/:storeId/responses', function(req, res) {
// 	responses.getResponse(req, res)
// });
//
// router.post('/responses/add', function(req, res) {
//     responses.add(req, res);
// });
//
// router.post('/responses/email', function(req, res) {
//      email.submit(req, res);
// });
//
// router.post('/stores/:storeId/addStoreDetails', function(req, res) {
//     staff.addStoreDetails(req, res);
// });
//
// router.get('/stores/:storeId/getStoreDetails', function(req, res) {
// 	staff.getStoreDetails(req, res);
// });

app.use('/', router);

// var secureServer = https.createServer(options, app).listen(443,function() {
//   console.log('Secure Server listening on port ' + 433);
// });
var Server = http.createServer(app).listen(9000,function() {
  console.log('Secure Server listening on port ' + 9000
);
});
