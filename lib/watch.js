/* jslint node: true */
/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict'

var m = {};
var compile = require('./compile');
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
        } else {
            server.io.sockets.emit('refresh', {
                action: 'refresh'
            });
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
m.init = function () {

    m.path('/');

    // CSS pre-compilation
    m.path('/assets/css', function (filename) {
        switch (path.extname(filename)) {
        case '.scss':
            compile.sass(filename);
            break;
        case '.styl':
            compile.stylus(filename);
            break;
        case '.js':
            compile.less(filename);
            break;
        case '.less':
            compile.less(filename);
            break;
        }
    });

    // JS
    m.path('/assets/js', function (filename) {
        switch (path.extname(filename)) {
        case '.js':
            compile.js(filename);
            break;
        case '.coffee':
            compile.coffeescript(filename);
            break;
        }
    });

};

module.exports = m;
