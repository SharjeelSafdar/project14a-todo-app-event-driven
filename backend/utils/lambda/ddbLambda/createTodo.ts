import * as AWS from "aws-sdk";
import { randomBytes } from "crypto";

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
        id: randomBytes(16).toString("hex"),
        username,
        content,
        status: false,
      },
    };
    await ddbClient.put(params).promise();
    console.log("New Todo Added");
  } catch (error) {
    console.log("Error creating new todo: ", error);
  }
};
