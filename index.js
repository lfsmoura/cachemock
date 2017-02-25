const fs = require('fs');
const path = require('path');

const md5 = require('md5');

function FileCache(fun, { folder }) {
  const hash = md5(fun.toString());
  this.filename = path.join(folder, `.${hash}.json`);
  if (fs.existsSync(this.filename)) {
    const data = fs.readFileSync(this.filename, 'utf8');
    this.cache = new Map(JSON.parse(data));
  } else {
    this.cache = new Map();
  }
}

FileCache.prototype.has = function(key) {
  return this.cache.has(key);
}

FileCache.prototype.get = function(key) {
  return this.cache.get(key);
}

FileCache.prototype.set = function(key, value) {
  this.cache.set(key, value);
  fs.writeFileSync(this.filename, JSON.stringify([...this.cache]));
  return this.cache;
}

function MemoryCache(id) {
  this.cache = new Map();
}

MemoryCache.prototype.has = function(key) {
  return this.cache.has(key);
}

MemoryCache.prototype.get = function(key) {
  return this.cache.get(key);
}

MemoryCache.prototype.set = function(key, value) {
  return this.cache.set(key, value);
}

const cachemock = function(fun, { cacheType = MemoryCache, folder = '.' } = {}) {
    const cache = new cacheType(fun, { folder });
    return function(...args) {

      // the last argument is the callback
      const argsWithoutCb = args.slice(0, args.length - 1);
      const callback = args[args.length-1];

      // serialize the arguments to use them as keys
      key = JSON.stringify(argsWithoutCb);

      if (cache.has(key)) {
        const value = cache.get(key);
        return callback.apply(this, value);
      }

      // if one of the arguments is a callback we should call it
      return fun.apply(this, argsWithoutCb.concat(function(...cbArgs){
          cache.set(key, cbArgs);
          return callback.apply(this, cbArgs);
      }));
    };
};

cachemock.cachemockfile = function (fn, opt) {
   return cachemock(fn, Object.assign({ cacheType: FileCache }, opt));
}

module.exports = cachemock;
