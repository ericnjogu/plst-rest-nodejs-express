import express from 'express';

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (request, response) => {
  response.send('Welcome to Embakasi!');
});

app.listen(port, () => {
  console.log(`Liftoff:${port}`);
});
