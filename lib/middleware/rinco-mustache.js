/* jslint node: true */
/*!
 * rinco - mustache compile
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */
'use strict';

var rinco = require('../rinco');
var mustache = require('mustache');

var config = require('../constants');
// Parse templates files
rinco.render.middleware.register(function rinco_mustache(next, content, data) {
    var data = data || [],
        dataTmp, template;

    // Replace data tags to templates files contents
    var responseString = content.toString().replace(/(?:[^\@]|^)\@data\((.*)\)/g,
        function (match, file, b, c) {
            // define vars
            var split = [],
                alias;

            // alias verification
            if (file.indexOf("=>") !== -1) {
                split = file.split("=>");
                file = split[0].trim();
            }
            // parse json from file
            dataTmp = JSON.parse(rinco.fs.file.read(rinco.fs.path.join(config.DATA_DIR, file)));

            // adding json content in data array with a alias key
            if (dataTmp) {
                alias = split[1] || file.split(".")[0];
                data[alias.trim()] = dataTmp;
            }

            // Return empty string to remove tags from the content
            return "";
        }
    );

    responseString = responseString.toString().replace(/\@(\@data\(.*?\))/g,function (m, f, b, c) {
        return f;
    });
    // Parse template with mustache
    responseString = mustache.to_html(responseString, data);

    // Return rendered content
    next(responseString);
});
