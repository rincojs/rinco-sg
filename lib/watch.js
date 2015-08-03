/* jslint node: true */
/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict'

var m = {};
var watch = require('node-watch');
var config = require('./constants');

/**
 * Watch a especific folder
 *
 * @example
 *
 *     rinco.watch.path('pathname');
 *
 * @param {string} Path name
 * @param {cb_watch}
 * @param {Object}
 * @api public
 */
m.path = function (path, fn, options) {

    var server = require('./server');
    options = options || {
        recursive: true,
        followSymLinks: true
    };

    watch(config.RELATIVE_PATH + path, options, callWatch);

    function callWatch(filename) {
        if (typeof fn === 'function') {
            fn(filename);
        } 
    }
};
/**
 * Callback from module watch
 * @callback cb_watch
 * @param {string} filename
 */

/**
 * Start watching
 *
 * @example
 *
 *     rinco.watch.init();
 *
 * @api public
 */
m.init = function (io) {
    var compile = require('./compile');
    var fs = require('./fs');
    var map = [];

    m.path('/');

    // CSS pre-compilation
    m.path('/assets/css', function (filename) {
      if(/\.(css|scss|styl|less)/.test(fs.path.extname(filename))){
          io.sockets.emit('refresh', {
              action: 'refresh'
          });
      }
    });

    // Image
    m.path('/assets/img', function (filename) {
      if (/(jpg|png|gif|jpeg|svg|ico)/.test(fs.path.extname(filename))) {
          io.sockets.emit('refresh', {
              action: 'refresh'
          });
      }
    });

    // JS
    m.path('/assets/js', function (filename) {
      if(/\.(js|coffee|babel)/.test(fs.path.extname(filename))){
          io.sockets.emit('refresh', {
              action: 'refresh'
          });
      }
    });

};

module.exports = m;
