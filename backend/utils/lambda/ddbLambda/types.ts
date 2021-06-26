import { EventBridgeEvent } from "aws-lambda";

import { Mutations } from "../../types";

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
