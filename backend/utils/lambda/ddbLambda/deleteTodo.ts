import * as AWS from "aws-sdk";

export const deleteTodo = async (
  ddbClient: AWS.DynamoDB.DocumentClient,
  TableName: string,
  id: string,
  username: string
) => {
  try {
    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName,
      Key: { id },
      ConditionExpression: "#usernameInTable = :usernameInArgs",
      ExpressionAttributeNames: {
        "#usernameInTable": "username",
      },
      ExpressionAttributeValues: {
        ":usernameInArgs": username,
      },
    };
    await ddbClient.delete(params).promise();
    console.log("Todo Deleted");
  } catch (error) {
    console.log("Error deleting todo: ", error);
  }
};
