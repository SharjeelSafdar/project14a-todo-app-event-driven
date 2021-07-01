/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTodo = /* GraphQL */ `
  mutation CreateTodo($content: String!) {
    createTodo(content: $content)
  }
`;
export const editTodoContent = /* GraphQL */ `
  mutation EditTodoContent($id: ID!, $newContent: String!) {
    editTodoContent(id: $id, newContent: $newContent)
  }
`;
export const toggleTodoStatus = /* GraphQL */ `
  mutation ToggleTodoStatus($id: ID!, $newStatus: Boolean!) {
    toggleTodoStatus(id: $id, newStatus: $newStatus)
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;
export const mutationCompleted = /* GraphQL */ `
  mutation MutationCompleted(
    $mutationType: String!
    $username: String!
    $todo: TodoInput!
  ) {
    mutationCompleted(
      mutationType: $mutationType
      username: $username
      todo: $todo
    ) {
      mutationType
      username
      todo {
        id
        content
        status
      }
    }
  }
`;
