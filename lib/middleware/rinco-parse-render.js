/* jslint node: true */
/*!
 * rinco - parse render
 * Copyright(c) 2015 Allan Esquina
 * MIT Licensed
 */
'use strict';

var rinco = require('../rinco');
var config = require('../constants');
var it = require('../interpreter');

// Parse templates files
rinco.render.middleware.register(function rinco_render(next, content, data) {
    var buf;
    [{ start:'<r-render', end:'/>'}].map(function (tag) {
        content = it.parse(content, tag, function (prc) {
            console.log(prc);
            var s = prc.trim().split('=>');
            var data = JSON.parse(s[1].trim());
            var done = false;
            var content;
            rinco.render.file(rinco.fs.path.join(config.PAGES_DIR, s[0].trim()), function (data) {
               content = data;
               done=true;
           }, ['rinco_js', 'rinco_css', 'rinco_reload', 'rinco_mustache'], true);
            require('deasync').loopWhile(function(){return !done;});
            return rinco.render.mustache.to_html(content, data);
        });
    });
    next(content);
});
