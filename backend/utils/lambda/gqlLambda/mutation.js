exports.mutationCompleted = /* GraphQL */ `
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
      todo
    }
  }
`;
