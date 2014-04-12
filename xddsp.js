/*!
 * xddsp
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */
    
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
    http = require("http"),
    io = require("socket.io"),
    watch = require('node-watch'),
    sass = require('node-sass'),
    sh = require('shelljs'),
    open = require('open'),
    relativePath = config.RELATIVE_PATH;

require('colors');

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
};

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
};

app.createScaffolding = function(name) {

    _fs.mkdir(name, "0755", function(e) {
        _fs.mkdir('./' + _inputProjectName + "/templates", "0755",  function(e) {
            app.copyFile(__dirname + "/templates/", "header.html", './' + _inputProjectName + "/templates" );
            app.copyFile(__dirname + "/templates/", "content.html", './' + _inputProjectName + "/templates" );
            app.copyFile(__dirname + "/templates/", "footer.html", './' + _inputProjectName + "/templates" );            
        });


        _fs.mkdir('./' + _inputProjectName + "/pages", "0755", function(e) {
            app.copyFile(__dirname + "/templates/", "index.html", './' + _inputProjectName + "/pages" );
        });


        _fs.mkdir('./' + _inputProjectName + "/public", "0755", function(e) {
            _fs.mkdir('./' + _inputProjectName + "/public/css", "0755");
        });        


        _fs.mkdir('./' + _inputProjectName + "/data", "0755", function(e) {
            app.copyFile(__dirname + "/templates/", "user.json", './' + _inputProjectName + "/data" );
            app.copyFile(__dirname + "/templates/", "generic.json", './' + _inputProjectName + "/data" );            
        });

        _fs.mkdir('./' + _inputProjectName + "/dist", "0755");

        _fs.mkdir('./' + _inputProjectName + "/sass", "0755", function(e) {
            app.copyFile(__dirname + "/templates/", "main.scss", './' + _inputProjectName + "/sass" );
        });


    });
};

app.copyFile = function(pathOrigin, fileName, pathTo) {
    _fs.createReadStream( pathOrigin + fileName ).pipe(_fs.createWriteStream( pathTo + "/" + fileName ));
};

app.puts = function(error, stdout, stderr) { _sys.puts(stdout) };

app.createServer = function() {
    var server = connect().use(connect.logger('dev'))
        .use(connect.static(relativePath + "/public"))
        // .use( sass.middleware({
        //           src: relativePath + "/sass"
        //         , dest: relativePath + '/public/css'
        //         , debug: true
        //       })) 
        .use(callbackServer);

    function callbackServer(req, res){      
        
        app.render( req.url , function( content ) {
            // Send response to client
            res.end( content );
        })
    }

    // start server listen
    var myServer = http.createServer(server).listen(config.SERVER_PORT);

    // start socket
    io = io.listen(myServer);
    io.sockets.on('connection', function (socket) {});
    // reduce logging
    io.set('log level', 1);

    // start watch files
    app.startWatch();

    // open the page in browser
    app.openBrowser();

};

// Alias of watch
app.watch = function( path, options, fn ) {

    options = options || { recursive: false, followSymLinks: true };

    watch(relativePath + path, options, function( filename ) {
        if ( typeof fn === 'function' ) {
            fn.call( filename );
        } else {
            io.sockets.emit('refresh', { action: 'refresh' });
        }
    });

};

app.startWatch = function () {

    app.watch('/templates');
    app.watch('/pages');

    // Sass compilation
    app.watch('/sass', function( filename ) {

        // var name = filename.split("/");
        // name = name.reverse()[0].split(".")[0];

        var css = sass.render({
            file: relativePath + '/sass/main.scss',            
            includePaths: [ relativePath + '/sass' ],
            outputStyle: 'compressed',
            success: function(css) {
                app.createFile(relativePath + "/public/css/styles.css", css, function(){
                    io.sockets.emit('refresh', { action: 'refresh' });
                })
                //console.log(css)
            },
            error: function(e) {
                console.log(e);
            }
        });

    });

};

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

};

app.render.middlewares = [];

app.registerPlugin = function(middleware) {
    return app.render.middlewares.push(middleware);
};

app.getFileContent = function(file, filePath) {
    var filePath = filePath || relativePath + file, out = false;
    console.log(filePath);

    if(_fs.existsSync(filePath)) {
        return _fs.readFileSync(filePath);
    } else {
        return false;
    }     
};

app.createFile = function( name, content, callback ) {
    _fs.writeFile(name, content, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log(config.PROMPT_FILE_CREATED + name);
            if( callback ) {
                callback();
            }
        }
    }); 
};

app.build = function() {
    _fs.readdir(relativePath + config.PAGES_DIR,function(err, files) {

        files.forEach(function(name) {
            app.render( "/" + name , function( content ){
                app.createFile( relativePath + config.DIST_DIR + name, content );
            });
        });
    });
};

app.openBrowser = function() {

    var devPath = config.DEV_PATH + ':' + config.SERVER_PORT + '/index.html';

    open( devPath, 'google-chrome', function( code ) {

        // if code is null, the browser exists
        if ( code === null ) {

            sh.echo( '✔ http://localhost:3000/index.html'.green );

        } else {

            // otherwise, open the default browser
            open( devPath );
        } 

    });

};

module.exports = app;
