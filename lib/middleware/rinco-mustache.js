/* jslint node: true */
/*!
 * rinco - mustache compile
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */
'use strict';

var rinco = require('../rinco');
var mustache = require('mustache');
var fs = require('../fs');
var config = require('../constants');

// Parse templates files
rinco.render.middleware.register(function rinco_mustache(next, content, data) {

    // Parse template with mustache
    content = mustache.to_html(content, data);

    // Return rendered content
    next(content, data);
});
