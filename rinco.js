/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */
    
"use strict";


var app = {};

var _args = process.argv.slice(2),
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
    inquirer = require('inquirer'),
    relativePath = config.RELATIVE_PATH,
    templateDir = config.TEMPLATE_DIR;


require('colors');

app.init = function() {

    app.sayHello();

    if( app.checkConfigFile() ) {
        
        if( _args[0] !== undefined )  {

            // Try run a task group, otherwise, run a specific task
            if( !app.runTaskGroup( _args[0] ) ) {

                app.task( _args[0] );
            }
        } else {
            app.prompt( "list_tasks" );
        }
    } else {

        //sh.echo( '✔ Hey, I did not find any configuration file! '.red );
        app.prompt( "list_options" );
    }
};

app.runTaskGroup = function( name ) {

    // Checks if group exists
    if( typeof app.task.groups[ name ] === "object" ) {

        // Run tasks
        app.task.groups[ name ].forEach( function( task )  {
            app.task( task );
        });
        return true;

    } else {
        return false;
    }
};

app.task = function( name ) {

    // Checks if the task name exists 
    if( typeof app.task.tasks[ name ] === "function" ) {

        // Start task
        app.task.tasks[ name ]( app );
    } else {
        sh.echo( '✔ Hey, I did not find the task '.red + name.yellow + ', you registered it? \n'.red );
        app.prompt( "list_tasks" );
    }
};

app.task.getTaskNames = function() {            
    var out = [];

    for ( var key in app.task.tasks ) {
        out.push( key );
    }
    return out;
};

app.task.tasks = [];

app.task.groups = [];

app.registerTask = function( name,  task ) {

    // Checks if task is a function and if name exists
    if( typeof task === "function" && typeof name !== undefined && name.length > 2 ) {

        // Checks if task exists
        if( typeof app.task.tasks[ name ] !== "function" ) {

           // Register task 
           app.task.tasks[ name ] = task ;
        }

    }
};

app.registerTaskGroup = function( name,  tasks ) {

    // Checks if task is a object 
    if( typeof tasks === "object" && typeof name !== undefined && name.length > 2 ) {

        // Checks if group exists
        if( typeof app.task.groups[ name ] !== "object" ) {

            // Register group 
            app.task.groups[ name ] = tasks;
        }
    }
};

