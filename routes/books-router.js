const express = require('express');
const book_schema = require('../models/Book').schema;
/**
* function that iterates through an object that contains the specified schema properties
* @param {Object} schema - object schema
* @param {Object} source - source object to iterate through
* @callback {callback} - function called with discovered property name, source value and schema value
*/
function discoverSchemaProps(schema, source, callback) {
  Object.keys(source).map(key => {
        callback(key, source[key], schema[key]);
    }
  );
}

function router(Book) {
  const booksPath = '/books';
  const bookRouter = express.Router();
  bookRouter.route(booksPath)
    .post((req, resp) => {
      const new_book = new Book(req.body);
      console.log(`posted book ${new_book}`);
      new_book.save();
      return resp.status(201).send(new_book);
    })
    .get((req, resp) => {
      let valid_query = {};

      discoverSchemaProps(book_schema, req.query, (key, value, defined_in_schema) => {
          defined_in_schema
          ?
            valid_query[key] = {$regex:value, $options:'i'}
          :
            console.error (`property '${key}' is not present in the book schema`);
      });

      // console.log(valid_query);
      Book.find(valid_query, (err, books) => {
        return err ? resp.send(err) : resp.json(books);
      });
  });

  const path_book_id = '/books/:id';
  // middleware to handle common code in processing this path
  bookRouter.use(path_book_id, (req, resp, next) => {
    Book.findById(req.params.id, (err, book) => {
        if (err) {
          return resp.send(err);
        } else {
          req.book = book;
          return next();
        }
    })
  });

  bookRouter.route(path_book_id)
    .get((req, resp) => resp.json(req.book))
    .put((req, resp) => {
      const {body} = req;
      const {book} = req;
      // switching the request body to be the source
      discoverSchemaProps(body, book_schema, (key, value_in_schema, value_in_body) => {
            book[key] = value_in_body;
      });
      book.save();
      resp.json(book);
    })
    .patch((req, resp) => {
      const {body} = req;
      const {book} = req;
      discoverSchemaProps(book_schema, body, (key, value_in_body, value_in_schema) => {
            if (key !== '_id') {book[key] = value_in_body;}
      });
      book.save();
      resp.json(book);
    })

  return bookRouter;
}

module.exports = {router, discoverSchemaProps};
