/*!
 * rinco - tasks
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var rinco = require('./rinco'),
	config = require('./constants');

// Registering tasks

rinco.registerTask( "start-dev", function( rinco ) {
	rinco.createServer();
	rinco.openSublime();
});

rinco.registerTask( "server", function( rinco ) {
	rinco.createServer();
});

rinco.registerTask( "build", function( rinco ) {
	rinco.build();
});

// rinco.registerTaskGroup( "teste:grupo", ["teste"] );