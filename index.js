//#!/usr/bin/env node
/*!
 * xddsp
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */
 
'use strict';

var xddsp = require('./xddsp');

require('./plugins/xddsp-parse-template');
require('./plugins/xddsp-handlebars');
require('./plugins/xddsp-reload');

xddsp.init();