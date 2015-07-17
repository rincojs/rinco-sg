/* jslint node: true */
/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */
'use strict';

var app = {
    compile: {}
};

var _args = process.argv.slice(2);
var prompt = require('./lib/prompt');
var util = require('./lib/util');
var fs = require('./lib/fs');
var task = require('./lib/task');
var render = require('./lib/render');
var server = require('./lib/server');
app.init = function () {

    // prompt.hello();

    console.log(_args[0]);

    if (util.hasConfig() || _args[1] !== undefined) {
        if (_args[0] !== undefined) {
            // Try run a task group, otherwise, run a specific task
            if (!task.run.group(_args[0])) {
                task.run(_args[0]);
            }
        } else {
            prompt.direction("list_tasks");
        }
    } else {
        //sh.echo( '✔ Hey, I did not find any configuration file! '.red );
        prompt.direction("list_options");
    }
};

app.fs = fs;
app.util = util;
app.render = render;
app.task = task;
app.server = server;
app.prompt = prompt;

module.exports = app;
