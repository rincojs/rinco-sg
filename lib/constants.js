/* jslint node: true */

/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var path = require('path');
exports.RELATIVE_PATH = process.cwd();
exports.INCLUDE_DIR = path.join(exports.RELATIVE_PATH, '/assets/includes');
exports.DATA_DIR = path.join(exports.RELATIVE_PATH, '/assets/data');
exports.PUBLIC_DIR = path.join(exports.RELATIVE_PATH, '/public');
exports.PAGES_DIR = path.join(exports.RELATIVE_PATH, '/assets/pages');
exports.BUILD_DIR = path.join(exports.RELATIVE_PATH, '/build');
exports.SERVER_PORT = 3000;
exports.RINCO_TEMPLATE_PATH = path.join( __dirname, 'templates');
