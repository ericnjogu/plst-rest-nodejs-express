const bookRouter = require('./books-router');
const book_schema = require('../models/Book').schema;

test('update func is called with correct source value', () => {
  const generator =  bookRouter.discoverSchemaProps(book_schema, {author: 'Mimi'});
  let looping = true;
  while (looping) {
    const {value_promise, done} = generator.next();
    looping = !done;
    value_promise ? value_promise.then((key, value) => {
      expect(key).toBe('author');
      expect(value).toBe('Mimi');
    }) : () => {};
  }
});

test('update func should not be called for non existent props', done => {
  const generator =  bookRouter.discoverSchemaProps(book_schema, {foofoo: 'Bibi'});
  let looping = true;
  while (looping) {
    const {value_promise, done} = generator.next();
    looping = !done;
    if (value_promise) {
      value_promise.then(
        (key, value) => {
          fail(`Should not be discovered: ${key}:${value}`);
        },
        (key) => {expect(key).toBe('foofoo');}
      );
    }
  }
});
