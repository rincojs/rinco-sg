/* jslint node: true */

/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var rinco = module.exports = require('./lib/rinco');

require('./lib/middleware/rinco-parse-template');
require('./lib/middleware/rinco-parse-render');
require('./lib/middleware/rinco-parse-css');
require('./lib/middleware/rinco-parse-js');
// require('./lib/middleware/rinco-handlebars');
// require('./lib/middleware/rinco-dox');
require('./lib/middleware/rinco-mustache');
require('./lib/middleware/rinco-parse-exp');
require('./lib/middleware/rinco-reload');
require('./tasks');

rinco.init();
