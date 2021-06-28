exports.initiateAuth = async (
  cognitoProvider,
  { clientId, username, password }
) =>
  cognitoProvider
    .initiateAuth({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    })
    .promise();

exports.determineMutationType = record => {
  switch (record.eventName) {
    case "INSERT": {
      return "createTodo";
    }
    case "REMOVE": {
      return "deleteTodo";
    }
    case "MODIFY": {
      if (
        record.dynamodb.NewImage.content.S !==
        record.dynamodb.OldImage.content.S
      ) {
        return "editTodoContent";
      } else {
        return "toggleTodoStatus";
      }
    }
    default: {
      return "deleteTodo";
    }
  }
};

exports.determineUsername = record => {
  return (
    (record.dynamodb.NewImage && record.dynamodb.NewImage.username.S) ||
    (record.dynamodb.OldImage && record.dynamodb.OldImage.username.S)
  );
};

exports.getData = record => {
  if (record.dynamodb.NewImage) {
    return {
      id: record.dynamodb.NewImage.id.S,
      content: record.dynamodb.NewImage.content.S,
      status:
        record.dynamodb.NewImage.status.S === "true" ||
        record.dynamodb.NewImage.status.BOOL,
    };
  } else if (record.dynamodb.OldImage) {
    return {
      id: record.dynamodb.OldImage.id.S,
      content: record.dynamodb.OldImage.content.S,
      status:
        record.dynamodb.OldImage.status.S === "true" ||
        record.dynamodb.OldImage.status.BOOL,
    };
  }
};
