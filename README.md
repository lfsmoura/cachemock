# Cachemock

A mock function that caches function responses so you won't need to write mocks by hand.
`cachemock` will record the result of asynchronous calls the first time they're
done, so the second time you call a funcion with the same parameters, instead of
calling it again, the cache will be used.

``` js
const cachemock = require('cachemock');
const get = cachemock(require('request').get);

// this will be called
get('https://jsonplaceholder.typicode.com/posts/1', (err, response, body) => {
  // now the value was cached, the mock will just return the cached response
  get('https://jsonplaceholder.typicode.com/posts/1', (err, response, body) => {});
});
```

## Example

```
npm install --save-dev cachemock
```

Imagine that you implement some function that uses the library `request` to
call some REST API.

``` js
  //
  function getPosts(get, cb) {
    return get('https://jsonplaceholder.typicode.com/posts/1', cb);
  }
```

If you want to test your function, you would normally need to write a mock response by hand. If you have lots of functions that do HTTP requests, this becomes tiresome quickly.

You can use `cachemock` to cache the responses:

``` js
const { cachemockfile } = require('cachemock');

const getCached = cachemockfile(require('request').get);

it('Should get a list of posts', (done) => {
  getPosts(getCached, done);
});
```

The first time you run your tests all calls will effectively be made. A file will be created in your root directory with the name `.get.json`. The second time your run your tests this file wiil be read and the calls are going to be mocked.

Note that we have used dependency injection in our example function. If your function does not use dependency injection, you could use a library that patches dependencies such as `mockery`.

If you use `cachmockfile`, you can specify the folder you want to save your cache. The folder has to exist.

``` js
const { cachemockfile } = require('cachemock');
const getCached = cachemockfile(require('request').get, { folder: 'test' });
```
