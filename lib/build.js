'use strict';

var fs = require('./fs');
var config = require('./constants');
var compile = require('./compile');
var render = require('./render')
var m = {};

m.generate = function () {
    m.analizer(function (css, js) {
        m.js(js)
        m.css(css)
    });
};


m.js = function (files) {
    compile.tojs(files, function (js) {
       fs.file.write(fs.path.join(config.BUILD_DIR, 'js','script.js'), js);
   });
};

m.css = function (files) {
    compile.tocss(files, function (css) {
       fs.file.write(fs.path.join(config.BUILD_DIR, 'css','style.css'), css);
   });
};

m.analizer = function (fn) {
    var css = [], js=[];
    fs.dir.read(config.PAGES_DIR, function (filename) {
        render.file(fs.path.join(config.PAGES_DIR, filename), function (content) {
            content = parse_template(content)
            content = m.link(content);
            fs.file.write(fs.path.join(config.BUILD_DIR, filename), content);
            fn.call(null, css, js);
        }, ["rinco_reload", 'rinco_css', 'rinco_js']);
    });

    function parse_template(content) {

        if (content.toString().match(/\@js\((.*?)\)/g)) {

            // Replace include tags to templates files contents
            content = content.toString().replace(/\@js\((.*?)\)/g, function (match, contents, offset, s) {

                if(fs.file.exist(fs.path.join(config.JS_DIR, contents))) {
                    js.push(contents);
                } else {
                    return "File: " + fs.path.join(config.JS_DIR, contents);
                }
                return '';
            });

            // Call recursive function
            content = parse_template(content);

        } else
        if (content.toString().match(/\@css\((.*?)\)/g)) {

            // Replace include tags to templates files contents
            content = content.toString().replace(/\@css\((.*?)\)/g, function (match, contents, offset, s) {

                if(fs.file.exist(fs.path.join(config.CSS_DIR, contents))) {
                    css.push(contents);
                }
                return '';
            });

            // Call recursive function
            content = parse_template(content);

        }
        return content;
    }

};

m.link = function (content) {

    content = content.toString().replace(/(\<\/head\>)/, function (match, head) {
        var script = ' <link rel="stylesheet" href="css/style.css">';
        return script + "\n" + head;
    });
    content = content.toString().replace(/(\<\/body\>)/, function (match, body) {
        var script = '<script src="js/script.js" charset="utf-8"></script>';
        return script + "\n" + body;
    });
    return content;
};
module.exports = m;
