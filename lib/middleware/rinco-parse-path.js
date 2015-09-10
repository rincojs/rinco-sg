/* jslint node: true */
/*!
 * rinco - parse Path
 * Copyright(c) 2015 Allan Esquina
 * MIT Licensed
 */
'use strict';

var rinco = require('../rinco');
var config = require('../constants');
var it = require('../interpreter');

// Parse templates files
rinco.render.middleware.register(function rinco_path(next, content, data) {
    var buf;
    [{ start:'<r-path', end:'/>'}].map(function (tag) {
        content = it.parse(content, tag, function (prc) {
            return config.INFO.action === 'dev' ? config.USER_CONFIG.path_dev : config.USER_CONFIG.path_build;
        });
    });
    next(content, data);
});
