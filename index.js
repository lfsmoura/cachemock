module.exports = function(fun, callbackIndex = -1) {
    const cache = new Map();
    return function(...args) {

      // if one of the arguments is the callback, remove it
      let argsWithoutCb;
      if (callbackIndex >= 0) {
        argsWithoutCb = [...args.slice(0, callbackIndex),
               ...args.slice(callbackIndex+1, args.length)];
      } else {
        argsWithoutCb = args;
      }

      // serialize the arguments to use them as keys
      key = JSON.stringify(argsWithoutCb);

      if (cache.has(key)) {
        const value = cache.get(key);
        if (callbackIndex >= 0) {
          return args[callbackIndex].apply(this, value);
        }
        return value;
      }

      // if one of the arguments is a callback we should call it
      if (callbackIndex >= 0) {
        return fun.apply(this, argsWithoutCb.concat(function(...cbArgs){
            cache.set(key, cbArgs);
            return args[callbackIndex].apply(this, cbArgs);
        }));
      }
      const value = fun.apply(this, args);
      cache.set(key, value);
      return value;
    };
};