app.checkConfigFile = function() {

    // Vefify if config file exist
    if( _fs.existsSync( relativePath + "/rconf.js" ) ) {

        // Load confg from project
        require( relativePath + "/rconf" )

        return true; 

    } else {

        return false;
    }     
};
app.sayHello = function() {

 
    sh.echo( '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
    sh.echo( '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
    sh.echo( '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
    sh.echo( '   _____ _                   ___ _____'.yellow );
    sh.echo( '  | ___ (_)                 |_  /  ___|'.yellow );
    sh.echo( '  | |_/ /_ _ __   ___ ___     | \\ `--. '.yellow );
    sh.echo( "  |    /| |  _ \\ / __/ _ \\    | |`--. \\ ".yellow );
    sh.echo( '  | |\\ \\| | | | | (_| (_) /\\__/ /\\__/ /'.yellow );
    sh.echo( '  \\_| \\_|_|_| |_|\\___\\___/\\____/\\____/ '.yellow );
    sh.echo( '  \n');

    sh.echo( ' * Static pages generator with sass, handlebars and watch reload!'.green);
    sh.echo( " * It's pretty cool".green + " :)".blue);
    sh.echo( '\n\n');

};

app.prompt = function( action ) {

    switch( action ) {
        case "create_project":
            prompt_create_project();
            break;
        case "list_tasks":
            prompt_list_tasks()
            break;
        case "list_options":
            prompt_list_options()
            break;
    }
    function prompt_create_project() {

        var questions = [
        {
            type: "input",
            name: "project_name",
            message: "Hey, what name you want to give your project?",
            validate: function( value ) {
                
                if ( value !== undefined && value.length > 2 ) {
                   return true;
                } else {
                    return "Oh oh, something is wrong! Try again warrior!";
                }
            },
            default: false
        }];

        inquirer.prompt( questions, function( answers ) {

            _inputProjectName = answers.project_name;
            app.createScaffolding(function() {

                prompt_list_tasks();
            }); 
        });
    }
    function prompt_list_tasks() {
        
        var questions = [
        {
            type: "list",
            name: "project_task",
            message: "Oh right! What do you like to do now?",
            choices:app.task.getTaskNames(),
            default: false
        }];

        inquirer.prompt( questions, function( answers ) {
            
            if( _inputProjectName !== undefined ) { 
                sh.cd(relativePath + "/" + _inputProjectName);
            }

            sh.exec( "rinco " + answers.project_task );
        });
    }
    function prompt_list_options() {
        
        var questions = [
        {
            type: "list",
            name: "project_options",
            message: "Hello, welcome to RincoJS cli, what do you like to do?",
            choices:["Create a new project", "See the documentation"],
            default: false
        }];

        inquirer.prompt( questions, function( answers ) {

            if( answers.project_options === "Create a new project" ) {

                prompt_create_project();
            }
            if( answers.project_options === "See the documentation" ) {

                app.openBrowser( "rincojs.com/doc" );
                app.sayHello();
                prompt_list_options();
            }             
        });
    }
};

app.createScaffolding = function( callback ) {

    _fs.mkdir(_inputProjectName, "0755", function(e) {
        _fs.mkdir('./' + _inputProjectName + templateDir, "0755",  function(e) {
            app.copyFile(__dirname + templateDir + "/", "header.html", './' + _inputProjectName + templateDir );
            app.copyFile(__dirname + templateDir + "/", "content.html", './' + _inputProjectName + templateDir );
            app.copyFile(__dirname + templateDir + "/", "footer.html", './' + _inputProjectName + templateDir );            
        });


        _fs.mkdir('./' + _inputProjectName + "/pages", "0755", function(e) {
            app.copyFile(__dirname + templateDir + "/", "index.html", './' + _inputProjectName + "/pages" );
        });


        _fs.mkdir('./' + _inputProjectName + "/public", "0755", function(e) {
            _fs.mkdir('./' + _inputProjectName + "/public/css", "0755");
        });        


        _fs.mkdir('./' + _inputProjectName + "/data", "0755", function(e) {
            app.copyFile(__dirname + templateDir + "/", "user.json", './' + _inputProjectName + "/data" );
            app.copyFile(__dirname + templateDir + "/", "generic.json", './' + _inputProjectName + "/data" );            
        });

        _fs.mkdir('./' + _inputProjectName + "/dist", "0755");

        _fs.mkdir('./' + _inputProjectName + "/sass", "0755", function(e) {
            app.copyFile(__dirname + templateDir + "/", "main.scss", './' + _inputProjectName + "/sass" );
        });

        app.copyFile(__dirname + templateDir + "/", "rconf.js", './' + _inputProjectName + "/" );

        setTimeout( callback, 500 );
    });
   
};

app.copyFile = function(pathOrigin, fileName, pathTo) {
    _fs.createReadStream( pathOrigin + fileName ).pipe(_fs.createWriteStream( pathTo + "/" + fileName ));
};

app.puts = function(error, stdout, stderr) { _sys.puts(stdout) };

app.createServer = function( ignore_plugin_list ) {
    
    ignore_plugin_list = ignore_plugin_list || [];

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
        }, ignore_plugin_list );
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
    app.openBrowser(null, function() {
        sh.echo( '✔ http://localhost:3000/index.html'.green );
    });

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
    app.watch('/data');

    // Sass compilation
    app.watch('/sass', function( filename ) {

        // var name = filename.split("/");
        // name = name.reverse()[0].split(".")[0];

        var css = sass.render({
            file: relativePath + '/sass/main.scss',            
            includePaths: [ relativePath + '/sass' ],
            outputStyle: 'compressed',
            success: function( css ) {

                app.createFile(relativePath + "/public/css/styles.css", css, function() {

                    io.sockets.emit( 'refresh', { action: 'refresh' } );
                })
                //console.log(css)
            },
            error: function( e ) {
                console.log(e);
            }
        });

    });

};

app.render = function(file, callback, ignore_plugin_list) {
    console.log(file);
    var file = ( file.indexOf(".html") !== -1 ) ? file : file + "/index.html";
    var content = app.getFileContent( config.PAGES_DIR + file ),
        i = -1;

    ignore_plugin_list = ignore_plugin_list || [];

    function next(value) {

        content = value;

        i += 1;

        if( i < app.render.middlewares.length ) {

            if( ignore_plugin_list.indexOf( app.render.middlewares[i].name ) === -1 ) {

                app.render.middlewares[i](next, content);
            } else {

                next( content );
            }
            
        } else {

            callback( content );
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

    _fs.readdir( relativePath + config.PAGES_DIR, function( err, files ) {

        files.forEach(function( name ) {

            app.render( "/" + name , function( content ){

                app.createFile( relativePath + config.DIST_DIR + name, content );

            }, [ "rinco_reload" ] );
        });
    });
};

app.openBrowser = function( url, callback ) {

    var devPath = url || config.DEV_PATH + ':' + config.SERVER_PORT + '/index.html';

    open( devPath, 'google-chrome', function( code ) {

        // if code is null, the browser exists
        if ( code === null ) {

            if( typeof callback === "function" ) {

                callback();            
            }

        } else {

            // otherwise, open the default browser
            open( devPath );
        } 

    });

};

app.openSublime = function() {

    sh.exec( "subl ." );
};

module.exports = app;
