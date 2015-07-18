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

/**
 * Create a new folder.
 *
 * @example
 *
 *     rinco.fs.dir.write('sandbox');
 *
 * @param {String} Folder's name
 * @return {boolean} True if succes
 * @api public
 */
dir.write = function (dirname) {
    mkdirp.sync(dirname);
    return true;
};

/**
 * Read a especific folder (recursive).
 *
 * @example
 *
 *     rinco.fs.dir.read('sandbox');
 *
 * @param {String} Folder's name
 * @param {cb_dir}  - Callback
 * @return {boolean} True if succes
 * @api public
 */
dir.read = function (dirname, fn, dist) {
    var file;
    var origin = '';
    var dist = dist || '';
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
/**
 * Callback from module fs.dir.read
 * @callback cb_dir
 * @param {string} filename
 */

/**
 * Remove a especific folder (recursive).
 * Files will be removed too.
 * @example
 *
 *     rinco.fs.dir.remove('sandbox');
 *
 * @param {String} Folder's name
 * @return {boolean} True if succes
 * @api public
 */
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

/**
 * Create a new file. (Asynchronous)
 * Folders will be created if it doesn't exists.
 * @example
 *
 *     rinco.fs.file.write('test.js');
 *
 * @param {String} Filename
 * @param {String} File's content
 * @param {cb_file} Callback
 * @api public
 */
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
/**
 * Callback from module fs.file.write
 * @callback cb_file
 */

/**
 * Read a file.
 *
 * @example
 *
 *     rinco.fs.file.read('test.js');
 *
 * @param {String} Filename
 * @return {boolean} True if sucess
 * @api public
 */
file.read = function (filename) {
    if (file.exist(filename)) {
        return fs.readFileSync(filename);
    }
    return false;
};

/**
 * Check if a file exists.
 *
 * @example
 *
 *     rinco.fs.file.exist('test.js');
 *
 * @param {String} Filename
 * @return {boolean} True if exists
 * @api public
 */
file.exist = function (filename) {
    return fs.existsSync(filename);
};

module.exports = {
    dir: dir,
    file: file,
    path: path
};
