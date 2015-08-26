'use strict';

var fs = require('./fs');
var config = require('./constants');
var compile = require('./compile');
var render = require('./render')
var uncss = require('uncss');
var it = require('./interpreter');
var m = {};
var sh = require('shelljs');
require('colors');

m.generateUncss = function () {
    sh.echo('Copying public files...');
    m.public()
    sh.echo('[ok]'.green);
    sh.echo('-------------------------------------------------------');
    sh.echo('Building html files...');
    m.analizer(function (css, js, html) {
        sh.echo('[ok]'.green);
        sh.echo('-------------------------------------------------------');
        sh.echo('Building js files...');
        m.js(js);
        sh.echo('[ok]'.green);
        sh.echo('-------------------------------------------------------');
        sh.echo('Building css files...');
        m.css(css);
        sh.echo('[ok]'.green);
        sh.echo('-------------------------------------------------------');
        sh.echo('Optimizing image files...');
        sh.echo('-------------------------------------------------------');
        m.img();
        setTimeout(function() {
          m.uncss(html)
      }, 1000);
    });
};

m.generate = function () {
    sh.echo('Copying public files...');
    m.public()
    sh.echo('[ok]'.green);
    sh.echo('-------------------------------------------------------');
    sh.echo('Building html files...');
    m.analizer(function (css, js, html) {
        sh.echo('[ok]'.green);
        sh.echo('-------------------------------------------------------');
        sh.echo('Building js files...');
        m.js(js)
        sh.echo('[ok]'.green);
        sh.echo('-------------------------------------------------------');
        sh.echo('Building css files...');
        m.css(css)
        sh.echo('[ok]'.green);
        sh.echo('-------------------------------------------------------');
        sh.echo('Optimizing image files...');
        sh.echo('-------------------------------------------------------');
        m.img();
    });
};

m.uncss = function (files) {
    sh.echo('(UNCSS) - Optimizing css file...'.yellow);
    files = files.map(function (file) {
       return fs.path.join(config.BUILD_DIR, file);
    });

     var options = {
         htmlroot:  '/build',
         timeout      : 1000,
         ignore       : ['#added_at_runtime', /test\-[0-9]+/],
         stylesheets  : ['assets/css/style.css'],
         report       : false
     };

     uncss(files, options, function (error, output) {
        var Clean = require('clean-css');
        output = new Clean().minify(output).styles;
        fs.file.write(fs.path.join(config.BUILD_DIR, 'assets', 'css', 'style.css'), output);
        sh.echo('[ok]'.green);
        sh.echo('-------------------------------------------------------');
     });
}

m.js = function (files) {
    compile.tojs(files, function (js) {
        var uglify = require('uglify-js');
        js = uglify.minify(js, {fromString: true}).code;
        fs.file.write(fs.path.join(config.BUILD_DIR, 'assets', 'js','script.js'), js);
   });
};

m.css = function (files) {
    compile.tocss(files, function (css) {
        sh.echo('Minifying css file...');
        var Clean = require('clean-css');
        css = new Clean().minify(css).styles;
        fs.file.write(fs.path.join(config.BUILD_DIR, 'assets', 'css','style.css'), css);
        sh.echo('[ok]'.green);
        sh.echo('-------------------------------------------------------');
   });
};
m.public = function () {
    fs.dir.read(config.PUBLIC_DIR, function (file) {
        console.log(fs.path.join(config.BUILD_DIR, 'public', file));
        console.log(file);
        fs.file.cp(fs.path.join(config.PUBLIC_DIR,file), fs.path.join(config.BUILD_DIR, 'public', file));
    });
};

m.htmlMinify = function (str) {
    return str.replace(/<!--.*-->/g, '').replace(/\s+/g, ' ').replace(/>\s+</g, '><').replace(/\n\r/, '');
};

m.analizer = function (fn) {
    var css=[], js=[], html=[];
    fs.dir.read(config.PAGES_DIR, function (filename, length, index) {
        //Ignoring files
        if(filename[0] !== '_') {
            render.file(fs.path.join(config.PAGES_DIR, filename), function (content) {
                content = parse_template(content)
                content = m.link(content);
                fs.file.write(fs.path.join(config.BUILD_DIR, filename), m.htmlMinify(content));
                html.push(filename);
            }, ["rinco_reload", 'rinco_css', 'rinco_js']);
        }
        if(length-1 === index) {
            fn.call(null, css, js, html);
        }
    });

    function parse_template(content) {

        var files = [];
        [{ start:'<r-css', end:'>'}].map(function (tag) {
            content = it.parse(content, tag, function (prc) {
                if(fs.file.exist(fs.path.join(config.CSS_DIR, prc.trim()))) {
                    css.push(prc.trim());
                } else {
                    return "File: " + fs.path.join(config.CSS_DIR, prc.trim());
                }
                return '';
            });
        });
        [{ start:'<r-js', end:'>'}].map(function (tag) {
            content = it.parse(content, tag, function (prc) {
                if(fs.file.exist(fs.path.join(config.JS_DIR, prc.trim()))) {
                    js.push(prc.trim());
                } else {
                    return "File: " + fs.path.join(config.JS_DIR, prc.trim());
                }
                return '';
            });
        });
        return content;
    }

};

m.link = function (content) {

    content = content.toString().replace(/(\<\/head\>)/, function (match, head) {
        var script = ' <link rel="stylesheet" href="/assets/css/style.css">';
        return script + "\n" + head;
    });
    content = content.toString().replace(/(\<\/body\>)/, function (match, body) {
        var script = '<script src="/assets/js/script.js" charset="utf-8"></script>';
        return script + "\n" + body;
    });
    return content;
};

m.img = function () {

  var Imagemin = require('imagemin');

  new Imagemin()
      .src(fs.path.join(config.IMG_DIR,'*.{gif,jpg,png,svg}'))
      .dest(fs.path.join(config.BUILD_DIR,'assets','img'))
      .use(Imagemin.jpegtran({progressive: true}))
      .use(Imagemin.gifsicle({interlaced: true}))
      .use(Imagemin.optipng({optimizationLevel: 3}))
      .use(Imagemin.svgo())
      .run(function (err, files) {
          files.map(function (file) {
              console.log(file);
              sh.echo('[ok]'.green);
          });
      });
};

module.exports = m;
