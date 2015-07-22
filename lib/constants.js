/* jslint node: true */

/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var path = require('path');

var RL = exports.RELATIVE_PATH = process.cwd();
exports.INCLUDE_DIR = path.join(RL, '/assets/includes');
exports.DATA_DIR = path.join(RL, '/assets/data');
exports.DOX_DIR = path.join(RL, '/assets/data/dox');
exports.PUBLIC_DIR = path.join(RL, '/public');
exports.PAGES_DIR = path.join(RL, '/assets/pages');
exports.BUILD_DIR = path.join(RL, '/build');
exports.SERVER_PORT = 3000;
exports.RINCO_TEMPLATE_PATH = path.join( __dirname, '../', 'templates');
