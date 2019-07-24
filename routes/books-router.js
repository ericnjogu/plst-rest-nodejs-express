const express = require('express');
const book_schema = require('../models/Book').schema;
/**
* function that iterates through an object that contains the specified schema properties
* inspired by https://www.freecodecamp.org/news/how-to-make-a-promise-out-of-a-callback-function-in-javascript-d8ec35d1f981/
* @param {Object} schema - object schema
* @param {Object} source - source object to iterate through
* @callback {callback} - function called with discovered property name and value
@ @return {Object} -  a promise
*/
function discoverSchemaProps(schema, source, callback) {
  Object.keys(source).map(key => (
      callback(new Promise((resolve, reject) => {
        schema[key] ? resolve(key, source[key]) : reject(key);
      }))
    )
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
      const {query} = req;
      discoverSchemaProps(book_schema, query, (promise) => {
        promise.then((key, value) => {
          console.log(`updating valid_query with ${key}:${value}`);
          valid_query[key] = {$regex:value, $options:'i'}
        }).catch((key) => {
          console.error (`property '${key}' is not present in the book schema`);
        });
      });

      console.log(valid_query);
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
    })

  return bookRouter;
}

module.exports = {router, discoverSchemaProps};
