/* jslint node: true */
/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */
 
'use strict'

var fs = require('./fs');
var compile = require('./compile');

var config = require('./constants');
var md = {};

md.assets = function (dist) {

    fs.dir.read(fs.path.join(config.RELATIVE_PATH, '/assets/css/'), function (filename) {
        switch (path.extname(filename, dist)) {
        case '.css':
            compile.css(filename, dist);
            break;
        case '.scss':
            compile.sass(filename, dist);
            break;
        case '.styl':
            compile.stylus(filename, dist);
            break;
        case '.js':
            compile.less(filename, dist);
            break;
        case '.less':
            compile.less(filename, dist);
            break;
        }
    });

    fs.dir.read(fs.path.join(config.RELATIVE_PATH, '/assets/js/'), function (filename) {
        switch (path.extname(filename, dist)) {
        case '.js':
            compile.js(filename, dist);
            break;
        case '.coffee':
            compile.coffeescript(filename, dist);
            break;
        }
    });
};

md.file = function (filename, callback, ignore_middlewares_list) {
    var content = fs.file.read(filename);
    var i = -1;

    ignore_middlewares_list = ignore_middlewares_list || [];

    function next(value) {
        content = value;
        i += 1;
        if (i < md.middlewares.length) {
            if (ignore_middlewares_list.indexOf(md.middleware[i].name) === -1) {
                md.middleware[i](next, content);
            } else {
                next(content);
            }
        } else {
            callback(content);
        }
    }
    next(content);
};

md.middleware = [];

md.middleware.register = function (middleware) {
    return md.middleware.push(middleware);
};

module.exports = md;
