const utils = require('../utils');
const book_schema = require('../models/Book').schema;

function books_controller(Book) {
  const post = (req, resp) => {
    const new_book = new Book(req.body);
    console.log(`posted book ${new_book}`);
    new_book.save();
    return resp.status(201).send(new_book);
  };

  const get_all_matching = (req, resp) => {
    let valid_query = {};

    utils.discoverSchemaProps(book_schema, req.query, (key, value, defined_in_schema) => {
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
  };

  const get_by_id = (req, resp) => resp.json(req.book);

  const put_by_id = (req, resp) => {
    const {body} = req;
    const {book} = req;
    // switching the request body to be the source
    utils.discoverSchemaProps(body, book_schema, (key, value_in_schema, value_in_body) => {
          book[key] = value_in_body;
    });
    book.save();
    resp.json(book);
  };

  const patch_by_id = (req, resp) => {
    const {body} = req;
    const {book} = req;
    utils.discoverSchemaProps(book_schema, body, (key, value_in_body, value_in_schema) => {
          if (key !== '_id') {book[key] = value_in_body;}
    });
    book.save();
    resp.json(book);
  };

  const delete_by_id = (req, resp) => {
    req.book.remove(err => {
      return err ? resp.status(500).send(err) : resp.sendStatus(204);
    })
  };

  return {post, get_all_matching, get_by_id, put_by_id, patch_by_id, delete_by_id};
}

module.exports = books_controller;
