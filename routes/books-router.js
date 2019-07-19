const express = require('express');

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
      let valid_query = {}
      Object.keys(Book.schema.obj)
        .filter(
          (prop) => (req.query[prop]))
        .map(
        (prop) => {
            valid_query[prop] = {$regex:req.query[prop], $options:'i'}
        }
      );
      //console.log(valid_query);
      Book.find(valid_query, (err, books) => {
        return err ? resp.send(err) : resp.json(books);
      })
  });

  const path_book_id = '/books/:id';
  bookRouter.route(path_book_id).get((req, resp) => {
    //console.log(`finding by id ${req.params.id}`);
    Book.findById(req.params.id, (err, book) => {
        return err ? resp.send(err) : resp.json(book);
      }
    )
  })

  return bookRouter;
}

module.exports = router;
