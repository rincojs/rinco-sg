// Filters for dox json
var get = {};

get.allWithTag = function (type, data) {
    return data.reduce(function(all, item, index) {
        var tmp;
        if( item.tags.length > 0 ) {
            tmp = item.tags.reduce(function(a, b, c) {
                if(b.type === type) {
                  a.push(b);
                }
                return a;
            },[]);
            if(tmp.length >0) {
               all.push(item);
            }
          }
          return all;
    },[]);
}
get.tags = function (type, data) {
   return data.tags.reduce(function(all, item, index) {
        if(item.type === type) {
          all.push(item);
        }
        return all;
    },[]);
}

get.all = function (type, data) {
   return data.reduce(function(all, item, index) {
        if(item.hasOwnProperty('ctx') && item.ctx.type === type) {
          all.push(item);
        }
        return all;
    },[]);
}

// var items = get.all('method', data);
// var tags = get.tags('return', items[4])
//
// console.log(items[4]);
// console.log(tags);
