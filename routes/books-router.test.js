const bookRouter = require('./books-router');
const book_schema = require('../models/Book').schema;

test('update func is called with correct source value', () => {
  function callback(promise) {
    promise.then((key, value) => {
      expect(key).toBe('author');
      expect(value).toBe('Mimi');
    });
  }

  bookRouter.discoverSchemaProps(book_schema, {author: 'Mimi'}, callback);
});

test('update func should not be called for non existent props', () => {
  function callback(promise) {
    promise.then((key, value) => {
      fail(`Should not be discovered: ${key}:${value}`);
    }).catch(
      (key) => {expect(key).toBe('foofoo');}
    );
  }

  bookRouter.discoverSchemaProps(book_schema, {foofoo: 'Bibi'}, callback);
});
