var assert = require('assert');
var rinco = require('./../lib/rinco');
var should = require('should');
var path = require('path');

describe('Rinco', function () {
    it('should return false when no config file is found', function () {
        assert.equal(rinco.util.hasConfig(), false);
    });
});

// FS
describe('fs.dir.write', function () {
    it('should return true', function () {
        should(rinco.fs.dir.write(path.join(__dirname, '/sandbox'))).be.exactly(true);
    });
});

describe('fs.file.write', function () {
    it('should fire done', function (done) {
        should(rinco.fs.file.write(path.join(__dirname, '/sandbox', 'test.test'), 'testing', function () {
            done();
        }));
    });
});

describe('fs.file.exist', function () {
    it('should return true', function () {
        should(rinco.fs.file.exist(path.join(__dirname, '/sandbox', 'test.test'))).be.exactly(true);
    });
});

describe('fs.file.read', function () {
    it('should return "testing"', function () {
        should(rinco.fs.file.read(path.join(__dirname, '/sandbox', 'test.test')).toString()).be.exactly('testing');
    });
});

describe('fs.dir.read', function () {
    it('should fire done ', function (done) {
        should(rinco.fs.dir.read(path.join(__dirname, '/sandbox'), function (filename) {
           if(filename === 'test.test') {
             done();
           }
        }));
    });
});

describe('fs.dir.remove', function () {
    it('should return true', function () {
        should(rinco.fs.dir.remove(path.join(__dirname, '/sandbox'))).be.exactly(true);
    });
});
