/* jslint node: true */
/*!
 * rinco - reload
 * Copyright(c) 2014 Allan Esquina
 * MIT Licensed
 */

'use strict';

var rinco = require('../rinco');

var config = require('../constants');

// Parse templates files
rinco.render.middleware.register(function rinco_reload(next, content) {

    //Replace head tag to reload.js content + head
    var responseString = content.toString().replace(/(\<\/head\>)/, function (match, head) {

        var script = rinco.fs.file.read(rinco.fs.path.join(config.RINCO_TEMPLATE_PATH, 'reload.js'));

        if (script) {
            return script + "\n" + head;
        } else {
            return "File: " + rinco.fs.path.join(config.RINCO_TEMPLATE_PATH, 'reload.js');
        }
    });

    next(responseString);
});
