var assert = require('assert');
var request = require('supertest');
var url = 'http://localhost:8080';

describe('Front Page', function () {
        it('Loads Page', function (done) {
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
          it('Loads Page', function (done) {
              request(url)
                .get('/edit')
                .auth('', '')
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
