const express = require('express');
const book_schema = require('../models/Book').schema;
const utils = require('../utils');
/**
* function that iterates through an object that contains the specified schema properties
* @param {Object} schema - object schema
* @param {Object} source - source object to iterate through
* @callback {callback} - function called with discovered property name, source value and schema value
*/

function router(Book) {
  const booksPath = '/books';
  const bookRouter = express.Router();
  const books_controller = require('../controllers/books-controller')(Book);

  bookRouter.route(booksPath)
    .post(books_controller.post)
    .get(books_controller.get_all_matching);

  const path_book_id = '/books/:id';
  // middleware to handle common code in processing this path
  bookRouter.use(path_book_id, (req, resp, next) => {
    Book.findById(req.params.id, (err, book) => {
        if (err) {
          return resp.send(err);
        } else {
          if (book) {
            req.book = book;
            return next();
          } else {
            return resp.sendStatus(404);
          }
        }
    })
  });

  bookRouter.route(path_book_id)
    .get(books_controller.get_by_id)
    .put(books_controller.put_by_id)
    .patch(books_controller.patch_by_id)
    .delete(books_controller.delete_by_id);

  return bookRouter;
}

module.exports = {router};
