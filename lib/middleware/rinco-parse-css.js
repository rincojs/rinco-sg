/* jslint node: true */
/*!
 * rinco - parse CSS
 * Copyright(c) 2015 Allan Esquina
 * MIT Licensed
 */
'use strict';

var rinco = require('../rinco');
var config = require('../constants');
var it = require('../interpreter');

// Parse templates files
rinco.render.middleware.register(function rinco_css(next, content) {
    var files = [];
    [{ start:'<r-css', end:'>'}].map(function (tag) {
        content = it.parse(content, tag, function (prc) {
            if(rinco.fs.file.exist(rinco.fs.path.join(config.CSS_DIR, prc.trim()))) {
                files.push(prc.trim());
            } else {
                return "File: " + rinco.fs.path.join(config.CSS_DIR, prc.trim());
            }
            return '';
        });
    });

    content = content.toString().replace(/(\<\/head\>)/, function (match, head) {
        var script = ' <link rel="stylesheet" href="/styles.css?files=' + files.join('|') + '">';
        return script + "\n" + head;
    });

    next(content);
});
