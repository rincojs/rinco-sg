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
    var data = data || [], tmp;

    [{ start:'<r-object>', end:'</r-object>'}].forEach(function (tag) {
        content = it.parse(content, tag, function (prc) {
            try {
                var tmp = Function.call(null, '_system', 'global', 'rinco',  prc)(config.INFO, data, rinco);
                data[tmp.name.trim()] = tmp.data;
            } catch (e) {
                console.log(e);
            }
            return '';
        });
    });

    // Return rendered content
    next(content, data);
});
