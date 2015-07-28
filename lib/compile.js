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
 m.stylus = function (filename, dist) {
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.RELATIVE_PATH, 'assets/css', name)).toString();
    var dist = dist ? fs.path.join(dist, "/css/") : fs.path.join(config.RELATIVE_PATH, "/public/css/");

    stylus.render(str, {
        filename: filename
    }, function (err, css) {
        if (err) throw err;
        fs.file.write(fs.path.join(dist, name.split(".")[0] + ".css"), css, function () {
            (!dist && server.io.sockets.emit('refresh', {
                action: 'refresh'
            }));
        });
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
m.less = function (filename, dist) {
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
        function (e, result) {
            if (e) {
                console.log(e);
            }
            fs.file.write(fs.path.join(dist, name.split(".")[0] + ".css"), result, function () {
                (!dist && server.io.sockets.emit('refresh', {
                    action: 'refresh'
                }));
            });
        });
    }
};

m.css = function (filename, dist) {
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.RELATIVE_PATH, 'assets/css', name)).toString();
    var dist = dist ? fs.path.join(dist, "/css/") : fs.path.join(config.RELATIVE_PATH, "/public/css/");

    fs.file.write(fs.path.join(dist, name), str, function () {
        (!dist && server.io.sockets.emit('refresh', {
            action: 'refresh'
        }));
    });
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
m.coffeescript = function (filename, dist) {
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.RELATIVE_PATH, 'assets/js', name)).toString();
    var dist = dist ? fs.path.join(dist, "/js/") : fs.path.join(config.RELATIVE_PATH, "/public/js/");

    var js = coffeescript.compile(str);

    fs.file.write(fs.path.join(dist, name.split(".")[0] + ".js"), js, function () {
        (!dist && server.io.sockets.emit('refresh', {
            action: 'refresh'
        }));
    });
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
m.babel = function (filename, dist) {
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.RELATIVE_PATH, 'assets/js', name)).toString();
    var dist = dist ? fs.path.join(dist, "/js/") : fs.path.join(config.RELATIVE_PATH, "/public/js/");

    var js = babel.transform(str,[]);

    fs.file.write(fs.path.join(dist, name.split(".")[0] + ".js"), js.code, function () {
        (!dist && server.io.sockets.emit('refresh', {
            action: 'refresh'
        }));
    });
};

m.js = function (filename, dist) {
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.RELATIVE_PATH, 'assets/js', name)).toString();
    var dist = dist ? fs.path.join(dist, "/js/") : fs.path.join(config.RELATIVE_PATH, "/public/js/");

    fs.file.write(fs.path.join(dist, name.split(".")[0] + ".js"), str, function () {
        (!dist && server.io.sockets.emit('refresh', {
            action: 'refresh'
        }));
    });
};

m.img = function (filename, dist) {
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
m.sass = function (filename, dist) {
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
            fs.file.write(pathdist, rendered.css.toString(), function () {
                (!dist && server.io.sockets.emit('refresh', {
                    action: 'refresh'
                }));
            });
        });
    }
};

/**
 * Compile a typescript file.
 *
 * @example
 *
 *     rinco.compile.typescript('style.css 'public/css/');
 *
 * @param {String} filename
 * @param {String} dist
 * @api public
 */
m.typescript = function (filename, dist) {
    var ts = require('./vendor/typescript/bin/tsc.js');
    var name = fs.path.basename(filename);
    var str = fs.file.read(fs.path.join(config.RELATIVE_PATH, 'assets/js', name)).toString();
    var dist = dist ? fs.path.join(dist, "/js/") : fs.path.join(config.RELATIVE_PATH, "/public/js/");
        try {
            fs.file.remove(fs.path.join(dist, name.split(".")[0] + ".js"));

            ts.executeCommandLine(['--out', fs.path.join(dist, name.split(".")[0] + '.js'), fs.path.join(config.RELATIVE_PATH, 'assets/js', name)]);
             (!dist && server.io.sockets.emit('refresh', {
                 action: 'refresh'
             }));

        } catch (e) {

        }
};

module.exports = m;
