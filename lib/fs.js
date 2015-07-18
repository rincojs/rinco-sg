/* jslint node: true */
/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict'

var dir = {};
var file = {};
var mkdirp = require('mkdirp');
var fs = require("fs");
var sh = require('shelljs');
var path = require('path');

var config = require('./constants');

dir.write = function (dirname) {
    mkdirp.sync(dirname);
    return true;
};

dir.read = function (dirname, fn, dist) {
    var file;
    var origin = '';
    origin = path.join(origin, dirname);
    fs.readdir(origin, function (err, files) {
        files.forEach(function (filename) {
            if (fs.lstatSync(path.join(dirname, filename)).isDirectory()) {
                dist = path.join(dist, filename);
                dir.read(path.join(origin, filename), fn, dist);
            } else {
                (fn && fn.call && fn(filename, dist, origin));
            }
        });
    });
};

dir.remove = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file,index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        dir.remove(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
    return true;
  }
  return false;
};

file.write = function (filename, content, fn) {
    dir.write(path.dirname(filename));
    fs.writeFile(filename, content, function (err) {
        if (err) {
            console.log(err);
        } else {
          (fn && fn.call && fn.call());
        }
    });
};

file.read = function (filename) {
    if (file.exist(filename)) {
        return fs.readFileSync(filename);
    }
    return false;
};

file.exist = function (filename) {
    return fs.existsSync(filename);
};

module.exports = {
    dir: dir,
    file: file,
    path: path
};
