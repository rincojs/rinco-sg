/*!
 * xddsp
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

;(function() {
    
    "use strict";


    var app = {};


    var _args,
        config = require('./constants'),
        _readline = require('readline'),
        _fs = require("fs"),
        _inputProjectName,
        _sys = require('sys'),
        _exec = require('child_process').exec,
        connect = require('connect'),
        http = require("http");
  
    app.init = function() {

        _args = process.argv.slice(2);

        if( _args[0] !== undefined )  {            
          switch ( _args[0] ) {
            case "server":
                app.createServer();
                break;
            case "build":
              app.build();
                break;
          }
        } else {
            app.prompt();
        }
    },

    app.prompt = function() {
        var rl = _readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        (function question() {
            rl.question(config.PROMPT_Q_PROJECT_NAME, function(answer) {
                if(answer !== undefined && answer.length > 0) {
                    _inputProjectName = answer;
                    app.createScaffolding(_inputProjectName);
                    rl.close();
                } else {
                    question();
                }
            }); 
        }());
    },
    app.createScaffolding = function(name) {
        _fs.mkdir(name, "0755", function(e) {
            _fs.mkdir('./' + _inputProjectName + "/templates", "0755");
            _fs.mkdir('./' + _inputProjectName + "/pages", "0755");
            _fs.mkdir('./' + _inputProjectName + "/public", "0755");
            _fs.mkdir('./' + _inputProjectName + "/data", "0755");
            _fs.mkdir('./' + _inputProjectName + "/dist", "0755");

            app.copyFile(__dirname + "/templates/", "header.html", './' + _inputProjectName + "/templates" );
            app.copyFile(__dirname + "/templates/", "content.html", './' + _inputProjectName + "/templates" );
            app.copyFile(__dirname + "/templates/", "footer.html", './' + _inputProjectName + "/templates" );
            app.copyFile(__dirname + "/templates/", "index.html", './' + _inputProjectName + "/pages" );
            app.copyFile(__dirname + "/templates/", "user.json", './' + _inputProjectName + "/data" );
            app.copyFile(__dirname + "/templates/", "generic.json", './' + _inputProjectName + "/data" );

        });
    },
    app.copyFile = function(pathOrigin, fileName, pathTo) {
        _fs.createReadStream( pathOrigin + fileName ).pipe(_fs.createWriteStream( pathTo + "/" + fileName ));
    }
    app.puts = function(error, stdout, stderr) { _sys.puts(stdout) },
    app.createServer = function() {
        var server = connect().use(connect.logger('dev'))
            .use(connect.static(config.RELATIVE_PATH + "/public"))
            .use(callbackServer);

        function callbackServer(req, res){      
            
            app.render( req.url , function( content ) {
                // Send response to client
                res.end( content );
            })
        }

        // start server listen
        http.createServer(server).listen(config.SERVER_PORT);
    },    
    app.render = function(file, callback) {

        var content = app.getFileContent(config.PAGES_DIR + file),
            i = 0;

        function next(value) {
            content = value;

            if( i < app.render.middlewares.length ) {
                app.render.middlewares[i++](next, content);
            } else {
                callback(content);
            }
        }

        next(content);

    }
    app.render.middlewares = [];
    app.registerPlugin = function(middleware) {
        return app.render.middlewares.push(middleware);
    }    
    app.getFileContent = function(file) {
        var filePath = config.RELATIVE_PATH + file, out = false;
        console.log(filePath);

        if(_fs.existsSync(filePath)) {
            return _fs.readFileSync(filePath);
        } else {
            return false;
        }     
    },
    app.createFile = function(name, content) {
        _fs.writeFile(name, content, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log(config.PROMPT_FILE_CREATED + name);
            }
        }); 
    },
    app.build = function() {
        _fs.readdir(config.RELATIVE_PATH + config.PAGES_DIR,function(err, files) {

            files.forEach(function(name) {
                app.render( "/" + name , function( content ){
                    app.createFile( config.RELATIVE_PATH + config.DIST_DIR + name, content );
                });
            });
        });
    }
    
    module.exports = app;

}());