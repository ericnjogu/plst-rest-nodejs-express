const bookRouter = require('./books-router');
const Book = require('../models/Book');

test('update func is called with correct source value', done => {
  function callback(key, value) {
    expect(key).toBe('author');
    expect(value).toBe('Mimi');
    done();
  }

  bookRouter.discoverSchemaProps(Book.schema.obj, {author: 'Mimi'}, callback);
});
