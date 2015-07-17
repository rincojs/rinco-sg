/* jslint node: true */
/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict'

var m = {};
var sh = require('shelljs');

require('colors');
var config = require('./constants');

m.tasks = [];
m.groups = [];

m.run = function (name) {
    var prompt = require('./prompt');
    // Checks if the task name exists
    if (typeof m.tasks[name] === 'function') {
        // Start task
        m.tasks[name].call();
    } else {
        sh.echo('Task not found: '.red + name.yellow + ' \n'.red);
        prompt.direction("list_tasks");
    }
};

m.run.group = function (name) {
    if (typeof m.groups[name] === 'object') {
        m.groups[name].forEach(function (task) {
            m.run(task);
        });
        return true;
    }
    return false;
};

m.getNames = function () {
    var out = [];
    for (var key in m.tasks) {
        out.push(key);
    }
    return out;
};

m.register = function (name, task) {
    // Checks if task is a function and if name exists
    if (typeof task === 'function' && typeof name !== undefined && name.length > 2) {
        // Checks if task exists
        if (typeof m.tasks[name] !== 'function') {
            // Register task
            m.tasks[name] = task;
        }
    }
};

m.register.group = function (name, tasks) {
    // Checks if task is a object
    if (typeof tasks === 'object' && typeof name !== undefined && name.length > 2) {
        // Checks if group exists
        if (typeof m.groups[name] !== 'object') {
            // Register group
            m.groups[name] = tasks;
        }
    }
};

module.exports = m;
