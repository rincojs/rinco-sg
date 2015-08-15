'use strict';

var server = require('./server');
var fs = require('./fs');
var m = {};

var d = '';

m.start = function () {

    server.get('https://cdnjs.com','/libraries', function (data) {
       d += data;
    });

    setTimeout(function () {
        m.update(d);
        m.parse();
    }, 5000);

};

m.update = function (data) {
    // fs.file.write('data.html', data);
}

m.parse = function () {
    var content = fs.file.read('data.html').toString();
    var r = /data-library-name=\"([^\s]+)\"/g, t;
    var results = [];

    while (t = r.exec(content)) {
        results.push({name:t[1]});
        // console.log(t[1]);
    }
    r = /itemprop=\"downloadUrl\".*>([^\s]+)<\/p>/g;

    var i = 0;
    while (t = r.exec(content)) {
       results[i].url = t[1]
        i++;
        // console.log(t[1]);
    }
    // results.map(function (data) {
    //     console.log(data.name, data.url);
    // })
};

m.parse();
