/* jslint node: true */
/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict'

var m = {};
var compile = require('./compile');
var server = require('./server');

var config = require('./constants');

// Alias of watch
m.watch = function (path, fn, options) {
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

m.init = function () {

    m.watch('/');

    // CSS pre-compilation
    m.watch('/assets/css', function (filename) {
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
    m.watch('/assets/js', function (filename) {
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
