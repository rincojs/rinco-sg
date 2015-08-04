/* jslint node: true */
/*!
 * rinco - include templates
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */
'use strict';

var rinco = require('../rinco');
var Markdown = require('markdown').markdown;
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
});

var config = require('../constants');

// Parse templates files
rinco.render.middleware.register(function rinco_template(next, content) {

    parse_template(content);

    function parse_template(content) {

        if (content.toString().match(/(?:[^\@]|^)\@include\((.*?)\)/g)) {

            // Replace include tags to templates files contents
            content = content.toString().replace(/(?:[^\@]|^)\@include\((.*?)\)/g, function (match, contents, offset, s) {

                var tmpTemplate = rinco.fs.file.read(rinco.fs.path.join(config.INCLUDE_DIR, contents));

                if (tmpTemplate) {
                    // check Markdown
                    if (rinco.fs.path.extname(contents) === ".md") {
                        // compile markdown
                        tmpTemplate = md.render(tmpTemplate.toString());
                        // tmpTemplate = Markdown.toHTML(tmpTemplate.toString());
                    }

                    // Prevents that the template includes itself
                    tmpTemplate = tmpTemplate.toString().replace(/(?:[^\@]|^)\@include\((.*?)\)/g, function (m, f) {
                        return (f === contents) ? "" : m;
                    });
                    return tmpTemplate;

                } else {
                    return "File: " + rinco.fs.path.join(config.INCLUDE_DIR, contents);
                }
            });

            // Call recursive function
            parse_template(content);

        } else {
            content = content.toString().replace(/\@(\@include\(.*?\))/g,function (m, f, b, c) {
                return f;
            });
            next(content);
        }
    }
});
