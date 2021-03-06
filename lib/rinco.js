/* jslint node: true */
/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */
'use strict';

var _args = process.argv.slice(2);
var prompt = require('./prompt');
var util = require('./util');
var fs = require('./fs');
var task = require('./task');
var render = require('./render');
var compile = require('./compile');
var install = require('./install');
var server = require('./server');
var build = require('./build');
var config = require('./constants');

var rinco = module.exports = {};

rinco.init = function () {

    prompt.hello();

    if (util.hasConfig() || _args[1] !== undefined) {
        if (_args[0] !== undefined) {
            // Try run a task group, otherwise, run a specific task
            if (!task.run.group(_args[0])) {
                task.run.apply(null, _args);
            }
        } else {
            prompt.direction("list_tasks");
        }
    } else {
        //sh.echo( '✔ Hey, I did not find any configuration file! '.red );
        prompt.direction("list_options");
    }
};

rinco.fs = fs;
rinco.util = util;
rinco.render = render;
rinco.task = task;
rinco.server = server;
rinco.build = build;
rinco.compile = compile;
rinco.install = install;
rinco.prompt = prompt;
rinco.setConfig = config.setConfig;
