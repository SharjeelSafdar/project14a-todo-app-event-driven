import * as AWS from "aws-sdk";

import { EventType, Mutations } from "./types";
import { createTodo } from "./createTodo";
import { editTodoContent } from "./editTodoContent";
import { toggleTodoStatus } from "./toggleTodoStatus";
import { deleteTodo } from "./deleteTodo";

const STACK_REGION = process.env.STACK_REGION;
const TODOS_TABLE_NAME = process.env.TODOS_TABLE_NAME;
const ddbClient = new AWS.DynamoDB.DocumentClient({ region: STACK_REGION });

export const handler = async (event: EventType) => {
  console.log("Event: ", JSON.stringify(event, null, 2));

  if (!STACK_REGION || !TODOS_TABLE_NAME) {
    const message =
      "STACK_REGION and TODOS_TABLE_NAME env variables must be provided.";
    console.log(message);
    throw new Error(message);
  }

  const mutationType = event["detail-type"];

  switch (mutationType) {
    case Mutations.CREATE_TODO: {
      await createTodo(
        ddbClient,
        TODOS_TABLE_NAME,
        event.detail.username,
        event.detail.content
      );
    }
    case Mutations.EDIT_TODO_CONTENT: {
      await editTodoContent(
        ddbClient,
        TODOS_TABLE_NAME,
        event.detail.id,
        event.detail.username,
        event.detail.newContent
      );
    }
    case Mutations.TOGGLE_TODO_STATUS: {
      await toggleTodoStatus(
        ddbClient,
        TODOS_TABLE_NAME,
        event.detail.id,
        event.detail.username,
        event.detail.newStatus
      );
    }
    case Mutations.DELETE_TODO: {
      await deleteTodo(
        ddbClient,
        TODOS_TABLE_NAME,
        event.detail.id,
        event.detail.username
      );
    }
    default: {
    }
  }
};
