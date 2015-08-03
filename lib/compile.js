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
 m.styl = function (filename, fn, dist) {
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.RELATIVE_PATH, 'assets/css', name)).toString();
    var dist = dist ? fs.path.join(dist, "/css/") : fs.path.join(config.RELATIVE_PATH, "/public/css/");

    stylus.render(str, function (err, css) {
        if (err) throw err;
        (fn && fn.call && fn.call(null, css));
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
m.less = function (filename, fn, dist) {
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.RELATIVE_PATH, 'assets/css', name)).toString();
    var dist = dist ? fs.path.join(dist, "/css/") : fs.path.join(config.RELATIVE_PATH, "/public/css/");

    // Ignore import files from less
    if (name[0] !== "_") {
        less.render(str, {
            paths: [fs.path.join(config.RELATIVE_PATH, 'assets/css')], // Specify search paths for @import directives
            filename: fs.path.join(config.RELATIVE_PATH, 'assets/css', name), // Specify a filename, for better error messages
            compress: true // Minify CSS output
        },
        function (e, css) {
            if (e) {
                console.log(e);
            }
            (fn && fn.call && fn.call(null, css));
        });
    }
};

m.css = function (filename, fn, dist) {
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.RELATIVE_PATH, 'assets/css', name)).toString();
    var dist = dist ? fs.path.join(dist, "/css/") : fs.path.join(config.RELATIVE_PATH, "/public/css/");

    (fn && fn.call && fn.call(null, str));
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
m.coffee = function (filename, fn, dist) {
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.RELATIVE_PATH, 'assets/js', name)).toString();
    var dist = dist ? fs.path.join(dist, "/js/") : fs.path.join(config.RELATIVE_PATH, "/public/js/");

    var js = coffeescript.compile(str);

    (fn && fn.call && fn.call(null, js));
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
m.babel = function (filename, fn, dist) {
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.JS_DIR, name)).toString();
    var dist = dist ? fs.path.join(dist, "/js/") : fs.path.join(config.RELATIVE_PATH, "/public/js/");

    var js = babel.transform(str,[]);

    (fn && fn.call && fn.call(null, js.code));
};

m.js = function (filename, fn, dist) {
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.JS_DIR, name)).toString();
    var dist = dist ? fs.path.join(dist, "/js/") : fs.path.join(config.RELATIVE_PATH, "/public/js/");

    (fn && fn.call && fn.call(null, str));
};

m.img = function (filename, fn, dist) {
    var name = fs.path.basename(filename);
    var ext = fs.path.extname(name);
    var str = fs.file.read(fs.path.join(config.RELATIVE_PATH, 'assets/img', name));
    var dist = dist ? fs.path.join(dist, "/img/") : fs.path.join(config.RELATIVE_PATH, "/public/img/");

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
m.sass = function (filename, fn, dist) {
    // Get file name
    var name = fs.path.basename(filename);
    var dist = dist ? fs.path.join(dist, "/css/") : fs.path.join(config.RELATIVE_PATH, "/public/css/");

    var pathdist = fs.path.join(dist, name.split(".")[0] + ".css");
    // Ignore import files from sass
    if (name[0] !== "_") {
        sass.render({
            file: fs.path.join(config.RELATIVE_PATH, '/assets/css', name),
            includePaths: [fs.path.join(config.RELATIVE_PATH, '/assets/css')],
            outputStyle: 'compressed'
        }, function (err, rendered) {
            if (err) {
                console.log(err);
            }
        });
    }
};


m.tocss = function (files, fn) {
    var buf = '', ext, count=files.length;
    function cb(css) {
        buf += css;
        count--;
        if(count === 0){
            (fn && fn.call && fn.call(null, buf));
        }
    }

    files.map(function (file) {
        ext = fs.path.extname(file).substr(1);
        m[ext](file, cb);
    })
};

m.tojs = function (files, fn) {
    var buf = '', ext, count=files.length;
    function cb(js) {
        buf += js;
        count--;
        if(count === 0){
            (fn && fn.call && fn.call(null, buf));
        }
    }

    files.map(function (file) {
        ext = fs.path.extname(file).substr(1);
        m[ext](file, cb);
    })
};

module.exports = m;
