/*!
 * xddsp - tasks
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var xddsp = require('./xddsp'),
	config = require('./constants');

// Registering tasks

xddsp.registerTask( "server", function( rinco ) {
	rinco.createServer();
});

xddsp.registerTask( "build", function( rinco ) {
	rinco.build();
});

// xddsp.registerTaskGroup( "teste:grupo", ["teste"] );