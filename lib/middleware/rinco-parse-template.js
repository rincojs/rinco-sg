/* jslint node: true */
/*!
 * rinco - include templates
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */
'use strict';

var rinco = require('../rinco');
var it = require('../interpreter');
var Markdown = require('markdown').markdown;
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
});

var config = require('../constants');

// Parse templates files
rinco.render.middleware.register(function rinco_template(next, content) {
    [{ start:'<r-include', end:'/>'}].map(function (tag) {

        function r(content) {
            var has = false;

            content = it.parse(content, tag, function (prc) {
                var filename = prc.trim();
                var tpl = rinco.fs.file.read(rinco.fs.path.join(config.INCLUDE_DIR, filename));
                has = true;
                if(tpl) {
                    if (rinco.fs.path.extname(filename) === ".md") {
                        tpl = md.render(tpl.toString());
                    }
                    return tpl;
                }
                else {
                    return "File: " + rinco.fs.path.join(config.INCLUDE_DIR, filename);
                }
            });

            return has ? r(content) : content;
        }
        content = r(content.toString());
    });

    next(content);
});
