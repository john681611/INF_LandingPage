var express = require('express');
var app = express();
var router  = express.Router();
var ejs = require('ejs');
var https = require('https');
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser')
var auth = require('basic-auth');
var data = require('./data/data')
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
  res.render('index.ejs',data);
});
router.get('/edit', function(req,res){
  authenticate(req,res,function(){
    res.render('edit.ejs',data);
  })
})

router.post('/news', function(req,res){
  saveSomething(req,res,data.news,'./newsItems.json')
})

router.post('/delete/news', function(req,res){
  deleteSomething(req,res,data.news,'./newsItems.json')
})

router.post('/member', function(req,res){
  saveSomething(req,res,data.members,'./members.json')
})

router.post('/delete/member', function(req,res){
  deleteSomething(req,res,data.members,'./members.json')
})

router.post('/donator', function(req,res){
  saveSomething(req,res,data.donators,'./donators.json')
})

router.post('/delete/donator', function(req,res){
  deleteSomething(req,res,data.donators,'./donators.json')
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
  if (!credentials || credentials.name !== process.env.USR || credentials.pass !== process.env.PWD) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="example"')
    res.end('Access denied')
  } else {
    callback();
  }
}

function saveSomething(req,res,obj,file){
  authenticate(req,res,function(){
    var item = req.body;
    if(item.id === '-1'){
      item.id = obj.length;
    }
    obj[item.id] = item;
    fs.writeFile(file, JSON.stringify(obj, null, 4), function(error) {
      if (error) {
        return res.status(500).json({error: "Something went wrong!"});
      }
      res.redirect('/edit');
    });
  });
}

function deleteSomething(req,res,obj,file){
  authenticate(req,res,function(){
    obj.splice(parseInt(req.body.id), 1);
    fs.writeFile(file, JSON.stringify(obj, null, 4), function(error) {
      if (error) {
        return res.status(500).json({error: "Something went wrong!"});
      }
      res.redirect('/edit');
    });
  });
}

module.exports = {
  authenticate: authenticate,
  saveSomething: saveSomething,
  deleteSomething:deleteSomething,
  authenticate:authenticate
}
