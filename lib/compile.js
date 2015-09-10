      /* jslint node: true */
/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */
'use strict'

var exec = require('child_process').exec;
var sass = require('node-sass');
var stylus = require('stylus');
var less = require('less');
var coffeescript = require("coffee-script");
var fs = require('./fs')
var server = require('./server');
var m = {};
var config = require('./constants');
var babel = require('babel-core');

/**
 * Compile a stylus css file.
 *
 * @example
 *
 *     rinco.compile.stylus('style.styl', 'public/css/');
 *
 * @param {String} Filename
 * @param {String} Destination
 * @api public
 */
 m.styl = function (filename, fn, order) {
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.CSS_DIR, name)).toString();
    str = m.applyPath(str);

    stylus.render(str, function (err, css) {
        if (err) throw err;
        (fn && fn.call && fn.call(null, css, order));
    });
};

/**
 * Compile a less css file.
 *
 * @example
 *
 *     rinco.compile.less('style.less', 'public/css/');
 *
 * @param {String} Filename
 * @param {String} Destination
 * @api public
 */
m.less = function (filename, fn, order) {
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.CSS_DIR, name)).toString();
    str = m.applyPath(str);

    // Ignore import files from less
    if (name[0] !== "_") {
        less.render(str, {
            paths: [config.CSS_DIR], // Specify search paths for @import directives
            filename: fs.path.join(config.CSS_DIR, name), // Specify a filename, for better error messages
            compress: true // Minify CSS output
        },
        function (e, css) {
            if (e) {
                console.log(e);
            }
            (fn && fn.call && fn.call(null, css, order));
        });
    }
};

m.css = function (filename, fn, order) {
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.CSS_DIR, name)).toString();
    str = m.applyPath(str);

    (fn && fn.call && fn.call(null, str, order));
};

/**
 * Compile a coffeescript file.
 *
 * @example
 *
 *     rinco.compile.coffeescript('app.js', 'public/js/');
 *
 * @param {String} Filename
 * @param {String} Destination
 * @api public
 */
m.coffee = function (filename, fn, order) {
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.JS_DIR, name)).toString();
    str = m.applyPath(str);

    var js = coffeescript.compile(str);

    (fn && fn.call && fn.call(null, js, order));
};

/**
 * Compile a babel file.
 *
 * @example
 *
 *     rinco.compile.babel('app.babel', 'public/js/');
 *
 * @param {String} filename
 * @param {String} dist
 * @api public
 */
m.babel = function (filename, fn, order) {
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.JS_DIR, name)).toString();
    str = m.applyPath(str);

    var js = babel.transform(str,[]);

    (fn && fn.call && fn.call(null, js.code, order));
};

m.js = function (filename, fn, order) {
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.JS_DIR, name)).toString();
    str = m.applyPath(str);

    (fn && fn.call && fn.call(null, str, order));
};

m.img = function (filename, fn, dist) {
    var name = fs.path.basename(filename);
    var ext = fs.path.extname(name);
    var str = fs.file.read(fs.path.join(config.IMG_DIR, name));

    fs.file.write(fs.path.join(dist, name.split(".")[0] + ext), str, function () {
        (!dist && server.io.sockets.emit('refresh', {
            action: 'refresh'
        }));
    });
};

/**
 * Compile a sass css file.
 *
 * @example
 *
 *     rinco.compile.sass('style.css 'public/css/');
 *
 * @param {String} Filename
 * @param {String} Destination
 * @api public
 */
m.scss = function (filename, fn, order) {
    // Get file name
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.CSS_DIR, name)).toString();
    str = m.applyPath(str);

    // Ignore import files from sass
    if (name[0] !== "_") {
        sass.render({
            // file: fs.path.join(config.CSS_DIR, name),
            data: str.trim(),
            includePaths: [config.CSS_DIR]
        }, function (err, css) {
            if (err) {
                console.log(err);
            }
            (fn && fn.call && fn.call(null, css.css, order));
        });
    }
};


m.tocss = function (files, fn) {
    var buf = [], ext, count=files.length;
    function cb(css, order) {
        buf[order] = css;
        count--;
        if(count === 0){
            (fn && fn.call && fn.call(null, buf.join('')));
        }
    }
    var i = 0;
    files.map(function (file) {
        ext = fs.path.extname(file).substr(1);
        m[ext](file, cb, i++);
    });
};

m.tojs = function (files, fn) {
    var buf = [], ext, count=files.length;
    function cb(js, order) {
        buf[order] = js;
        count--;
        if(count === 0){
            (fn && fn.call && fn.call(null, buf.join('')));
        }
    }
    var i=0;
    files.map(function (file) {
        ext = fs.path.extname(file).substr(1);
        m[ext](file, cb, i++);
    });
};

m.applyPath = function (str) {
    var path = config.INFO.action === 'dev' ? config.USER_CONFIG.path_dev : config.USER_CONFIG.path_build ;
    return str.replace(/\<r-path\/\>/g, path);
};

module.exports = m;
