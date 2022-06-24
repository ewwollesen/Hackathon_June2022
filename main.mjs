//init
// moved to ESM const dotenv = require('dotenv');
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

const testuid = uuidv4().replaceAll('-', '').substring(0, 26);
console.log(testuid);

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
  fetchWorkspace().then((res) => createBoard(res));
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//TODO : Class/Mod later
import fetch from 'node-fetch';
function fetchWorkspace() {
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + process.env.personalAccessToken,
      'X-Requested-With': 'XMLHttpRequest'
    }
  };

  return fetch(
    process.env.MMURL + 'plugins/focalboard/api/v1/workspaces',
    options
  )
    .then((res) => res.json())
    .then((res) => {
      const workspaceObj = res.find(
        (workspace) => workspace.title === process.env.channelTitle
      );
      console.log(workspaceObj);
      if (workspaceObj) {
        return workspaceObj;
      } else {
        //TODO: channel not found
        return null;
      }
    });
}

function createBoard(workspace) {
  const board = [
    {
      id: '7zs1f33uoych1c6ucd5t77q4f3x',
      schema: 1,
      workspaceId: '',
      parentId: '',
      rootId: '7zs1f33uoych1c6ucd5t77q4f3x',
      createdBy: '',
      modifiedBy: '',
      type: 'board',
      fields: {
        showDescription: false,
        description: '',
        icon: '',
        isTemplate: false,
        templateVer: 0,
        columnCalculations: [],
        cardProperties: [
          {
            id: 'azr3oh9ko8hc5yfsmapchkpmp4x',
            name: 'Status',
            type: 'select',
            options: []
          }
        ]
      },
      title: 'Open Playbooks Dashboard',
      createAt: 1655409199321,
      updateAt: 1655409199321,
      deleteAt: 0,
      limited: false
    },
    {
      id: '735bmk4s7sy31tieei6pgzuxw8x',
      schema: 1,
      workspaceId: '',
      parentId: '7zs1f33uoych1c6ucd5t77q4f3x',
      rootId: '7zs1f33uoych1c6ucd5t77q4f3x',
      createdBy: '',
      modifiedBy: '',
      type: 'view',
      fields: {
        viewType: 'board',
        sortOptions: [],
        visiblePropertyIds: [],
        visibleOptionIds: [],
        hiddenOptionIds: [],
        collapsedOptionIds: [],
        filter: {
          operation: 'and',
          filters: []
        },
        cardOrder: [],
        columnWidths: {},
        columnCalculations: {},
        kanbanCalculations: {},
        defaultTemplateId: ''
      },
      title: 'Board view',
      createAt: 1655409199321,
      updateAt: 1655409199321,
      deleteAt: 0,
      limited: false
    }
  ];

  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.personalAccessToken,
      'X-Requested-With': 'XMLHttpRequest'
    }
  };

  return fetch(
    process.env.MMURL +
      'plugins/focalboard/api/v1/workspaces/' +
      workspace.id +
      '/blocks',
    options
  )
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    });
}
