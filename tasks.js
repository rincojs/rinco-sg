/*!
 * rinco - tasks
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var rinco = require('./lib/rinco');

// Registering tasks
rinco.task.register("start-dev", function () {
    rinco.server.start();
    rinco.util.openSublime();
});

rinco.task.register("server", function () {
    rinco.server.start();
});

rinco.task.register("server:no-handlebars", function () {
    rinco.server.start(["rinco_handlebars"]);
});

rinco.task.register("build", function () {
    rinco.util.build();
});

rinco.task.register("init", function () {
    rinco.server.start(function (error) {
        if (error) {
            console.log('Invalid name!');
            return false;
        }
        rinco.prompt.direction("list_tasks");
    });
});

// rinco.task.register( "teste:grupo", ["teste"] );
