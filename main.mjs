//init
// moved to ESM const dotenv = require('dotenv');
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: './config/config.env' });

//express init
// moved to ESM const express = require('express');
import express from 'express';
const app = express();
const port = process.env.port | 8080;

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.post('/', (req, res) => {
  var body = req.body;
  console.log('Received post', body);
  fetchBoards();
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//TODO : Class/Mod later
import fetch from 'node-fetch';
function fetchBoards() {
    const options = {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + process.env.personalAccessToken,
            'X-Requested-With': 'XMLHttpRequest'
        }
    };

    console.log('========================================');
    console.log(options);
    console.log('========================================');

    fetch(process.env.MMURL + 'plugins/focalboard/api/v1/workspaces', options)
        .then(res => { 
            console.log('res is', res);
            console.log(typeof(res));
            console.log(res.body);
            return res.find(workspace => workspace.title === process.env.channelTitle)  
        })
        .then(workspace => console.log(workspace));
}
