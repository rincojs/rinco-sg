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
    dist = dist || '';

    fs.dir.read(fs.path.join(config.RELATIVE_PATH, '/assets/css/'), function (filename) {
        switch (fs.path.extname(filename, dist)) {
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
        switch (fs.path.extname(filename, dist)) {
        case '.js':
            compile.js(filename, dist);
            break;
        case '.coffee':
            compile.coffeescript(filename, dist);
            break;
        }
    });
};

/**
 * Render an especific file.
 *
 * @example
 *
 *     rinco.render.file('assets/pages/index.html');
 *
 * @param {String} Filename
 * @param {cb_render_content}
 * @param {string[]}  Array with middlewares's names you want to ignore
 * @api public
 */
md.file = function (filename, callback, ignore_middlewares_list) {
    var content = fs.file.read(filename);
    var i = -1;

    ignore_middlewares_list = ignore_middlewares_list || [];

    function next(value) {
        content = value;
        i += 1;
        if (i < md.middleware.length) {
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
/**
 * Callback from module render
 * @callback cb_render_content
 * @param {string} content
 */

md.middleware = [];

/**
 * Create a middleware for renderization.
 *
 * @example
 *
 *     rinco.render.middleware.register(function middleware_name (next, content) {
 *       var out = content.replace('Allan', 'Rinco');
 *       next(out);
 *     });
 *
 * @param {cb_middleware}
 * @api public
 */
md.middleware.register = function (middleware) {
    return md.middleware.push(middleware);
};
/**
 * Callback from module render
 * @callback cb_middleware
 * @param {function} Next function
 * @param {String} content
 */

module.exports = md;
