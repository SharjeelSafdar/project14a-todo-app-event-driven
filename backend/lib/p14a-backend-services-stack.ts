import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as events from "@aws-cdk/aws-events";
import * as eventTargets from "@aws-cdk/aws-events-targets";
import * as lambda from "@aws-cdk/aws-lambda";

import {
  EVENT_SOURCE,
  requestTemplate,
  responseTemplate,
} from "../utils/vtlTemplates";

export class ServicesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /* ******************************************************** */
    /* *************** DynamoDB Table for Todos *************** */
    /* ******************************************************** */
    const todosTable = new ddb.Table(this, "P14aTodosTable", {
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    todosTable.addGlobalSecondaryIndex({
      indexName: "username-index",
      partitionKey: {
        name: "username",
        type: ddb.AttributeType.STRING,
      },
      projectionType: ddb.ProjectionType.ALL,
    });

    /* ************************************************ */
    /* *************** Cognito UserPool *************** */
    /* ************************************************ */
    const userPool = new cognito.UserPool(this, "P14aUserPool", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        username: true,
      },
      signInCaseSensitive: true,
      passwordPolicy: {
        minLength: 8,
        requireDigits: true,
        requireLowercase: true,
        requireUppercase: true,
      },
      autoVerify: {
        email: true,
      },
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.LINK,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      standardAttributes: {
        email: {
          required: true,
          mutable: false,
        },
      },
    });

    const userPoolClient = userPool.addClient("P14aUserPoolClient", {
      authFlows: {
        userPassword: true,
      },
    });

    new cdk.CfnOutput(this, "P14aUserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });

    const userPoolDomain = userPool.addDomain("P14aUserPoolDomain", {
      cognitoDomain: {
        domainPrefix: "todo-app-p14a",
      },
    });

    new cdk.CfnOutput(this, "P14aUserPoolDomain", {
      value: userPoolDomain.domainName,
    });

    /* *************************************************** */
    /* *************** AppSync GraphQL API *************** */
    /* *************************************************** */
    const gqlApi = new appsync.GraphqlApi(this, "P14aGraphQlApi", {
      name: "P14a-GraphQL-Api",
      schema: appsync.Schema.fromAsset("utils/graphql/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          },
        },
      },
    });

    /* ********************************************************** */
    /* *************** GraphQL API Query Resolver *************** */
    /* ********************************************************** */
    const ddbDataSource = gqlApi.addDynamoDbDataSource(
      "DdbDataSource",
      todosTable
    );
    todosTable.grantReadWriteData(ddbDataSource);

    ddbDataSource.createResolver({
      typeName: "Query",
      fieldName: "todos",
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
        {
          "version" : "2017-02-28",
          "operation" : "Query",
          "index" : "username-index",
          "query" : {
            "expression": "username = :username",
            "expressionValues" : {
              ":username" : $util.dynamodb.toDynamoDBJson($ctx.identity.username)
            }
          }
        }
      `),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
    });

    /* ************************************************************** */
    /* *************** GraphQL API Mutation Resolvers *************** */
    /* ************************************************************** */
    const httpEventBridgeDS = gqlApi.addHttpDataSource(
      "HttpEventBridgeDS",
      `https://events.${this.region}.amazonaws.com/`, // This is the ENDPOINT for eventbridge.
      {
        name: "p14aHttpEventBridgeDS",
        description: "Sending events to EventBridge on AppSync mutations",
        authorizationConfig: {
          signingRegion: this.region,
          signingServiceName: "events",
        },
      }
    );
    events.EventBus.grantAllPutEvents(httpEventBridgeDS);
    enum mutations {
      CREATE_TODO = "createTodo",
      EDIT_TODO_CONTENT = "editTodoContent",
      TOGGLE_TODO_STATUS = "toggleTodoStatus",
      DELETE_TODO = "deleteTodo",
    }

    const createTodoData = `\\\"content\\\": \\\"$ctx.args.content\\\", \\\"username\\\": \\\"$ctx.identity.username\\\"`;
    httpEventBridgeDS.createResolver({
      typeName: "Mutation",
      fieldName: mutations.CREATE_TODO,
      requestMappingTemplate: appsync.MappingTemplate.fromString(
        requestTemplate(createTodoData, mutations.CREATE_TODO)
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromString(
        responseTemplate()
      ),
    });

    const editTodoData = `\\\"id\\\": \\\"$ctx.args.id\\\", \\\"newContent\\\": \\\"$ctx.args.newContent\\\", \\\"username\\\": \\\"$ctx.identity.username\\\"`;
    httpEventBridgeDS.createResolver({
      typeName: "Mutation",
      fieldName: mutations.EDIT_TODO_CONTENT,
      requestMappingTemplate: appsync.MappingTemplate.fromString(
        requestTemplate(editTodoData, mutations.EDIT_TODO_CONTENT)
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromString(
        responseTemplate()
      ),
    });

    const toggleTodoData = `\\\"id\\\": \\\"$ctx.args.id\\\", \\\"newStatus\\\": \\\"$ctx.args.newStatus\\\", \\\"username\\\": \\\"$ctx.identity.username\\\"`;
    httpEventBridgeDS.createResolver({
      typeName: "Mutation",
      fieldName: mutations.TOGGLE_TODO_STATUS,
      requestMappingTemplate: appsync.MappingTemplate.fromString(
        requestTemplate(toggleTodoData, mutations.TOGGLE_TODO_STATUS)
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromString(
        responseTemplate()
      ),
    });

    const deleteTodoData = `\\\"id\\\": \\\"$ctx.args.id\\\", \\\"username\\\": \\\"$ctx.identity.username\\\"`;
    httpEventBridgeDS.createResolver({
      typeName: "Mutation",
      fieldName: mutations.DELETE_TODO,
      requestMappingTemplate: appsync.MappingTemplate.fromString(
        requestTemplate(deleteTodoData, mutations.DELETE_TODO)
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromString(
        responseTemplate()
      ),
    });

    /* *************************************************************** */
    /* ********** StateMachine to Be Invoked By EventBridge ********** */
    /* *************************************************************** */
    const ddbLambda = new lambda.Function(this, "P14aDdbLambda", {
      functionName: "P14a-Ddb-Lambda",
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("utils/lambda/ddbLambda"),
      handler: "index.handler",
      environment: {
        TODOS_TABLE_NAME: todosTable.tableName,
        TODOS_TABLE_REGION: this.region,
      },
    });
    todosTable.grantReadWriteData(ddbLambda);

    /* ****************************************************************** */
    /* ********** EventBridge Rule to Invoke the State Machine ********** */
    /* ****************************************************************** */
    new events.Rule(this, "P14aEventRule", {
      description:
        "Rule to invoke state machine when a mutation is run in AppSync",
      eventPattern: {
        source: [EVENT_SOURCE],
        detailType: [
          mutations.CREATE_TODO,
          mutations.EDIT_TODO_CONTENT,
          mutations.TOGGLE_TODO_STATUS,
          mutations.DELETE_TODO,
        ],
      },
      targets: [new eventTargets.LambdaFunction(ddbLambda)],
    });

    cdk.Tags.of(this).add("Project", "P14a-Todo-App-event-driven");
  }
}
