const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (request, response) => {
  response.send('Welcome to Embakasi, Sir!');
});

app.listen(port, () => {
  console.log(`Liftoff:${port}`);
});
