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
    // const boardId = returnNewUUID();
    // const viewBlockId = returnNewUUID();
    const viewCardLT7DaysId = returnNewUUID();
    const viewCardLT14DaysId = returnNewUUID();
    const viewCardGT14DaysId = returnNewUUID();
    const selectCardPropertyId = returnNewUUID();
    const selectCardOverdueId = returnNewUUID();
    const selectCardCurrentId = returnNewUUID();
    const channelURLId = returnNewUUID();
    const ownerPlaybookId = returnNewUUID();
    const viewBoardId = returnNewUUID();

    this.ids = {
      boardId: '',
      viewBlockId: '',
      viewCardLT7DaysId: viewCardLT7DaysId,
      viewCardLT14DaysId: viewCardLT14DaysId,
      viewCardGT14DaysId: viewCardGT14DaysId,
      selectCardPropertyId: selectCardPropertyId,
      selectCardOverdueId: selectCardOverdueId,
      selectCardCurrentId: selectCardCurrentId,
      channelURLId: channelURLId,
      ownerPlaybookId: ownerPlaybookId,
      viewBoardId: viewBoardId
    };

    console.log('my generated ids', this.ids);

    this.id = this.ids.boardId;
    this.schema = 1;
    this.workspaceId = '';
    this.parentId = '';
    this.rootId = this.ids.boardId;
    this.createdBy = '';
    this.modifiedBy = '';
    this.type = 'board';
    this.fields = new BoardFields(this.ids);
    this.title = boardTitle;
    this.createAt = Date.now();
    this.updateAt = Date.now();
    this.deleteAt = 0;
    this.limited = false;
  }
}

class ViewBoard {
  constructor(ids) {
    this.id = ids.viewBoardId;
    this.schema = 1;
    this.workspaceId = '';
    this.parentId = ids.boardId;
    this.rootId = ids.boardId;
    this.createdBy = '';
    this.modifiedBy = '';
    this.type = 'view';
    this.fields = new ViewBoardFields(ids);
    this.title = 'Board View';
    this.createAt = Date.now();
    this.updateAt = Date.now();
    this.deleteAt = 0;
    this.limited = false;
  }
}

class BoardFields {
  constructor(ids) {
    this.showDescription = false;
    this.description = '';
    this.icon = '';
    this.isTemplate = false;
    this.templateVer = 0;
    this.columnCalculations = [];
    this.cardProperties = [
      {
        id: ids.viewBlockId,
        name: 'Status',
        type: 'select',
        options: [
          {
            id: ids.viewCardLT7DaysId,
            value: '> week',
            color: 'propColorGreen'
          },
          {
            id: ids.viewCardLT14DaysId, //card option id 2
            value: '1-2 weeks',
            color: 'propColorYellow'
          },
          {
            id: ids.viewCardGT14DaysId, // card option id 3
            value: '> 2 weeks',
            color: 'propColorRed'
          }
        ]
      },
      {
        id: ids.selectCardPropertyId, //select card property ID
        name: 'Update Status',
        type: 'select',
        options: [
          {
            color: 'propColorRed',
            id: ids.selectCardOverdueId, //overdue select property ID
            value: 'Overdue'
          },
          {
            color: 'propColorGreen',
            id: ids.selectCardCurrentId, //current select property ID
            value: 'Current'
          }
        ]
      },
      {
        id: ids.channelURLId, //URL property ID
        name: 'Channel URL',
        options: [],
        type: 'url'
      },
      {
        id: ids.ownerPlaybookId, //owner property ID
        name: 'Person',
        options: [],
        type: 'person'
      }
    ];
  }
}

class ViewBoardFields {
  constructor(ids) {
    this.viewType = 'board';
    this.sortOptions = [];
    this.visiblePropertyIds = [
      ids.selectCardPropertyId, //select card property ID
      ids.channelURLId, //url property ID
      ids.ownerPlaybookId //owner property ID
    ];
    this.visibleOptionIds = [];
    this.hiddenOptionIds = [''];
    this.collapsedOptionIds = [];
    this.filter = {
      operation: 'and',
      filters: []
    };
    this.cardOrder = [];
    this.columnWidths = {};
    this.columnCalculations = {};
    this.kanbanCalculations = {};
    this.defaultTemplateId = '';
  }
}

