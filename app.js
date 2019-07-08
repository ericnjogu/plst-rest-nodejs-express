const express = require('express');
const app = express();
const bookRouter = express.Router();
const port = process.env.PORT || 3000;
const booksPath = '/books';

bookRouter.route(booksPath).get((req, resp) => {
  const obj = {msg:'from the /books route'};
  resp.json(obj);
})

app.use(bookRouter);

app.get('/', (request, response) => {
  response.send('Welcome to Embakasi, Sir!');
});

app.listen(port, () => {
  console.log(`Liftoff:${port}`);
});
