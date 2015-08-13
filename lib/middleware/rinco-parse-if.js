/* jslint node: true */
/*!
 * rinco - parse IF
 * Copyright(c) 2015 Allan Esquina
 * MIT Licensed
 */
'use strict';

var rinco = require('../rinco');
var config = require('../constants');

// Parse templates files
rinco.render.middleware.register(function rinco_if(next, content) {
    var files = [], reg = /(?:[^\@]|^)\@\<\<\s(.*)\s*\>\>\@/g, res;
    parse_template(content);

    function parse_template(content) {

        next(content);
    }
});
