const bookRouter = require('./books-router');
const book_schema = require('../models/Book').schema;

test('update func is called with correct source value', done => {
  function callback(key, value) {
    expect(key).toBe('author');
    expect(value).toBe('Mimi');
    done();
  }

  bookRouter.discoverSchemaProps(book_schema, {author: 'Mimi'}, callback);
});
