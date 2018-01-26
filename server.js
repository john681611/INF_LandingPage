const express = require('express');
const app = express();
const router  = express.Router();
const ejs = require('ejs');
const https = require('https');
const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser')
const auth = require('basic-auth');
const data = require('./data/data');
const path = require('path');
require('dotenv').config()
// Setup HTTPS
// var options = {
//   key: fs.readFileSync('./keys/private.key'),
//   cert: fs.readFileSync('./keys/certificate.pem')
// };
app.use(express.static('page', { maxAge: 3.6e+6 })); //60min
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

router.get('/modlist/:id', function(req, res) {
  if( 0 <= req.params.id &&  req.params.id <= data.servers.length ) {
  res.render('importModList.ejs',data.servers[req.params.id]);
  } else {
    res.status(404).send('No mod List found')
  }
});

router.get('/edit', function(req,res){
  authenticate(req,res,function(){
    res.render('edit.ejs',data);
  })
})

router.get('/serverFile', function(req,res){
  authenticate(req,res,function(){
    res.sendFile(path.join(__dirname,'data','servers.json'));
  })
})

router.post('/serverFile', function(req,res){
  authenticate(req,res,function(){
    data.servers = JSON.parse(req.body.json);
    fs.writeFile('./data/server.json', req.body.json, function(error) {
      if (error) {
        return res.status(500).json({error: "Something went wrong!"});
      }
      res.redirect('/edit');
    });
  })
})

router.post('/news', function(req,res){
  saveSomething(req,res,data.news,'./data/newsItems.json')
})

router.post('/delete/news', function(req,res){
  deleteSomething(req,res,data.news,'./data/newsItems.json')
})

router.post('/member', function(req,res){
  saveSomething(req,res,data.members,'./data/members.json')
})

router.post('/delete/member', function(req,res){
  deleteSomething(req,res,data.members,'./data/members.json')
})

router.post('/donator', function(req,res){
  saveSomething(req,res,data.donators,'./data/donators.json')
})

router.post('/delete/donator', function(req,res){
  deleteSomething(req,res,data.donators,'./data/donators.json')
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

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.use(function (req, res, next) {
  res.status(404).send("This isnt the page your looking for!");
});

module.exports = {
  authenticate: authenticate,
  saveSomething: saveSomething,
  deleteSomething:deleteSomething,
  authenticate:authenticate
}
