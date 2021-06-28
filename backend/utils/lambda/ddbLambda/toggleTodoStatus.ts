import * as AWS from "aws-sdk";

export const toggleTodoStatus = async (
  ddbClient: AWS.DynamoDB.DocumentClient,
  TableName: string,
  id: string,
  username: string,
  newStatus: boolean
) => {
  try {
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName,
      Key: { id },
      UpdateExpression: "SET #oldStatus = :newStatus",
      ConditionExpression: "#usernameInTable = :usernameInArgs",
      ExpressionAttributeNames: {
        "#oldStatus": "status",
        "#usernameInTable": "username",
      },
      ExpressionAttributeValues: {
        ":newStatus": newStatus,
        ":usernameInArgs": username,
      },
    };
    await ddbClient.update(params).promise();
    console.log("Todo Status Toggled");
  } catch (error) {
    console.log("Error toggling todo status: ", error);
  }
};
