const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bookRouter = express.Router();
const port = process.env.PORT || 3000;
const booksPath = '/books';
// resolved url parsing error messages by following https://stackoverflow.com/a/51935257/315385
const db = mongoose.connect('mongodb://localhost:27017/book_api', {useNewUrlParser:true});
const Book = require('./models/Book');

bookRouter.route(booksPath).get((req, resp) => {
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
const bookIdRouter = express.Router();
bookIdRouter.route(path_book_id).get((req, resp) => {
  //console.log(`finding by id ${req.params.id}`);
  Book.findById(req.params.id, (err, book) => {
      return err ? resp.send(err) : resp.json(book);
    }
  )
})

app.use(bookRouter);
app.use(bookIdRouter);

app.get('/', (request, response) => {
  response.send('Welcome to Embakasi, Sir!');
});

app.listen(port, () => {
  console.log(`Liftoff:${port}`);
});
