'use strict';

var server = require('./server');
var fs = require('./fs');
var config = require('./constants');
var m = {};

var d = '';

m.start = function () {
    console.log('Updating...');
    server.get('https://cdnjs.com','/libraries', function (data) {
       d += data;
    });

    setTimeout(function () {
        m.parse(d);
        console.log('[Ok]');
    }, 5000);

};

m.parse = function (content) {
    var r = /data-library-name=\"([^\s]+)\"/g, t;
    var results = [];

    while (t = r.exec(content)) {
        results.push({name:t[1]});
    }
    r = /itemprop=\"downloadUrl\".*>([^\s]+)<\/p>/g;

    var i = 0;
    while (t = r.exec(content)) {
       results[i].url = t[1]
        i++;
    }
    fs.file.write(fs.path.join(__dirname, '../', 'cdnjs', 'list.json'), JSON.stringify(results));
};

m.list = function (query) {
    var list = JSON.parse(fs.file.read(fs.path.join(__dirname, '../', 'cdnjs', 'list.json').toString()));
    if(query.length > 2){
        list = list.filter(function (item) {
           return item.name.indexOf(query) !== -1;
       });
    }
    return list;
};

m.link = function (files, libs) {

    var list = m.list('');
   files.forEach(function (file) {
       var content = fs.file.read(fs.path.join(config.PAGES_DIR,file)).toString();
       libs.forEach(function (lib) {
           var lib = m.get(lib, list).url;
            if(fs.path.extname(lib) === '.css') {
                content = content.toString().replace(/(\<\/head\>)/, function (match, head) {
                    var script = ' <link rel="stylesheet" href="'+lib+'">';
                    return script + "\n" + head;
                });
            } else if(fs.path.extname(lib) === '.js') {
                content = content.toString().replace(/(\<\/body\>)/, function (match, body) {
                    var script = '<script src="'+lib+'" charset="utf-8"></script>';
                    return script + "\n" + body;
                });
            }
       });
       fs.file.write(fs.path.join(config.PAGES_DIR,file), content);
   });

};

m.get = function (name, list) {
   list = list.filter(function (item) {
      return name === item.name;
  });
  return list[0];
};
// m.parse();
module.exports = m;
