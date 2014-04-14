/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */
 
'use strict';

var rinco = require('./rinco');

require('./plugins/rinco-parse-template');
require('./plugins/rinco-handlebars');
require('./plugins/rinco-reload');

require('./tasks.js');

rinco.init();