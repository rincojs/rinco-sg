/* jslint node: true */
/*!
 * rinco - dox compile
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */
'use strict';

var rinco = require('../rinco');
var dox = require('../dox');
var config = require('../constants');

// Parse templates files
rinco.render.middleware.register(function rinco_dox(next, content) {
    var data = [],
        dataTmp, template;

    // Replace data tags to templates files contents
    var responseString = content.toString().replace(/\@dox\((.*?)\)/g,
        function (match, file, b, c) {
            // define vars
            var split = [],
                alias;

            // alias verification
            if (file.indexOf("as") !== -1) {
                split = file.split("as");
                file = split[0].trim();
            }

            // parse json from file
            dataTmp = JSON.parse(rinco.fs.file.read(rinco.fs.path.join(config.DOX_DIR, file)));
            dataTmp = dox(dataTmp);

            // adding json content in data array with a alias key
            if (dataTmp) {
                alias = split[1] || file.split(".")[0];
                data[alias.trim()] = dataTmp;
            }

            // Return empty string to remove tags from the content
            return "";
        }
    );
    // Return rendered content
    next(responseString, data);
});
