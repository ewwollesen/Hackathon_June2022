const express = require('express');
const app = express();
const port = 8080;

app.post('/', (req, res) => {
  res.send('Received post', req);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})