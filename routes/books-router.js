const express = require('express');
const book_schema = require('../models/Book').schema;
/**
* function that iterates through an object that contains the specified schema properties
* @param {Object} schema - object schema
* @param {Object} source - source object to iterate through
* @callback {callback} - function called with discovered property name, value and whether it is defined in the schema
@ @return {Object} -  a promise
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
  bookRouter.route(path_book_id)
    .get((req, resp) => {
      //console.log(`finding by id ${req.params.id}`);
      Book.findById(req.params.id, (err, book) => {
          return err ? resp.send(err) : resp.json(book);
        }
      )
    }).put((req, resp) => {
      Book.findById(req.params.id, (err, book) => {
          if (err) {
            resp.send(err);
          } else {
            const {body} = req;
            // switching the request body to be the source
            discoverSchemaProps(body, book_schema, (key, value_in_schema, value_in_body) => {
                  book[key] = value_in_body;
            });
            book.save();
            resp.json(book);
          }
        }
      )
    })

  return bookRouter;
}

module.exports = {router, discoverSchemaProps};
