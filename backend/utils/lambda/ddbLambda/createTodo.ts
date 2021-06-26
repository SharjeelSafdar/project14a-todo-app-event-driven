import * as AWS from "aws-sdk";

export const createTodo = async (
  ddbClient: AWS.DynamoDB.DocumentClient,
  TableName: string,
  username: string,
  content: string
) => {
  try {
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName,
      Item: {
        username,
        content,
        status: false,
      },
    };
    const res = await ddbClient.put(params).promise();
    console.log("New Todo: ", JSON.stringify(res, null, 2));
    return res;
  } catch (error) {
    console.log("Error creating new todo: ", error);
    return {};
  }
};
