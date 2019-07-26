const utils = require('../utils');
const book_schema = require('../models/Book').schema;

test('update func is called with correct source value', done => {
  function callback(key, value, defined_in_schema) {
      expect(key).toBe('author');
      expect(value).toBe('Mimi');
      expect(defined_in_schema).not.toBe(undefined);
      done();
  }

  utils.discoverSchemaProps(book_schema, {author: 'Mimi'}, callback);
});

test('update func should not be called for non existent props', done => {
  function callback(key, value, defined_in_schema) {
      expect(key).toBe('foofoo');
      expect(value).toBe('Bibi');
      expect(defined_in_schema).toBe(undefined);
      done();
  }

  utils.discoverSchemaProps(book_schema, {foofoo: 'Bibi'}, callback);
});
