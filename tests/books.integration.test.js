require('should');

const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../app.js');
const Book = mongoose.model('Book');
const agent = request.agent(app);

process.env.ENV = 'test';

describe('book CRUD test', () => {
  it ('should post book and return with an additional _id prop', (done) => {
    const new_book = { title: "Gardening in Kenya", author: "Mugo Wa Njogu", genre: "DIY"};
    agent.post('/books/')
      .send(new_book)
      .expect(200)
      .end((err, results) => {
        results.body.read.should.not.equal(false);
        results.body.should.have.property('_id');
        done();
      })
  });

  afterEach(done => {
    Book.deleteMany({}).exec();
    done();
  });

  after(done => {
    mongoose.connection.close();
    app.server.close(done());
  })
});
