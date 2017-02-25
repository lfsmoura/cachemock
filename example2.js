const { cachemockfile } = require('./');

const { get } = require('request');
const getCached = cachemockfile(get, { folder: 'test2' });

function getPosts(get, cb) {
  return get('https://jsonplaceholder.typicode.com/posts/1', cb);
}

function it(desc, cb) {
  cb(() => {});
}

it('Should get a list of posts', (done) => {
  const begin = Number(new Date());
  getPosts(getCached, () => {
    console.log(Number(new Date()) - begin, 'elapsed');
    return done();
  });
});
