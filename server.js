var express = require('express');
var app = express();
var router  = express.Router();
var ejs = require('ejs');
var https = require('https');
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser')
var auth = require('basic-auth');
var news = require('./newsItems.json');
var members = require('./members.json');
require('dotenv').config()
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
    news:news,
    members:members,
  });
});
router.get('/edit', function(req,res){
  authenticate(req,res,function(){
   res.render('edit.ejs',{
     news:news,
     members:members,
   });
 })
})

router.post('/news', function(req,res){
  authenticate(req,res,function(){
    news[req.body.id] = req.body;
    fs.writeFile('./newsItems.json', JSON.stringify(news, null, 4), function(error) {
			if (error) {
				return res.status(500).json({error: "Something went wrong!"});
			}
      res.redirect('/edit');
		});
 });
})

router.post('/delete/member', function(req,res){
  authenticate(req,res,function(){
      news.splice(parseInt(req.body.id), 1);
    fs.writeFile('./newsItems.json', JSON.stringify(news, null, 4), function(error) {
			if (error) {
				return res.status(500).json({error: "Something went wrong!"});
			}
      res.redirect('/edit');
		});
 });
})

router.post('/member', function(req,res){
  authenticate(req,res,function(){
    var item = req.body;
    if(item.id === '-1'){
      item.id = members.length;
    }
    members[item.id] = item;
    fs.writeFile('./members.json', JSON.stringify(members, null, 4), function(error) {
			if (error) {
				return res.status(500).json({error: "Something went wrong!"});
			}
      res.redirect('/edit');
		});
 });
})

router.post('/delete/member', function(req,res){
  authenticate(req,res,function(){
      members.splice(parseInt(req.body.id), 1);
    fs.writeFile('./members.json', JSON.stringify(members, null, 4), function(error) {
			if (error) {
				return res.status(500).json({error: "Something went wrong!"});
			}
      res.redirect('/edit');
		});
 });
})


app.use('/', router);

// var secureServer = https.createServer(options, app).listen(443,function() {
//   console.log('Secure Server listening on port ' + 433);
// });
var Server = http.createServer(app).listen(process.env.PORT || 8080,function() {
  console.log('Secure Server listening on port ' + 8080
);
});

function authenticate(req,res,callback){
  var credentials = auth(req)
 if (!credentials || credentials.name !== process.env.USR || credentials.pass !== process.env.PWD) { //TODO: REMOVE THIS INSECURE CRAP
   res.statusCode = 401
   res.setHeader('WWW-Authenticate', 'Basic realm="example"')
   res.end('Access denied')
 } else {
   callback();
 }
}
