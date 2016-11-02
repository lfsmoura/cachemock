# Cachemock

A mock that caches functions responses so you won't need to write mocks by hand 

``` js
const cachemock = require('./');
const get = cachemock(require('request').get, 1);

// this will be called
get('https://jsonplaceholder.typicode.com/posts/1', (err, response, body) => {
  // now the value was cached, the mock will just return the cached response
  get('https://jsonplaceholder.typicode.com/posts/1', (err, response, body) => {
    console.log(Number(new Date()) - begin, 'elapsed');
  });
});
```
