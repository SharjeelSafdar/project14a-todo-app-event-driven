/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type TodoInput = {
  id: string,
  content: string,
  status: boolean,
};

export type MutationCompletedReturnType = {
  __typename: "MutationCompletedReturnType",
  mutationType: string,
  username: string,
  todo: Todo,
};

export type Todo = {
  __typename: "Todo",
  id: string,
  content: string,
  status: boolean,
};

export type CreateTodoMutationVariables = {
  content: string,
};

export type CreateTodoMutation = {
  createTodo: string,
};

export type EditTodoContentMutationVariables = {
  id: string,
  newContent: string,
};

export type EditTodoContentMutation = {
  editTodoContent: string,
};

export type ToggleTodoStatusMutationVariables = {
  id: string,
  newStatus: boolean,
};

export type ToggleTodoStatusMutation = {
  toggleTodoStatus: string,
};

export type DeleteTodoMutationVariables = {
  id: string,
};

export type DeleteTodoMutation = {
  deleteTodo: string,
};

export type MutationCompletedMutationVariables = {
  mutationType: string,
  username: string,
  todo: TodoInput,
};

export type MutationCompletedMutation = {
  mutationCompleted:  {
    __typename: "MutationCompletedReturnType",
    mutationType: string,
    username: string,
    todo:  {
      __typename: "Todo",
      id: string,
      content: string,
      status: boolean,
    },
  },
};

export type TodosQuery = {
  todos:  Array< {
    __typename: "Todo",
    id: string,
    content: string,
    status: boolean,
  } >,
};

export type OnMutationCompletedSubscriptionVariables = {
  username?: string | null,
};

export type OnMutationCompletedSubscription = {
  onMutationCompleted?:  {
    __typename: "MutationCompletedReturnType",
    mutationType: string,
    username: string,
    todo:  {
      __typename: "Todo",
      id: string,
      content: string,
      status: boolean,
    },
  } | null,
};
