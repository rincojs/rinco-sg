/* jslint node: true */
/*!
 * rinco - global data
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */
'use strict';

var rinco = require('../rinco');
var it = require('../interpreter');
var fs = require('../fs');
var config = require('../constants');

// Parse templates files
rinco.render.middleware.register(function rinco_global_data(next, content, data) {
    var data = data || [], tmp, template;

    [{ start:'<r-data', end:'>'},{ start:'<r-object>', end:'</r-object>'}].map(function (tag) {
        content = it.parse(content, tag, function (prc) {
            var filename = prc.trim();
            var split = [], alias;

            if(prc.indexOf('return') !== -1) {
                try {
                    var tmp = Function.call(null, '_system', 'self', 'rinco',  prc)(config.INFO, data, rinco) || {}
                    data[tmp.name.trim()] = tmp.data;
                } catch (e) {
                    console.log(e);
                 }
                 return '';
            }
            // alias verification
            if (filename.indexOf("=") !== -1) {
                split = filename.split("=");
                filename = split[0].trim();
            }
            // parse json from file
            tmp = JSON.parse(rinco.fs.file.read(rinco.fs.path.join(config.DATA_DIR, filename)));
            // adding json content in data array with a alias key
            if (tmp) {
                var ext = rinco.fs.path.extname(filename);
                alias = split[1] || rinco.fs.path.basename(filename).replace(ext, '');
                data[alias.trim()] = tmp;
            } else {
                return "File: " + rinco.fs.path.join(config.DATA_DIR, prc.trim());
            }
            return '';
        });
    });

    // Put system information on data obj
    data._system = config.INFO;

    // Return rendered content
    next(content, data);
});
