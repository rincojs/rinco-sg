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
var https = require("https");
var fs = require('./fs');
var watch = require('./watch');
var _args = process.argv.slice(2);
var exts = ['.html'];
var sh = require('shelljs');
var config = require('./constants');
var m = {};
var port;
var url = require('url');

m.io = require("socket.io");

/**
 * Start the development server
 *
 * @example
 *
 *     rinco.server.start();
 *
 * @param {string[]}  Array with middlewares's names you want to ignore
 * @api public
 */
m.start = function (ignore_middlewares_list, port) {

    var render = require('./render');

    ignore_middlewares_list = ignore_middlewares_list || [];
    port = port || _args[1] || config.SERVER_PORT;

    var server = connect()
        .use(connect.logger('dev'))
        .use(connect.static(config.RELATIVE_PATH))
        .use(connect.static(config.PUBLIC_DIR))
        .use(callbackServer);

    function callbackServer(req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var ext = fs.path.extname(url_parts.pathname).substr(1);

        // CSS/JS validation
        if(ext === 'css' || ext === 'js') {

            var compile = require('./compile');
            compile['to' + ext](query.files.split('|'), function (content) {
                res.end(content);
            })
        } else {

            var file = exts.indexOf(fs.path.extname(req.url)) !== -1 ? req.url : fs.path.join(req.url, 'index.html');
            render.file(fs.path.join(config.PAGES_DIR, file), function (content) {
                // Send response to client
                if(content !== 'false'){
                  res.end(content);
                } else {
                  res.end('<h1>404 - file ' + fs.path.join(config.PAGES_DIR, file) + ' not found</h1>');
                }

            }, ignore_middlewares_list);
        }
    }

    // start server listen
    var devServer = http.createServer(server).listen(port);

    // start socket
    m.io = m.io.listen(devServer);
    m.io.sockets.on('connection', function (socket) {});
    // reduce logging
    m.io.set('log level', 0);

    sh.echo('--------------------------------------------------- '.green);
    sh.echo(' * Server started on http://localhost:'+port);
    sh.echo('--------------------------------------------------- '.green);

    // start watch files
    watch.init(m.io);
};

/**
 * Do a request
 *
 * @example
 *
 *     rinco.server.get('https://raw.githubusercontent.com', '/rincojs/rinco-staticgen/master/templates/available.json', function (data) {
 *        console.log(data);
 *     });
 *
 * @param {string} hostname
 * @param {string} path
 * @param {cb_get} content
 * @api public
 */
m.get = function (hostname, path, fn, port) {
  var isSSL = hostname.indexOf('https') !== -1;
  var _port = isSSL ? 443 : 80;
  http = isSSL ? https : http;
  port = port ? port : _port;

  var options = {
   hostname: hostname.replace(/http[s]?:\/\//,''),
   port:port,
   path: path,
   method: 'GET',
   headers: { 'Content-Type': 'application/json' }
  };

  var req = http.get(options, function(res) {
   res.setEncoding('utf8');
   res.on('data', function (data) {
     (fn && fn.call && fn.call(null, data))
   });
  });
};

module.exports = m;