class Card {
  constructor(
    boardId,
    viewBlockId,
    viewCardId,
    title,
    ownerPlaybookId,
    playbookOwnerUser,
    selectCardOverdueValue
  ) {
    let fieldProperties = {};
    fieldProperties[viewBlockId] = viewCardId;
    fieldProperties[ownerPlaybookId] = playbookOwnerUser;
    if (selectCardOverdueValue < 0) {
      fieldProperties[selectCardPropertyId] = selectCardOverdueId;
    } else {
      fieldProperties[selectCardPropertyId] = selectCardCurrentId;
    }
    
    console.log('fieldProperties', fieldProperties);

    this.id = returnNewUUID();
    this.schema = 1;
    this.workspaceId = '';
    this.parentId = boardId;
    this.rootId = boardId;
    this.createdBy = '';
    this.modifiedBy = '';
    this.type = 'card';
    this.fields = {
      icon: '',
      properties: fieldProperties,
      contentOrder: [],
      isTemplate: false
    };
    this.title = title;
    this.createAt = Date.now();
    this.updateAt = Date.now();
    this.deleteAt = 0;
    this.limited = false;
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
    .then((res) => createCards(res));
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
  let board = new Board(process.env.channelTitle); // board title
  let viewBoard = new ViewBoard(board.ids);

  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.personalAccessToken,
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify([board, viewBoard])
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

      res.find((block) => {
        if (block.type == 'board') board.ids.boardId = block.id;
        if (block.type == 'view') board.ids.viewBoardId = block.id;
      });

      return {
        workspace: workspace,
        ids: board.ids
      };
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
    process.env.MMURL +
      'plugins/playbooks/api/v0/runs?playbook_id=' +
      process.env.playbookId,
    options
  )
    .then((res) => res.json())
    .then((res) => {
      console.log('result of fetchPlaybookRuns', res);

      if (res.total_count > 0) {
        res.items.forEach((playbookRun) => {
          if (playbookRun.current_status != 'Finished') {
            // let durationInDays = eachDayOfInterval({
            //   start: playbookRun.create_at,
            //   end: today
            // });

            let durationInDays = distanceFromNowInDays(playbookRun.create_at);

            console.log(
              'duration in days between create_at & now',
              durationInDays
            );

            //TODO : maleable durations
            //<=7
            //>7 && <=14
            //>14

            let viewCardId = '';
            if (durationInDays <= 7) viewCardId = state.ids.viewCardLT7DaysId;
            if (durationInDays >= 7 && durationInDays <= 14)
              viewCardId = state.ids.viewCardLT14DaysId;
            if (durationInDays > 14) viewCardId = state.ids.viewCardGT14DaysId;

            const lastStatusUpdateDueEpoch = distanceFromNowInDays(playbookRun.last_status_update_at + (playbookRun.previous_reminder / 1000000));

            cards.push(
              new Card(
                state.ids.boardId,
                state.ids.viewBlockId,
                viewCardId,
                playbookRun.name,
                state.ids.ownerPlaybookId,
                playbookRun.owner_user_id,
                lastStatusUpdateDueEpoch
              )
            );
          }
        });
      }

      state.cards = cards;

      return state;
    });
}

function createCards(state) {
  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.personalAccessToken,
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify(state.cards)
  };

  return fetch(
    process.env.MMURL +
      'plugins/focalboard/api/v1/workspaces/' +
      state.workspace.id +
      '/blocks',
    options
  )
    .then((res) => res.json())
    .then((res) => {
      console.log('return from createCards POST', res);
      return state;
    });
}

function returnNewUUID() {
  return uuidv4().replaceAll('-', '').substring(0, 26);
}

function distanceFromNowInDays(comparisonDate) {
  return (Date.now() - comparisonDate) / 86400000;
}
