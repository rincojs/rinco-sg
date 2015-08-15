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

rinco.task.register("add", function (query) {
    rinco.prompt.direction('list_search', query);
});

rinco.task.register("update", function (query) {
    rinco.install.start();
});

rinco.task.register("build", function () {
    rinco.build.generate();
});

rinco.task.register("build-uncss", function () {
    rinco.build.generateUncss();
});
