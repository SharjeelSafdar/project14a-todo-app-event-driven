const URL = require("url");
const fetch = require("node-fetch");
const { CognitoIdentityServiceProvider } = require("aws-sdk");

const {
  determineMutationType,
  determineUsername,
  getData,
} = require("./utilFunctions");

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
});
const initiateAuth = async ({ clientId, username, password }) =>
  cognitoIdentityServiceProvider
    .initiateAuth({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    })
    .promise();

exports.handler = async (event, context, callback) => {
  console.log(
    `DynamoDB Stream Records = ${JSON.stringify(event.Records, null, 2)}`
  );

  const clientId = process.env.COGNITO_USERPOOL_CLIENT_ID;
  const endPoint = process.env.APPSYNC_GRAPHQL_API_ENDPOINT;
  const username = "sharjeel";
  const password = "abcdABCD1234";
  const { AuthenticationResult } = await initiateAuth({
    clientId,
    username,
    password,
  });
  const accessToken = AuthenticationResult && AuthenticationResult.AccessToken;

  event.Records.forEach(async record => {
    const postBody = {
      query: /* GraphQL */ `
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
      `,
      variables: {
        mutationType: determineMutationType(record),
        username: determineUsername(record),
        todo: getData(record),
      },
    };
    console.log(`Post Body = ${JSON.stringify(postBody, null, 2)}`);

    const uri = await URL.parse(endPoint);

    const options = {
      method: "POST",
      body: JSON.stringify(postBody),
      headers: {
        host: uri.host,
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    };
    const response = await fetch(uri.href, options);
    const json = await response.json();

    console.log("Mutation Completed: ", json);
  });

  callback(null);
};
