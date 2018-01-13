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

describe('Authorization', function () {
  var res = {
    redirect:function(str){},
    setHeader:function(str){},
    end:function(str){
      throw new Error();
    }
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
    redirect:function(str){}
  }
  auth = "Basic " + new Buffer('usr' + ":" + 'pwd').toString("base64");
  it('should save something new to file', function () {
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
    assert(testObj[0].name == 'bob',"name not saved")
    assert.deepEqual(require('../data/testOBJ.json'), testObj, "object not saved")
  })

  it('should save something to file', function () {
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
    assert(testObj.length == 1,"object not changed")
    assert(testObj[0].name == 'bob2',"name not changed")
    assert.deepEqual(require('../data/testOBJ.json'), testObj, "object not saved")
  })

  it('should save something to file', function () {
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
    server.deleteSomething(req,res,testObj,'./data/testOBJ.json')
    //then
    assert(testObj.length == 0,"object not deleted")
    assert.deepEqual(require('../data/testOBJ.json'), testObj, "object not saved")
  })
})
