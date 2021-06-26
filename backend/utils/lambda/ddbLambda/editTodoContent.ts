import * as AWS from "aws-sdk";

export const editTodoContent = async (
  ddbClient: AWS.DynamoDB.DocumentClient,
  TableName: string,
  id: string,
  username: string,
  newContent: string
) => {
  try {
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName,
      Key: { id },
      UpdateExpression: "SET #oldContent = :newContent",
      ConditionExpression: "#usernameInTable = :usernameInArgs",
      ExpressionAttributeNames: {
        "#oldContent": "content",
        "#usernameInTable": "username",
      },
      ExpressionAttributeValues: {
        ":newContent": newContent,
        ":usernameInArgs": username,
      },
    };
    await ddbClient.update(params).promise();
    console.log("Todo Updated");
  } catch (error) {
    console.log("Error updating todo: ", error);
  }
};
