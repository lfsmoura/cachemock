const cachemock = require('./');
const get = cachemock(require('request').get);

const begin = Number(new Date());
get('https://jsonplaceholder.typicode.com/posts/1', (err, response, body) => {
  console.log(Number(new Date()) - begin, 'elapsed');
  get('https://jsonplaceholder.typicode.com/posts/1', () => {
    console.log(Number(new Date()) - begin, 'elapsed');
  });
});
