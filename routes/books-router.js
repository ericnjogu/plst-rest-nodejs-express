const express = require('express');

/**
* function that creates a  generator that iterates through an object that contains the specified properties
* inspired by https://www.codementor.io/tiagolopesferreira/asynchronous-iterators-in-javascript-jl1yg8la1
* @param {Object} schema - object schema
* @param {Object} source - source object to iterate through
* @callback {callback} - function called with discovered property name and value
*/
function* discoverSchemaProps(schema, source) {
  const keys = Object.keys(source);
  while (keys.length) {
    key = keys.shift();
    yield new Promise((resolve, reject) => {
      schema[key] ? resolve(key, source[key]) : reject(key);
    });
  }
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
      const generator =  discoverSchemaProps(Book.schema.obj, {author: 'Mimi'});
      let looping = true;
      while (looping) {
        const {value_promise, done} = generator.next();
        looping = !done;
        value_promise ? value_promise.then((key, value) => {
          valid_query[key] = {$regex:value, $options:'i'}
        }) : () => {};
      }

      //console.log(valid_query);
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
