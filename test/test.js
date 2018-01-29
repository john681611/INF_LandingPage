var assert = require('assert');
var request = require('supertest');
var server = require('../server');
var httpMocks = require('node-mocks-http');
var url = 'http://localhost:8080';

describe('Front Page', function () {
  it('should Load Page', function (done) {
    request(url)
    .get('/')
    .send()
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      assert.equal(res.statusCode, 200);
      if (res.text.indexOf("Iron</span>-Fists","Incorrect Page served") > -1) {
        assert.ok(true)
      }else{
        assert.ok(false)
      }
      done();
    });
  })
})

describe('Edit', function () {
  it('should Load Page', function (done) {
    request(url)
    .get('/edit')
    .auth('usr', 'pwd')
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      assert.equal(res.statusCode, 200);
      if (res.text.indexOf("Iron</span>-Fists Editing","Incorrect Page served") > -1) {
        assert.ok(true)
      }else{
        assert.ok(false)
      }
      done();
    });
  })
})

describe('Front Page', function () {
  it('should Load Page', function (done) {
    request(url)
    .get('/modlist/0')
    .send()
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      assert.equal(res.statusCode, 200);
      if (res.text.indexOf("RESISTANCE") > -1) {
        assert.ok(true)
      }else{
        assert.ok(false)
      }
      done();
    });
  })

  it('Deal with invalid ID', function (done) {
    request(url)
    .get('/modlist/-1')
    .send()
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      assert.equal(res.statusCode, 404);
      if (res.text.indexOf("No mod List found") > -1) {
        assert.ok(true)
      }else{
        assert.ok(false)
      }
      done();
    });
  })
})

describe('InvalidPage', function () {
  it('safely deal with invalid page', function (done) {
    request(url)
    .get('/fgdhjdfujhg')
    .send()
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      assert.equal(res.statusCode, 404);
      if (res.text.indexOf("This isnt the page your looking for!") > -1) {
        assert.ok(true)
      }else{
        assert.ok(false)
      }
      done();
    });
  })
});

describe('Authorization', function () {
  var res = {
    redirect:str =>{},
    set:str =>{},
    end:str =>{
      throw new Error();
    },
    status:str =>{}
  }
  it('should log in with correct Auth', function () {
    //given
    var auth = "Basic " + new Buffer('usr' + ":" + 'pwd').toString("base64");
    var req  = httpMocks.createRequest({
      headers : {
        "Authorization" : auth
      }
    });
    //when
    server.authenticate(req,res,function(){
    })
    //then
  })

  it('should fail with no Auth', function () {
    //given
    var auth ="";
    var req  = httpMocks.createRequest({
      headers : {
        "Authorization" : auth
      }
    });
    //when + then
    assert.throws(() => {server.authenticate(req,res,function(){})},Error);
  })

  it('should fail with bad user Auth', function () {
    //given
      var auth = "Basic " + new Buffer('usr2' + ":" + 'pwd').toString("base64");
    var req  = httpMocks.createRequest({
      headers : {
        "Authorization" : auth
      }
    });
    //when + then
      assert.throws(() => {server.authenticate(req,res,function(){})},Error);
  })

  it('should fail with bad pw Auth', function () {
    //given
      var auth = "Basic " + new Buffer('usr' + ":" + 'pwd2').toString("base64");
    var req  = httpMocks.createRequest({
      headers : {
        "Authorization" : auth
      }
    });
    //when + then
      assert.throws(() => {server.authenticate(req,res,function(){})},Error);
  })
})


describe('File Mod Funcs', function () {
  var testObj = require('../data/testOBJ.json');
  var res = {
    redirect:str =>{},
    set:str =>{},
    end:str =>{
      throw new Error();
    },
    status:str =>{return res},
    json: str =>{}
  }
  auth = "Basic " + new Buffer('usr' + ":" + 'pwd').toString("base64");
  it('should save bob to file', function () {
    //given
    var req  = httpMocks.createRequest({
      body:{
        id:'-1',
        name:'bob'
      },
      headers : {
        "Authorization" : auth
      }
    });
    //when
    server.saveSomething(req,res,testObj,'./data/testOBJ.json')
    //then
    assert(testObj.length == 1,"object not changed")
    assert(testObj[0].name, 'bob')
    assert.deepEqual(require('../data/testOBJ.json'), testObj, "object not saved")
  })

  it('should save bob3 to file and be top of list', function () {
    //given
    var req  = httpMocks.createRequest({
      body:{
        id:'-1',
        name:'bob3'
      },
      headers : {
        "Authorization" : auth
      }
    });
    //when
    server.saveSomething(req,res,testObj,'./data/testOBJ.json',true)
    //then
    assert(testObj.length == 2,"object not changed")
    assert(testObj[0].name == 'bob3', 'bob3 not first ' + testObj[0].name + ' was.')
    assert.deepEqual(require('../data/testOBJ.json'), testObj, "object not saved")
  })

  it('should change bob to bob2', function () {
    //given
    var req  = httpMocks.createRequest({
      body:{
        id:'0',
        name:'bob2'
      },
      headers : {
        "Authorization" : auth
      }
    });
    //when
    server.saveSomething(req,res,testObj,'./data/testOBJ.json')
    //then
    assert(testObj.length == 2,"object not changed")
    assert(testObj[1].name == 'bob2',"name not changed")
    assert.deepEqual(require('../data/testOBJ.json'), testObj, "object not saved")
  })

  it('should delete something from file file', function () {
    //given
    var req  = httpMocks.createRequest({
      body:{
        id:'0'
      },
      headers : {
        "Authorization" : auth
      }
    });
    //when
    server.deleteSomething(req,res,testObj,'./data/testOBJ.json')
    //then
    assert(testObj.length == 1,"object not deleted")
    assert.deepEqual(require('../data/testOBJ.json'), testObj, "object not saved")
  })

  it('should delete something from file file', function () {
    //given
    var req  = httpMocks.createRequest({
      body:{
        id:'1'
      },
      headers : {
        "Authorization" : auth
      }
    });
    //when
    server.deleteSomething(req,res,testObj,'./data/testOBJ.json')
    //then
    assert(testObj.length == 0,"object not deleted")
    assert.deepEqual(require('../data/testOBJ.json'), testObj, "object not saved")
  })
})

describe('findIdx', function () {
  var req  = [{id:1},{id:0}]
  it('should find by ID not index', function () {
    //when
    assert(server.findIdx(req,"1") === 0)
  });
  it('should return -1 when not found', function () {
    //when
    assert(server.findIdx(req,"2") === -1)
  });
})