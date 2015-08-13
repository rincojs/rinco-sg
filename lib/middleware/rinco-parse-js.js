/* jslint node: true */
/*!
 * rinco - parse JS
 * Copyright(c) 2015 Allan Esquina
 * MIT Licensed
 */
'use strict';

var rinco = require('../rinco');
var config = require('../constants');

// Parse templates files
rinco.render.middleware.register(function rinco_css(next, content) {
    var files = [];
    parse_template(content);

    function parse_template(content) {

        if (content.toString().match(/(?:[^\@]|^)\@js\((.*?)\)/g)) {

            // Replace include tags to templates files contents
            content = content.toString().replace(/(?:[^\@]|^)\@js\((.*?)\)/g, function (match, contents, offset, s) {

                if(rinco.fs.file.exist(rinco.fs.path.join(config.JS_DIR, contents))) {
                    files.push(contents);
                } else {
                    return "File: " + rinco.fs.path.join(config.JS_DIR, contents);
                }
                return '';
            });

            // Call recursive function
            parse_template(content);

        } else {

            content = content.toString().replace(/\@(\@js\(.*?\))/g,function (m, f, b, c) {
                return f;
            });

            content = content.toString().replace(/(\<\/body\>)/, function (match, body) {
                var script = '<script src="/scripts.js?files=' + files.join('|') + '" charset="utf-8"></script>';
                return script + "\n" + body;
            });
            next(content);
        }
    }
});
