/* jslint node: true */

/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var rinco = require('./rinco');

require('./middlewares/rinco-parse-template');
require('./middlewares/rinco-handlebars');
require('./middlewares/rinco-mustache');
require('./middlewares/rinco-reload');

require('./tasks.js');

rinco.init();
