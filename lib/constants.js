/* jslint node: true */

/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var path = require('path');

var RL = exports.RELATIVE_PATH = process.cwd();
exports.INCLUDE_DIR = path.join(RL, '/pages');
exports.DATA_DIR = path.join(RL, '/data');
exports.DOX_DIR = path.join(RL, '/data/dox');
exports.PAGES_DIR = path.join(RL, '/pages');
exports.CSS_DIR = path.join(RL, '/assets/css');
exports.IMG_DIR = path.join(RL, '/assets/img');
exports.JS_DIR = path.join(RL, '/assets/js');
exports.BUILD_DIR = path.join(RL, '/build');
exports.SERVER_PORT = 3000;
exports.RINCO_TEMPLATE_PATH = path.join( __dirname, '../', 'templates');
