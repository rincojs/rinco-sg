/* jslint node: true */
/*!
 * rinco
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict'

var m = {};
var connect = require('connect');
var http = require("http");
var fs = require('./fs');
var watch = require('./watch');
var _args = process.argv.slice(2);
var exts = ['.html'];
var config = require('./constants');
var m = {};

m.io = require("socket.io");

m.start = function (ignore_middlewares_list) {

    var render = require('./render');

    ignore_middlewares_list = ignore_middlewares_list || [];
    var port = _args[1] || config.SERVER_PORT;

    var server = connect()
        .use(connect.logger('dev'))
        .use(connect.static(config.PUBLIC_DIR))
        .use(callbackServer);

    function callbackServer(req, res) {
        var file = exts.indexOf(fs.path.extname(req.url)) !== -1 ? req.url : fs.path.join(req.url, 'index.html');
        render.file(fs.path.join(config.PAGES_DIR, file), function (content) {
            // Send response to client
            if(content !== 'false'){
              res.end(content);
            } else {
              res.end('<h1>404 - file not found</h1>');
            }

        }, ignore_middlewares_list);
    }

    // start server listen
    var devServer = http.createServer(server).listen(port);

    // start socket
    m.io = m.io.listen(devServer);
    m.io.sockets.on('connection', function (socket) {});
    // reduce logging
    m.io.set('log level', 0);

    // render files to public path
    render.assets();
    // start watch files
    watch.init();

    // open the page in browser
    // app.openBrowser( null, function() {
    //     sh.echo( '✔ http://localhost:' + config.SERVER_PORT + '/index.html'.green );
    // });
};

module.exports = m;
