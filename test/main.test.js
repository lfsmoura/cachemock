const assert = require('assert');
const cachemock = require('../');
const cachemockfile = cachemock.cachemockfile;

describe('Cachemock', function() {
  it('should actually make a call the first time, then it should mock it', function(done) {
    let callCount = 0;
    function realfun(a, b, cb) {
      callCount += 1;
      return cb(null, a + b);
    }
    const mocked = cachemock(realfun);
    let retValue;
    mocked(1, 2, (err, c) => {
      assert.equal(c, 3);
      assert.equal(callCount, 1);

      mocked(1, 2, (err, c) => {

        assert.equal(c, 3);
        assert.equal(callCount, 1);
        done();
      });
    });
  });

  it('should call again if a different set of arguments is given', function(done){
    let callCount = 0;
    function realfun(a, b, cb) {
      callCount += 1;
      return cb(null, a + b);
    }
    const mocked = cachemock(realfun);
    let retValue;
    mocked(1, 2, (err, c) => {
      assert.equal(c, 3);
      assert.equal(callCount, 1);

      mocked(2, 2, (err, c) => {

        assert.equal(c, 4);
        assert.equal(callCount, 2);
        done();
      });
    });
  });

  it('should work with objects', function(done) {
    let callCount = 0;
    function realfun(obj, cb) {
      callCount += 1;
      return cb(null, Object.keys(obj).length);
    }
    const mocked = cachemock(realfun);
    let retValue;
    mocked({ a: 1, b: 2 }, (err, c) => {
      assert.equal(c, 2);
      assert.equal(callCount, 1);

      mocked({ a: 1, b: 2 }, (err, c) => {

        assert.equal(c, 2);
        assert.equal(callCount, 1);
        done();
      });
    });
  });
});

describe('Cachemockfile', function() {
  it('should record calls in a file', function(done) {
    let callCount = 0;
    function realfun(a, b, cb) {
      callCount += 1;
      return cb(null, a + b);
    }
    const mocked = cachemockfile(realfun);
    let retValue;
    mocked(1, 2, (err, c) => {
      assert.equal(c, 3);

      const mockedAgain = cachemockfile(realfun);

      mockedAgain(1, 2, (err, c) => {

        assert.equal(c, 3);
        assert.equal(callCount, 0);
        done();
      });
    });
  });
});
