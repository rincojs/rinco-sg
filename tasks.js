/*!
 * rinco - tasks
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var rinco = require('./rinco'),
    config = require('./constants');

// Registering tasks
rinco.registerTask( "start-dev", function() {
    rinco.createServer();
    rinco.openSublime();
});

rinco.registerTask( "server", function() {
    rinco.createServer();
});

rinco.registerTask( "server:no-handlebars", function() {
    rinco.createServer( [ "rinco_handlebars" ] );
});

rinco.registerTask( "build", function() {
    rinco.build();
});

// rinco.registerTaskGroup( "teste:grupo", ["teste"] );