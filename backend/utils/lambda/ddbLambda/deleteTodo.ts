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
    const res = await ddbClient.delete(params).promise();
    console.log("Deleted Todo: ", JSON.stringify(res, null, 2));
    return res;
  } catch (error) {
    console.log("Error deleting todo: ", error);
    return {};
  }
};
