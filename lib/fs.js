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
 *
 * Walk directory for files
 *
 * recursive function that returns the directory tree
 * http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
 *
 */

var walk = function(dir, done) {
  var results = []

  fs.readdir(dir, function(err, list) {
    if (err){
      return done(err)
    }
    var pending = list.length

    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file)
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res)
            if (!--pending) done(null, results)
          })
        } else {
          results.push(file)
          if (!--pending) done(null, results)
        }
      })
    })
  })

}

/**
 *
 * Fetch all the file paths for a directory.
 * returns and array of all the relative paths.
 *
 */

dir.read = function(dir, callback) {
  walk(dir, function(err, results){
    if(err) {
        console.log(err);
        return
    }
    var files = [], i=0;
    results.map(function(file){ files.push(path.relative(dir, file)) })
    files.map(function (file) {
        callback(file, files.length, i++)
    })
  })
}

dir.readList = function(dir, callback) {
  walk(dir, function(err, results){
    var files = [];
    results.map(function(file){ files.push(path.relative(dir, file)) })
    callback(files)
  })
}

/**
 * Read a especific folder (recursive).
 *
 * @example
 *
 *     rinco.fs.dir.read('sandbox', function(filename) {});
 *
 * @param {String} Folder's name
 * @param {cb_dir}  - Callback
 * @return {boolean} True if succes
 * @api public
 */
dir.read1 = function (dirname, fn, dist) {
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
 * @return {boolean} True if success
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

/**
 * Remove a file.
 *
 * @example
 *
 *     rinco.fs.file.remove('test.js');
 *
 * @param {String} filename
 * @return {boolean} True if ok
 * @api public
 */
file.remove = function (filename) {
    if (file.exist(filename)) {
        fs.unlinkSync(filename);
        return true;
    }
    return false;
}

/**
 * copy a file.
 * http://stackoverflow.com/questions/11293857/fastest-way-to-copy-file-in-node-js
 * @example
 *
 *     rinco.fs.file.cp('test.js', 'path/test.js');
 *
 * @param {String} origin
 * @param {String} dest
 * @return {boolean} true if ok
 * @api public
 */
file.cp = function (origin, dest) {

    if (file.exist(origin)) {
        dir.write(path.dirname(dest));
        fs.createReadStream(origin).pipe(fs.createWriteStream(dest));
        return true;
    }
    return false;
}

module.exports = {
    dir: dir,
    file: file,
    path: path
};
