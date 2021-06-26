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
    const res = await ddbClient.update(params).promise();
    console.log("Toggled Todo: ", JSON.stringify(res, null, 2));
    return res;
  } catch (error) {
    console.log("Error toggling todo status: ", error);
    return {};
  }
};
