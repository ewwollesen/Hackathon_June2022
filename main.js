const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.post('/', (req, res) => {
    var body = req.body;
    console.log('Received post', body);
    res.sendStatus(200);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})