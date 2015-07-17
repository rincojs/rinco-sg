/* jslint node: true */
/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict'

var m = {};
var fs = require('./fs');
var inquirer = require('inquirer');
require('colors');
var util = require('./util');
var sh = require('shelljs');
var task = require('./task');

var config = require('./constants');

m.hello = function () {
    sh.echo('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
    sh.echo('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
    sh.echo('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
    sh.echo('   _____ _                   ___ _____'.yellow);
    sh.echo('  | ___ (_)                 |_  /  ___|'.yellow);
    sh.echo('  | |_/ /_ _ __   ___ ___     | \\ `--. '.yellow);
    sh.echo("  |    /| |  _ \\ / __/ _ \\    | |`--. \\ ".yellow);
    sh.echo('  | |\\ \\| | | | | (_| (_) /\\__/ /\\__/ /'.yellow);
    sh.echo('  \\_| \\_|_|_| |_|\\___\\___/\\____/\\____/ '.yellow);
    sh.echo('  \n');

    sh.echo(' * Static Generator!'.green);
    sh.echo('\n\n');
};

m.direction = function (action) {

    switch (action) {
    case "create_project":
        prompt_create_project();
        break;
    case "list_tasks":
        prompt_list_tasks();
        break;
    case "list_options":
        prompt_list_options();
        break;
    }

    function prompt_create_project() {
        var questions = [{
            type: "input",
            name: "project_name",
            message: "Project name",
            validate: function (value) {

                if (value !== undefined && value.length > 2) {
                    return true;
                } else {
                    return "Oh oh, something is wrong! Try again!";
                }
            },
            default: false
        }];

        inquirer.prompt(questions, function (answers) {

            m.data.projectName = answers.project_name;
            util.clone(function () {
                prompt_list_tasks();
            });
        });
    }

    function prompt_list_tasks() {

        var questions = [{
            type: "list",
            name: "project_task",
            message: "Select a task",
            choices: task.getNames(),
            default: false
        }];

        inquirer.prompt(questions, function (answers) {

            if (typeof m.data !== 'undefined' && m.data.hasOwnProperty('projectName')) {
                sh.cd(fs.path.join(config.RELATIVE_PATH, m.data.projectName));
            }

            sh.exec("rinco " + answers.project_task);
        });
    }

    function prompt_list_options() {

        var questions = [{
            type: "list",
            name: "project_options",
            message: "What do you want to do?",
            choices: ["Create a new project", "See the documentation"],
            default: false
        }];

        inquirer.prompt(questions, function (answers) {

            if (answers.project_options === "Create a new project") {
                prompt_create_project();
            }

            if (answers.project_options === "See the documentation") {
                app.openBrowser("rincojs.com/doc");
                app.sayHello();
                prompt_list_options();
            }
        });
    }
};

module.exports = m;
