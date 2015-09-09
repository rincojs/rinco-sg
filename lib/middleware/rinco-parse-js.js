/* jslint node: true */
/*!
 * rinco - parse JS
 * Copyright(c) 2015 Allan Esquina
 * MIT Licensed
 */
'use strict';

var rinco = require('../rinco');
var config = require('../constants');
var it = require('../interpreter');

// Parse templates files
rinco.render.middleware.register(function rinco_js(next, content) {
    var files = [];
    [{ start:'<r-js', end:'/>'}].map(function (tag) {
        content = it.parse(content, tag, function (prc) {
            if(rinco.fs.file.exist(rinco.fs.path.join(config.JS_DIR, prc.trim()))) {
                files.push(prc.trim());
            } else {
                return "File: " + rinco.fs.path.join(config.JS_DIR, prc.trim());
            }
            return '';
        });
    });
    content = content.toString().replace(/(\<\/body\>)/, function (match, body) {
        var script = '<script src="/scripts.js?files=' + files.join('|') + '" charset="utf-8"></script>';
        return script + "\n" + body;
    });
    next(content);
});
