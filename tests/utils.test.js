const utils = require('../utils');
const book_schema = require('../models/Book').schema;
const assert = require('assert');

describe("testing discoverSchemaProps", () => {
  it('update func is called with correct source value', done => {
    function callback(key, value, defined_in_schema) {
        assert(key, 'author');
        assert(value, 'Mimi');
        assert.notEqual(defined_in_schema, undefined);
        done();
    }

    utils.discoverSchemaProps(book_schema, {author: 'Mimi'}, callback);
  });

  it('update func should not be called for non existent props', done => {
    function callback(key, value, defined_in_schema) {
        assert(key, 'foofoo');
        assert(value, 'Bibi');
        assert.equal(defined_in_schema, undefined);
        done();
    }

    utils.discoverSchemaProps(book_schema, {foofoo: 'Bibi'}, callback);
  });
});
