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
var render = require('./render');
var _args = process.argv.slice(2);

var config = require('./constants');

var m = {};
m.io = require("socket.io");

m.start = function (ignore_middlewares_list) {

    ignore_middlewares_list = ignore_middlewares_list || [];
    var port = _args[1] || config.SERVER_PORT;

    var server = connect()
        .use(connect.logger('dev'))
        .use(connect.static(config.PUBLIC_DIR))
        .use(callbackServer);

    function callbackServer(req, res) {
        render.file(fs.path.join(config.PAGES_DIR, req.url), function (content) {
            // Send response to client
            res.end(content);
        }, ignore_middlewares_list);
    }

    // start server listen
    var devServer = http.createServer(server).listen(port);

    // start socket
    m.io = m.io.listen(devServer);
    m.io.sockets.on('connection', function (socket) {});
    // reduce logging
    m.io.set('log level', 0);

console.log(render);
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
