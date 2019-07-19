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
  const {query} = req;
  Book.find(query, (err, books) => {
    return err ? resp.send(err) : resp.json(books);
  })
})

app.use(bookRouter);

app.get('/', (request, response) => {
  response.send('Welcome to Embakasi, Sir!');
});

app.listen(port, () => {
  console.log(`Liftoff:${port}`);
});
