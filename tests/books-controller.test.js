const should = require('should');
const sinon = require('sinon');
const books_controller = require('../controllers/books-controller');

describe("books-controller tests", () => {
  describe('HTTP POST to /books/', () => {
    it ('should not allow a missing title', () => {
      const book = function (book) {this.save = () => {}};
      const req = {
        body: {
          author: 'Ahadi'
        }
      };
      const res = {
        status:sinon.spy(),
        send:sinon.spy(),
        json:sinon.spy()
      };

      const controller = books_controller(book);
      controller.post(req, res);
      res.status.calledWith(400).should.equal(true, `Bad status: ${res.status.args}`);
      res.send.calledWith('The title is missing').should.equal(true);
    });
  });
});
