/* jslint node: true */
/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */
'use strict'

var sass = require('node-sass');
var stylus = require('stylus');
var less = require('less');
var coffeescript = require("coffee-script");
var fs = require('./fs')
var server = require('./server');
var m = {};

var config = require('./constants');

m.stylus = function (filename, dist) {
    var str = fs.file.read("", filename).toString();
    var name = fs.path.basename(filename);
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

m.sass = function (filename, dist) {
  console.log(filename,dist);
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

module.exports = m;
