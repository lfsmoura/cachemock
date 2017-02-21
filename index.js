module.exports = function(fun) {
    const cache = new Map();
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
