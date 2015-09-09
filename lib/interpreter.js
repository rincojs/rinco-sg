/* jslint node: true */
/*!
 * rinco - parse JS Expression
 * Copyright(c) 2015 Allan Esquina
 * MIT Licensed
 */

'user strict'

var m = {};

m.parse = function (content, tag, fn) {

    var stw = tag.start;
    var enw = tag.end;
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
                    if(fn && fn.call) {
                        buf += fn.call(null, prc);
                    }
                    prc = '';
                } else {
                    tmp += chr;
                }
            } else {
                len = 0;
                if (tmp) {
                    prc += tmp;
                    tmp = '';
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

    return buf;
}

module.exports = m;
