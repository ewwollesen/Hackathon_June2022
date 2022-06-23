const express = require('express');
const app = express();
const port = 8080;

app.post('/', (req, res) => {
    console.log('Received post', req)
    res.send(200);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})