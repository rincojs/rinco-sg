/* jslint node: true */
/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict'

var m = {};
var fs = require('./fs');
var sh = require('shelljs');
var _sys = require('sys');
var open = require('open');
var config = require('./constants');
var render = require('./render');

m.hasConfig = function () {
    // Vefify if config file exist
    if (fs.file.exist(config.RELATIVE_PATH + "/rconf.js")) {
        // Load confg from project
        require(config.RELATIVE_PATH + "/rconf");
        return true;
    }

    return false;
};

m.clone = function (name, callback) {
    if (!sh.which('git')) {
        sh.echo('Sorry, this script requires git');
        exit(1);
    }
    sh.exec('git clone https://github.com/rincojs/tpl-rinco-staticgen-default.git ' + name);
    (callback && callback.call && callback.call());
};


m.puts = function (error, stdout, stderr) {
    _sys.puts(stdout);
};

m.build = function () {
    fs.dir.read(config.PAGES_DIR, function (filename, dist, origin) {
        render.file(fs.path.join(origin, filename), function (content) {
            fs.file.write(fs.path.join(config.BUILD_DIR, dist, filename), content);
        }, ["rinco_reload"]);
    },'');
    // css/js
    render.assets(config.BUILD_DIR);
};

m.openBrowser = function (url, callback) {
    var devPath = url || DEV_PATH + ':' + config.SERVER_PORT + '/index.html';

    open(devPath, 'google-chrome', function (code) {
        // if code is null, the browser exists
        if (code === null) {
            if (typeof callback === "function") {
                callback();
            }
        } else {
            // otherwise, open the default browser
            open(devPath);
        }
    });
};

m.openSublime = function () {
    sh.exec("subl .");
};

module.exports = m;
