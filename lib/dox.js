// Filters for dox json
var get = {};
var m = {};

var Markdown = require('markdown').markdown;

get.tags = function (type, data) {
   if(data.length && data.length === 0) return false;
   return data.tags.filter(function(tag) {
        return tag.type === type;
   });
};

get.all = function (type, data) {
  if(data.length && data.length === 0) return false;
   return data.filter(function(tag) {
        return (item.hasOwnProperty('ctx') && item.ctx.type === type)
    })
};

get.className = function (obj) {

  var buf = {};
  buf.name = obj;
  switch (obj.toLowerCase().trim()) {
    case 'string':
        buf.css = 'primary';
      break;
    case 'object':
        buf.css = 'default';
      break;
    case 'function':
        buf.css = 'success';
      break;
    case 'array':
        buf.css = 'warning';
      break;
    case 'boolean':
        buf.css = 'info';
      break;
    default:
      buf.css = 'default';
      break;
  }
  return buf;
};

get.typeClass = function (arr) {
  arr = arr.map(function (item) {
    item.types = item.types.map(function (obj) {
      return get.className(obj);
    });

    return item;
  });
  return arr;
};

function renderMarkdown(items) {
  // body...
  for (var item in items) {

    if (items.hasOwnProperty(item)) {
      if(typeof items[item] === 'object') {
        items[item] = renderMarkdown(items[item]);
      }

      if(item.toLowerCase() === 'description' || item.toLowerCase() === 'string' || item.toLowerCase() === 'full' ) {
        try {
          // items[item] = Markdown.toHTML(items[item]);
        } catch (e) {
        }
      }

    }
  }
  return items;
}

m.process = function (json) {

    var output = {};
    output.content = json.map(function (obj) {
      try {
        var buf ={}, params, returns;

        params = get.tags('param', obj);

        buf.name = get.tags('name', obj);

        buf.params = get.typeClass(params);
        var joinParams = buf.params.map(function (obj) {
            if(obj) {
              return obj.name + ':' + obj.types.map(function (o) {
                  return o.name;
              }).join('|');
            }
        }).join(' , ');

        buf.str = obj.ctx && obj.ctx.name ? ((obj.ctx && obj.ctx.receiver + '.' || '') +  obj.ctx.name  + ' (' +  joinParams + ')') : '';

        buf.example = get.tags('example', obj);
        returns = get.tags('return', obj);
        buf.returns = get.typeClass(returns);

        buf.all = obj;
        return buf;

      } catch(err) {
        // return err;
      }
    });

    output.methods = json.filter(function (obj) {
        return obj.ctx && obj.ctx.type === 'method';
    }).map(function (obj) {
      return obj.ctx;
    });

    output.properties = json.filter(function (obj) {
        return obj.ctx && obj.ctx.type === 'property';
    }).map(function (obj) {
      try {
        obj.type = get.className(get.tags('type', obj)[0].string);
      } catch (e) {

      }
      return obj;
    });

    // return output;
    return renderMarkdown(output);
a
};

module.exports = m;
