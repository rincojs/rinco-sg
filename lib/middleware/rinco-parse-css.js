/* jslint node: true */
/*!
 * rinco - parse CSS
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

        if (content.toString().match(/\@css\((.*?)\)/g)) {

            // Replace include tags to templates files contents
            content = content.toString().replace(/\@css\((.*?)\)/g, function (match, contents, offset, s) {

                if(rinco.fs.file.exist(rinco.fs.path.join(config.CSS_DIR, contents))) {
                    files.push(contents);
                } else {
                    return "File: " + rinco.fs.path.join(config.CSS_DIR, contents);
                }
                return '';
            });

            // Call recursive function
            parse_template(content);

        } else {

            content = content.toString().replace(/(\<\/head\>)/, function (match, head) {
    	        var script = ' <link rel="stylesheet" href="/styles.css?files=' + files.join('|') + '">';
                return script + "\n" + head;
            });
            next(content);
        }
    }
});
