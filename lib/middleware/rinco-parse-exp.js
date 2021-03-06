/* jslint node: true */
/*!
 * rinco - parse JS Expression
 * Copyright(c) 2015 Allan Esquina
 * MIT Licensed
 */
'use strict';

var rinco = require('../rinco');
var config = require('../constants');
var it = require('../interpreter');

// Parse templates files
rinco.render.middleware.register(function rinco_exp(next, content, data) {
    var buf;
    [{ start:'<r-script>', end:'</r-script>'}, { start:'<r-script', end:'/>'}].map(function (tag) {
        content = it.parse(content, tag, function (prc) {
            try {
                buf = Function.call(null, '_system', 'global', 'rinco',  prc)(config.INFO, data, rinco) || '';
            } catch (e) {
                buf = e;
            }
            return buf;
        });
    });
    next(content, data);
});
