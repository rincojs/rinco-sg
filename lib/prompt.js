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
var util = require('./util');
var sh = require('shelljs');
var task = require('./task');
var install = require('./install');
var config = require('./constants');

require('colors');

m.data = {projectName:'myProject'};

/**
 * Echo the hello message in terminal.
 *
 * @example
 *
 *     rinco.prompt.hello();
 *
 * @api public
 */
m.hello = function () {
    sh.echo('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
    sh.echo('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
    sh.echo('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');

    sh.echo("\n\
    ___  _____  ___________    _________\n\
   / _ \\/  _/ |/ / ___/ __ \\  / __/ ___/\n\
  / , _// //    / /__/ /_/ / _\\ \\/ (_ /\n\
 /_/|_/___/_/|_/\\___/\\____/ /___/\\___/ \n".blue);

    sh.echo(' --- Static website generator ---'.grey);
    sh.echo(' ---     rincojs.com/sg       ---'.grey);
    sh.echo('\n');
};

/**
 * Go to the especific questions's section
 *
 * @example
 *
 *     rinco.prompt.direction('create_project');
 *
 * @param {String} Section name
 * @api public
 */
m.direction = function (action, arg) {

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
    case "list_search":
        prompt_list_search(arg);
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
            var server = require('./server');
            server.get('https://raw.githubusercontent.com', '/rincojs/rinco-staticgen/master/templates/available.json', prompt_list_templates);

        });
    }

    function prompt_list_templates(data) {
        data = JSON.parse(data);

        var questions = [{
            type: "list",
            name: "project_template",
            message: "Select a template",
            choices: data,
            default: false
        }];

        inquirer.prompt(questions, function (answers) {
            var tpl;

            if (typeof m.data !== 'undefined' && m.data.hasOwnProperty('projectName')) {
              data.forEach(function (d) {
                if(d.name === answers.project_template) {
                  tpl = d;
                }
              });

              util.clone(tpl.url, m.data.projectName, function () {
                  prompt_list_tasks('template');
              });
            }

        });
    }

    function prompt_list_tasks(origin) {

        var questions = [{
            type: "list",
            name: "project_task",
            message: "Select a task",
            choices: task.getNames(),
            default: false
        }];

        inquirer.prompt(questions, function (answers) {

          if(origin === 'template') {
            if (typeof m.data !== 'undefined' && m.data.hasOwnProperty('projectName')) {
                sh.cd(fs.path.join(config.RELATIVE_PATH, m.data.projectName));
            }
          }

          sh.exec("rinco " + answers.project_task);
        });
    }

    function prompt_list_options() {

        var questions = [{
            type: "list",
            name: "project_options",
            message: "Choose an option",
            choices: ["New project", "Documentation"],
            default: false
        }];

        inquirer.prompt(questions, function (answers) {

            if (answers.project_options === "New project") {
                prompt_create_project();
            }

            if (answers.project_options === "Documentation") {
                util.openBrowser("http://rincojs.com/sg");
                m.hello();
                prompt_list_options();
            }
        });
    }

    function prompt_list_search(query) {
        if(!query) {
            prompt_search();
            return false;
        }
       var list = install.list(query);
        var questions = [{
            type: "checkbox",
            name: "lib",
            message: "What do want to use in the project?",
            choices: list,
            default: false
        }];

        inquirer.prompt(questions, function (answers) {
            prompt_list_files(answers.lib);
        });
    }

    function prompt_search() {
        var questions = [{
            type: "input",
            name: "query",
            message: "Looking for",
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
            prompt_list_search(answers.query);
        });
    }

    function prompt_list_files(libs) {
        fs.dir.readList(config.PAGES_DIR, function (files) {
            var questions = [{
                type: "checkbox",
                name: "files",
                message: "Which files do you want to load the libraries?",
                choices: files,
                default: false
            }];

            inquirer.prompt(questions, function (answers) {
                answers.files.forEach(function (name) {
                });
                install.link(answers.files, libs);
            });
        });
    }
};

module.exports = m;
