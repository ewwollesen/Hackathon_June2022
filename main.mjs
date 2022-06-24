//init
// moved to ESM const dotenv = require('dotenv');
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { eachDayOfInterval } from 'date-fns';

// const testuid = uuidv4().replaceAll('-', '').substring(0, 26);
// console.log(testuid);

//*****************************************************************************************************/
//TODO : Classes file
class Board {
  constructor(boardTitle) {
    this.ids = {
      "boardId" : returnNewUUID(),
      "viewBlockId" : returnNewUUID(),
      "viewCardLT7DaysId" : returnNewUUID(),
      "viewCardLT14DaysId" : returnNewUUID(),
      "viewCardGT14DaysId" : returnNewUUID(),
      "selectCardPropertyId" : returnNewUUID(),
      "selectCardOverdueId" : returnNewUUID(),
      "selectCardCurrentId" : returnNewUUID(),
      "channelURLId" : returnNewUUID(),
      "ownerPlaybookId" : returnNewUUID()
    }

    this.id = this.ids.boardId;
    this.schema = 1;
    this.workspaceId="";
    this.parentId="";
    this.rootId = this.ids.boardId; 
    this.createdBy="";
    this.modifiedBy="";
    this.type="board";
    this.fields = {
      "showDescription":false,
        "description":"",
        "icon":"",
        "isTemplate":false,
        "templateVer":0,
        "columnCalculations":[
           
        ],
        "cardProperties":[
           {
              "id" : this.ids.viewBlockId, 
              "name":"Status",
              "type":"select",
              "options":[
                {
                    "id" : this.ids.viewCardLT7DaysId, 
                    "value":"> week",
                    "color":"propColorGreen"
                },
                {
                    "id" : this.ids.viewCardLT14DaysId, //card option id 2
                    "value":"1-2 weeks",
                    "color":"propColorYellow"
                },
                {
                    "id" : this.ids.viewCardGT14DaysId, // card option id 3
                    "value":"> 2 weeks",
                    "color":"propColorRed"
                }
              ]
           },
           {
                "id" : this.ids.selectCardPropertyId, //select card property ID
                "name": "Update Status",
                "type": "select",
                "options": [
                    {
                        "color": "propColorRed",
                        "id" : this.ids.selectCardOverdueId, //overdue select property ID
                        "value": "Overdue"
                    },
                    {
                        "color": "propColorGreen",
                        "id" : this.ids.selectCardCurrentId, //current select property ID
                        "value": "Current"
                    }
                ]               
            },
            {
                "id" : this.ids.channelURLId, //URL property ID
                "name": "Channel URL",
                "options": [],
                "type": "url"
            },
            {
                "id" : this.ids.ownerPlaybookId, //owner property ID
                "name": "Person",
                "options": [],
                "type": "person"
           }
        ]
    };
    this.title = boardTitle;
    this.createAt = new Date();
    this.updateAt = new Date();
    this.deleteAt = 0;
    this.limited = false
  }
}

class Card {
  constructor(boardId, viewBlockId, viewCardId, title) {
    this.id = returnNewUUID();
    this.schema = 1;
    this.workspaceId="";
    this.parentId=boardId;
    this.rootId=boardId; 
    this.createdBy="";
    this.modifiedBy="";
    this.type="card";
    this.fields = {
      "icon":"",
      "properties":{
        groupCardId:viewCardId
      },
      "contentOrder":[],
      "isTemplate":false
    };
    this.title = title;
    this.createAt = Date.now();
    this.updateAt = Date.now();
    this.deleteAt = 0;
    this.limited = false
  }
}

//*****************************************************************************************************/

//*****************************************************************************************************/
//*** INIT                                                                                           
//*****************************************************************************************************/
// Load env vars
dotenv.config({ path: './config/config.env' });

//express init
// moved to ESM const express = require('express');
import express from 'express';
const app = express();
const port = process.env.port | 8080;

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

//*****************************************************************************************************/
//*** Routes                                                                                           
//*****************************************************************************************************/

app.post('/', (req, res) => {
  var body = req.body;
  console.log('Received post', body);
  fetchWorkspace()
  .then((res) => createBoard(res))  
  .then((res) => fetchPlaybookRuns(res))
  //.then((res) => createCards(res))
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


//TODO : Class/Mod later
//*****************************************************************************************************/
//*** Application                                                                                           
//*****************************************************************************************************/

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
  let board = new Board(process.env.channelTitle) // board title

  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.personalAccessToken,
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify([board])
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
      console.log('return from blocks POST', res);

      return {
        workspace: workspace,
        "board": board
      }
    });
}

function fetchPlaybookRuns(state) {
  let cards = [];
  
  let today = new Date();

  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + process.env.personalAccessToken,
      'X-Requested-With': 'XMLHttpRequest'
    }
  };

  return fetch(
    process.env.MMURL + 'plugins/playbooks/api/v0/runs?playbook_id=' + process.env.playbookId,
    options
  )
  .then((res) => res.json())
  .then((res) => {
    console.log("result of fetchPlaybookRuns", res);

    if (res.total_count > 0) {
      res.items.forEach(playbookRun => {
        if (playbookRun.current_status != "Finished") {
          let durationInDays = eachDayOfInterval({'start': playbookRun.create_at, 'end': today});

          console.log('duration in days between create_at & now', durationInDays);

          //TODO : maleable durations
          //<=7
          //>7 && <=14
          //>14

          let viewCardId = "";
          if (durationInDays <= 7) viewCardId = "";
          if (durationInDays >= 7 && durationInDays <= 14) viewCardId = "";
          if (durationInDays > 14) viewCardId = "";

          cards.push(
            new Card(state.boardId, 
                     state.viewBlockId, 
                     viewCardId, 
                     playbookRun.name)
          )

        }
      })
    }

    state.cards = cards;

    return state;
  });
}

function returnNewUUID() {
  return uuidv4().replaceAll('-', '').substring(0, 26);
}

