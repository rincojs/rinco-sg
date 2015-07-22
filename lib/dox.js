// Filters for dox json
var get = {};
var m = {};

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

m.process = function (json) {

    var output = {};
    output.content = json.map(function (obj) {
      try {
        var buf ={};
        buf.name = get.tags('name', obj);
        buf.params = get.tags('param', obj);

        var joinParams = buf.params.map(function (obj) {
            if(obj) {
              return obj.name + ':' + obj.types.join('|');
            }
        }).join(' , ');

        buf.str = ((obj.ctx && obj.ctx.receiver + '.' || '') + (obj.ctx && obj.ctx.name) + ' ( ' +  joinParams + ' )');

        buf.example = get.tags('example', obj);
        buf.returns = get.tags('return', obj);


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

    return output;

};

module.exports = m;
