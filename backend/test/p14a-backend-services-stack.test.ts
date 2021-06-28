import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as P14aBackendServices from "../lib/p14a-backend-services-stack";

test("Stack has a Cognito User Pool", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new P14aBackendServices.ServicesStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(haveResource("AWS::Cognito::UserPool"));
});

test("Stack has a DynamoDB Table", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new P14aBackendServices.ServicesStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(haveResource("AWS::DynamoDB::Table"));
});

test("Stack has a User Pool Web Client", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new P14aBackendServices.ServicesStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(haveResource("AWS::Cognito::UserPoolClient"));
});

test("Stack has a User Pool Domain", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new P14aBackendServices.ServicesStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(haveResource("AWS::Cognito::UserPoolDomain"));
});

test("Stack has an AppSync GraphQL API", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new P14aBackendServices.ServicesStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(haveResource("AWS::AppSync::GraphQLApi"));
});

test("Stack has an AppSync GraphQL Schema", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new P14aBackendServices.ServicesStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(haveResource("AWS::AppSync::GraphQLSchema"));
});

test("GraphQL API has a DynamoDB Data Source", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new P14aBackendServices.ServicesStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::AppSync::DataSource", {
      Type: "AMAZON_DYNAMODB",
    })
  );
});

test("GraphQL API has an HTTP Data Source", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new P14aBackendServices.ServicesStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::AppSync::DataSource", {
      Type: "HTTP",
    })
  );
});

test("GraphQL API has a None Data Source", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new P14aBackendServices.ServicesStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::AppSync::DataSource", {
      Type: "NONE",
    })
  );
});

test("Stack has a Lambda Function for DynamoDB", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new P14aBackendServices.ServicesStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::Lambda::Function", {
      FunctionName: "P14a-Ddb-Lambda",
    })
  );
});

test("Stack has an Event Rule to Invoke DdbLambda", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new P14aBackendServices.ServicesStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::Events::Rule", {
      EventPattern: {
        source: ["p14a-appsync-api"],
        "detail-type": [
          "createTodo",
          "editTodoContent",
          "toggleTodoStatus",
          "deleteTodo",
        ],
      },
    })
  );
});

test("Stack has a Lambda Function for GraphQL Mutation", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new P14aBackendServices.ServicesStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::Lambda::Function", {
      FunctionName: "P14a-GQL-Lambda",
    })
  );
});
