/* jslint node: true */

/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var path = require('path');

//CONSTANTS
module.exports = (function() {

    var RELATIVE_PATH = process.cwd(),
        INCLUDE_DIR = path.join( RELATIVE_PATH, '/assets/includes' ),
        DATA_DIR = path.join( RELATIVE_PATH, '/assets/data' ),
        PUBLIC_DIR = path.join( RELATIVE_PATH, '/public' ),
        PAGES_DIR = path.join( RELATIVE_PATH, '/assets/pages' ),
        BUILD_DIR = path.join( RELATIVE_PATH, '/build' );

    // App Constants
    var RINCO_TEMPLATE_PATH = path.join( __dirname, "templates" );

    return {
        RELATIVE_PATH: RELATIVE_PATH,
        INCLUDE_DIR: INCLUDE_DIR,
        DATA_DIR: DATA_DIR,
        PUBLIC_DIR: PUBLIC_DIR,
        PAGES_DIR: PAGES_DIR,
        BUILD_DIR: BUILD_DIR,
        DEV_PATH: 'http://localhost',
        SERVER_PORT: '3000',
        PROMPT_Q_PROJECT_NAME: 'Qual o nome do projeto? ',
        PROMPT_FILE_CREATED: 'Criando arquivo ',
        SERVER_TEMPLATE_NOT_FOUND: 'O template não foi encontrado',
        SERVER_FILE_NOT_FOUND: '404',
        RINCO_TEMPLATE_PATH: RINCO_TEMPLATE_PATH
    };
}());
