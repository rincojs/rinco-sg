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

/**
 * Run an especific task
 *
 * @example
 *
 *     rinco.task.run('taskname');
 *
 * @param {string} Task name
 * @api public
 */
m.run = function (name, arg) {
    var prompt = require('./prompt');
    // Checks if the task name exists
    if (typeof m.tasks[name] === 'function') {
        // Start task
        m.tasks[name].call(null, arg);
    } else {
        sh.echo('Task not found: '.red + name.yellow + ' \n'.red);
        prompt.direction("list_tasks");
    }
};

/**
 * Run an especific task's group
 *
 * @example
 *
 *     rinco.task.run.group('groupname');
 *
 * @param {string} Task name
 * @api public
 */
m.run.group = function (name) {
    if (typeof m.groups[name] === 'object') {
        m.groups[name].forEach(function (task) {
            m.run(task);
        });
        return true;
    }
    return false;
};

/**
 * Get the registereds tasks names
 *
 * @example
 *
 *     rinco.task.getNames();
 *@return {String[]} Task's names
 * @api public
 */
m.getNames = function () {
    var out = [];
    for (var key in m.tasks) {
        out.push(key);
    }
    return out;
};

/**
 * Register a especific task
 *
 * @example
 *
 *     rinco.task.register('taskname');
 *
 * @param {string} Task name
 * @param {Function} Task
 * @api public
 */
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

/**
 * Register a especific task's group
 *
 * @example
 *
 *     rinco.task.register.group('groupname');
 *
 * @param {string} Group name
 * @param {Array} Tasks
 * @api public
 */
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
