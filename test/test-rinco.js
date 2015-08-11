var assert = require('assert');
var rinco = require('./../lib/rinco');
var should = require('should');
var path = require('path');

// TESTING fs.js
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
        rinco.fs.dir.read(path.join(__dirname, '/sandbox'), function (filename) {
            if(filename === 'test.test') {
             done();
            }
        });
    });
});

describe('fs.dir.remove', function () {
    it('should return true', function () {
        should(rinco.fs.dir.remove(path.join(__dirname, '/sandbox'))).be.exactly(true);
    });
});

// TESTING render.js

require('./../lib/middleware/rinco-parse-template');
require('./../lib/middleware/rinco-parse-css');
require('./../lib/middleware/rinco-parse-js');
require('./../lib/middleware/rinco-mustache');
require('./../lib/middleware/rinco-reload');
describe('render.file', function () {
    it('should fire done ', function (done) {
        rinco.render.file('test/templates/index.html', function (data) {
            if(rinco.fs.file.read('test/rendered/index.html').toString().trim() === data.toString().replace(/[\n\r]/g, '').trim()) {
                done();
            }
        });
    });
});

// TESTING CSS compile.js
describe('compile.tocss', function () {
    it('should fire done ', function (done) {
        var rendered = rinco.fs.file.read('test/rendered/style.css').toString();
        rinco.compile.tocss('less.less|sass.scss|stylus.styl|style.css'.split('|'), function (data) {
            if(rendered.trim() == data.trim()) {
                done();
            }
        });
    });
});

// TESTING JS compile.js
describe('compile.tojs', function () {
    it('should fire done ', function (done) {
        var rendered = rinco.fs.file.read('test/rendered/script.js').toString();
        rinco.compile.tojs('babel.babel|coffee.coffee|script.js'.split('|'), function (data) {
            if(rendered.trim() == data.trim()) {
                done();
            }
        });
    });
});

// TESTING SERVER server.js
describe('server.start', function () {
    it('should fire done ', function (done) {
        var rendered = rinco.fs.file.read('test/rendered/server_index.html').toString();
        rinco.server.start([], 3000);
        rinco.server.get('localhost','', function (data) {
            if(rendered.trim() === data.trim()){
                done();
            }
        }, 3000);
    });
});
