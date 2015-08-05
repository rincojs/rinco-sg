'use strict';

var fs = require('./fs');
var config = require('./constants');
var compile = require('./compile');
var render = require('./render')
var uncss = require('uncss');
var m = {};
var sh = require('shelljs');
require('colors');

m.generateUncss = function () {
    sh.echo('Building html files...'.yellow);
    m.analizer(function (css, js, html) {
        sh.echo('html [ok]'.green);
        sh.echo('Building js files...'.yellow);
        m.js(js);
        sh.echo('js [ok]'.green);
        sh.echo('Building css files...'.yellow);
        m.css(css);
        sh.echo('css [ok]'.green);
        sh.echo('Optimizing image files...'.yellow);
        m.img();
        setTimeout(function() {
          m.uncss(html)
      }, 1000);
    });
};

m.generate = function () {
    sh.echo('Building html files...'.yellow);
    m.analizer(function (css, js, html) {
        sh.echo('html [ok]'.green);
        sh.echo('Building js files...'.yellow);
        m.js(js)
        sh.echo('js [ok]'.green);
        sh.echo('Building css files...'.yellow);
        m.css(css)
        sh.echo('css [ok]'.green);
        sh.echo('Optimizing image files...'.yellow);
        m.img();
    });
};

m.uncss = function (files) {
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
         fs.file.write(fs.path.join(config.BUILD_DIR, 'assets', 'css', 'style.css'), output);
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
        var Clean = require('clean-css');
        // css = new Clean().minify(css).styles;
        fs.file.write(fs.path.join(config.BUILD_DIR, 'assets', 'css','style.css'), css);
   });
};

m.analizer = function (fn) {
    var css=[], js=[], html=[];
    fs.dir.read(config.PAGES_DIR, function (filename, length, index) {
        render.file(fs.path.join(config.PAGES_DIR, filename), function (content) {
            content = parse_template(content)
            content = m.link(content);
            fs.file.write(fs.path.join(config.BUILD_DIR, filename), content);
            html.push(filename);
        }, ["rinco_reload", 'rinco_css', 'rinco_js']);
        if(length-1 === index) {
            fn.call(null, css, js, html);
        }
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
              sh.echo('[ok]'.yellow);
          });
      });
};

module.exports = m;
