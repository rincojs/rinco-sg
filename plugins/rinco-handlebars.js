/* jslint node: true */

/*!
 * rinco - handlebars compile
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var rinco = require('../rinco'),
    config = require('../constants'),
    path = require('path'),
    Handlebars = require('handlebars');

// Parse templates files
rinco.registerPlugin( function rinco_handlebars( next, content ) {
    var data = [], dataTmp, template;

    // Replace data tags to templates files contents
    var responseString = content.toString().replace(/\@data\((.*?)\)/g,
        function(match, file, b, c) {
            // define vars
            var split = [], alias;

            // alias verification
            if ( file.indexOf("as") !== -1 ) {
                split = file.split("as");
                file = split[0].trim();
            }

            // parse json from file
            dataTmp = JSON.parse( rinco.getFileContent(null, path.join( config.DATA_DIR, file ) ) );

            // adding json content in data array with a alias key
            if ( dataTmp ) {
                alias = split[1] || file.split(".")[0];
                data[alias.trim()] = dataTmp;
            }

            // Return empty string to remove tags from the content
            return "";
        }
    );

    // Parse template with handlebarsjs
    template = Handlebars.compile(responseString);
    responseString = template(data);

    // Return rendered content
    next(responseString);
});
