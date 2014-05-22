/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */
    
"use strict";


var app = {
    compile:{}
};

var _args = process.argv.slice(2),
    config = require('./constants'),
    _readline = require('readline'),
    fs = require("fs"),
    _sys = require('sys'),
    _exec = require('child_process').exec,
    connect = require('connect'),
    http = require("http"),
    io = require("socket.io"),
    watch = require('node-watch'),
    sass = require('node-sass'),
    stylus = require('stylus'),
    less = require('less'),
    sh = require('shelljs'),
    open = require('open'),
    path = require('path'),
    inquirer = require('inquirer'),
    coffeescript = require("coffee-script"),
    // sync = require("sync"),
    _inputProjectName,
    relativePath = config.RELATIVE_PATH,
    templateDir = config.RINCO_TEMPLATE_PATH;


require('colors');

app.init = function() {

    // app.sayHello();

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
    if( fs.existsSync( relativePath + "/rconf.js" ) ) {

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
            console.log( _inputProjectName )
            
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

    var path_project = path.join('./', _inputProjectName ),
        rinco_path_assets = path.join( path_project, 'assets' ),
        rinco_path_data = path.join( rinco_path_assets, 'data' ),
        rinco_path_pages = path.join( rinco_path_assets, 'pages' ),
        rinco_path_includes = path.join( rinco_path_assets, 'includes' ),
        rinco_path_css = path.join( rinco_path_assets, 'css' ),
        rinco_path_js = path.join( rinco_path_assets, 'js' ),
        rinco_path_public = path.join( path_project, 'public' ),
        rinco_path_public_css = path.join( rinco_path_public, 'css' ),
        rinco_path_public_js = path.join( rinco_path_public, 'js' ),
        rinco_path_templates = path.join( templateDir ),
        rinco_path_build = path.join( path_project, 'build' );


    fs.mkdir(_inputProjectName, '0755', function(e) {

        fs.mkdir( rinco_path_assets, '0755', function(e) {

            fs.mkdir( rinco_path_data, '0755', function(e) {
                app.copyFile( path.join( rinco_path_templates, 'user.json' ), rinco_path_data );
                app.copyFile( path.join( rinco_path_templates, 'generic.json' ), rinco_path_data );            
            });

            fs.mkdir( rinco_path_pages, '0755', function(e) {
                app.copyFile( path.join( rinco_path_templates, 'index.html' ),  rinco_path_pages );
            });

            fs.mkdir( rinco_path_includes, '0755',  function(e) {
                app.copyFile( path.join( rinco_path_templates, 'header.html' ), rinco_path_includes );
                app.copyFile( path.join( rinco_path_templates, 'content.html' ), rinco_path_includes );
                app.copyFile( path.join( rinco_path_templates, 'footer.html' ), rinco_path_includes );
            });

            fs.mkdir( rinco_path_js, '0755', function(e) { });
            fs.mkdir( rinco_path_css, '0755', function(e) {
                app.copyFile( path.join( rinco_path_templates, 'styles.scss' ), rinco_path_css );
            });

        });

        fs.mkdir( rinco_path_public , '0755', function(e) {
            fs.mkdir( rinco_path_public_css, '0755' );
            fs.mkdir( rinco_path_public_js, '0755' );
        });        

        fs.mkdir( rinco_path_build, '0755' );

        app.copyFile( path.join( rinco_path_templates, 'rconf.js' ),  path_project );

        setTimeout( callback, 500 );

    });

   
};

app.copyFile = function(fileName, pathTo) {

    sh.cp( fileName, pathTo );
};

app.puts = function(error, stdout, stderr) { _sys.puts(stdout) };

app.createServer = function( ignore_plugin_list ) {
    
    ignore_plugin_list = ignore_plugin_list || [];

    var server = connect().use( connect.logger('dev') )
        .use( connect.static( config.PUBLIC_DIR ) )
        .use( callbackServer );

    function callbackServer( req, res ){      
        
        app.render( req.url , function( content ) {
            // Send response to client
            res.end( content );
        }, ignore_plugin_list );
    }

    // start server listen
    var myServer = http.createServer( server ).listen( config.SERVER_PORT );

    // start socket
    io = io.listen(myServer);
    io.sockets.on('connection', function (socket) {});
    // reduce logging
   io.set('log level', 0);

    // start watch files
    app.startWatch();

    // open the page in browser
    app.openBrowser(null, function() {
        sh.echo( '✔ http://localhost:3000/index.html'.green );
    });

};

// Alias of watch
app.watch = function( path, fn, options ) {

    options = options || { recursive: true, followSymLinks: true };

    watch(relativePath + path, options, callWatch );

    function callWatch( filename ) {
        if ( typeof fn === 'function' ) {
            fn( filename );
        } else {
            io.sockets.emit('refresh', { action: 'refresh' });
        }
    }

};

app.startWatch = function () {

    app.watch('/');

    // CSS pre-compilation
    app.watch('/css', function( filename ) {

        switch( path.extname( filename ) ) {
            case '.scss':
                app.compile.sass( filename );
                break;
            case '.styl':
                app.compile.stylus( filename );
                break;
            case '.js':
                app.compile.less( filename );
                break;
        }

    });

    // JS pre-compilation
    app.watch('/js', function( filename ) {
        // Coffee Script 
        if( path.extname( filename ) === '.coffee' ) {
            app.compile.coffeescript( filename );
        }
    });

};

app.compile.stylus = function( filename ) {
    var str = app.getFileContent( "", filename ).toString(),
        name = path.basename( filename );

    stylus.render( str, { filename: filename }, function( err, css ){
        if (err) throw err;
         app.createFile(relativePath + "/public/css/" + name.split(".")[0] + ".css", css, function() {

            io.sockets.emit( 'refresh', { action: 'refresh' } );
        });
        
    });
}

app.compile.less = function( filename ) {
    var str = app.getFileContent( "", filename ).toString(),
        name = path.basename( filename );

    less.render( str, function( err, css ){
        if (err) throw err;
         app.createFile(relativePath + "/public/css/" + name.split(".")[0] + ".css", css, function() {

            io.sockets.emit( 'refresh', { action: 'refresh' } );
        })
        
    });
}

app.compile.coffeescript = function( filename ) {
    var str = app.getFileContent( "", filename ).toString(),
        name = path.basename( filename );

    // sync(function() {

        var js = coffeescript.compile( str );

        app.createFile(relativePath + "/public/js/" + name.split(".")[0] + ".js", js, function() {

            io.sockets.emit( 'refresh', { action: 'refresh' } );
        })
    // });
}

app.compile.sass = function( filename ) {
    
    // Get file name
    var name = path.basename( filename );

    // Ignore import files from sass
    if( name[0] !== "_") {
        var css = sass.render({
            file: filename,            
            includePaths: [ relativePath + '/css' ],
            outputStyle: 'compressed',
            success: function( css ) {

                app.createFile(relativePath + "/public/css/" + name.split(".")[0] + ".css", css, function() {

                    io.sockets.emit( 'refresh', { action: 'refresh' } );
                })
                //console.log(css)
            },
            error: function( e ) {
                console.log(e);
            }
        });
    }
}

app.render = function(file, callback, ignore_plugin_list) {
    // var file = ( file.indexOf(".html") !== -1 ) ? file : file + "/index.html";
    var content = app.getFileContent( null, path.join( config.PAGES_DIR, file )),
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

    if(fs.existsSync(filePath)) {
        return fs.readFileSync( filePath );
    } else {
        return false;
    }     
};

app.createFile = function( name, content, callback ) {
    fs.writeFile(name, content, function(err) {
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

    fs.readdir( config.PAGES_DIR, function( err, files ) {

        files.forEach(function( name ) {

            app.render( "/" + name , function( content ){

                app.createFile( path.join( config.BUILD_DIR, name ), content );

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
