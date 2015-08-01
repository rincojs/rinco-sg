/*!
 * rinco - tasks
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var rinco = require('./lib/rinco');


rinco.task.register("server", function () {
    rinco.server.start();
});


rinco.task.register("build", function () {
    rinco.build.generate();
});
