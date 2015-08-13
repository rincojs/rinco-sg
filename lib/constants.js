/* jslint node: true */

/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var path = require('path');

var RL = exports.RELATIVE_PATH = process.cwd();
var ENV = exports.ENV = process.env.NODE_ENV === 'test' ? 'test' : '';
exports.INFO = {};
exports.INCLUDE_DIR = path.join(RL, ENV, '/templates');
exports.DATA_DIR = path.join(RL, ENV, '/data');
exports.DOX_DIR = path.join(RL, '/data/dox');
exports.PAGES_DIR = path.join(RL, ENV, '/templates');
exports.CSS_DIR = path.join(RL, ENV, '/assets/css');
exports.IMG_DIR = path.join(RL, ENV, '/assets/img');
exports.JS_DIR = path.join(RL, ENV, '/assets/js');
exports.BUILD_DIR = path.join(RL, ENV, '/build');
exports.SERVER_PORT = 3000;
exports.RINCO_TEMPLATE_PATH = path.join( __dirname, '../', 'templates');
