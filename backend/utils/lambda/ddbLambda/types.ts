import { EventBridgeEvent } from "aws-lambda";

export enum Mutations {
  CREATE_TODO = "createTodo",
  EDIT_TODO_CONTENT = "editTodoContent",
  TOGGLE_TODO_STATUS = "toggleTodoStatus",
  DELETE_TODO = "deleteTodo",
}

export type DetailType =
  | {
      username: string;
      id: never;
      content: string;
      newContent: never;
      newStatus: never;
    }
  | {
      username: string;
      id: string;
      content: never;
      newContent: string;
      newStatus: never;
    }
  | {
      username: string;
      id: string;
      content: never;
      newContent: never;
      newStatus: boolean;
    }
  | {
      username: string;
      id: string;
      content: never;
      newContent: never;
      newStatus: never;
    };

export type EventType = EventBridgeEvent<Mutations, DetailType>;
