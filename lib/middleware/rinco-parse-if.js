/* jslint node: true */
/*!
 * rinco - parse IF
 * Copyright(c) 2015 Allan Esquina
 * MIT Licensed
 */
'use strict';

var rinco = require('../rinco');
var config = require('../constants');

// Parse templates files
rinco.render.middleware.register(function rinco_if(next, content) {
    var files = [],
        reg = /(?:[^\@]|^)\@\<\<\s(.*)\s*\>\>\@/g,
        res;
	
    parse_template(content);

    function parse_template(content) {

        var stw = '@<<';
        var enw = '>>@';
        var len = 0;
        var ins = false;
        var buf = '';
        var tmp = '';
        var prc = '';

        for (var i = 0; i < content.length; i++) {
            var chr = content.charAt(i);
            if (ins) {
                if (chr == enw.charAt(len)) {
                    if (++len == enw.length) {
                        ins = false;
                        len = 0;
                        tmp = '';
                        console.log(prc);
                        buf += Function.call(null, '_system', prc)(config.INFO) || '';
                        prc = '';
                    } else {
                        tmp += chr;
                    }
                } else {
                    len = 0;
                    if (tmp) {
                        prc += tmp;
                    }
                    prc += chr;
                }
            } else {
                if (chr == stw.charAt(len)) {
                    if (++len == stw.length) {
                        ins = true;
                        tmp = '';
                        len = 0;
                    } else {
                        tmp += chr;
                    }
                } else {
                    len = 0;
                    if (tmp) {
                        buf += tmp;
                        tmp = '';
                    }
                    buf += chr;
                }
            }
        }
		
        next(content = buf);
    }
});