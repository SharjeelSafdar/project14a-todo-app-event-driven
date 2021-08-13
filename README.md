<p align="center">
  <a href="https://www.gatsbyjs.com">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Project 14A: Serverless JAMstack Todo App with Event-Driven Architecture
</h1>

## Link to Web App

A serverless JAMstack Todo App with Gatsby, TypeScript, AppSync, DynamoDB, Lambda, Cognito, CloudFront, and EventBridge. The web app has been deployed to AWS CloudFront, and can be accessed [here](https://d2181uw8zbk99u.cloudfront.net/).

## Features

The following are some of the features of this project:

- Email authentication with [AWS Cognito User Pool](https://aws.amazon.com/cognito/)
- A dashboard for a user to manage his/her todos
- Fetches and displays the todos of the logged in user only
- Possible interactions with todos: create a new todo, update an existing todo, delete a todo and toggle an existing todo's status
- A [DynamoDB](https://aws.amazon.com/dynamodb/) table to store todos
- A GraphQL API with [AWS AppSync](https://aws.amazon.com/appsync/) to interact with DynamoDB
- Demonstrates CRUD operations using DynamoDB through the GraphQL API
- The AppSync queries are performed synchronously with a DynamoDB data source.
- The AppSync mutations are performed assynchronously. An HTTP data source simply puts the information about the mutation on [EventBridge](https://aws.amazon.com/eventbridge/) default bus.
- EventBridge invokes a [Lambda](https://aws.amazon.com/lambda/) function which performs the actual mutation on the DynamoDB Table with the help of `aws-sdk`.
- DynamoDB Streams are also enabled for our table. Any change in the table invokes another Lambda function which calls a mutation on AppSync called `mutationCompleted`.
- The client listens for this mutation with an AppSync subscription called `onMutationCompleted` and updates the UI.
- Uses [Amplify](https://amplify.com/) for GraphQL queries and mutations, and User Pool Auth
- Bootstrapped with [GatsbyJS](https://www.gatsbyjs.com/)
- Additionally, includes TypeScript support for gatsby-config, gatsby-node, gatsby-browser and gatsby-ssr files
- Site hosted on [AWS CloudFront](https://aws.amazon.com/cloudfront/)
- CI/CD with [GitHub Actions](https://docs.github.com/en/actions)
- Completely typed with [TypeScript](https://www.typescriptlang.org/)
- Completely interactive and responsive design with [Material-UI](https://material-ui.com/) components.

## Backend

This AWS CDK App deploys the backend infrastructure for Project 14A. The app consists of two stacks.

### Stack 1: AppSync GraphQL API, DynamoDB Table, EventBridge and Lambda Functions

It contanis the AWS services used by the web client. It has the following constructs:

- A DynamoDB Table to contain the todos saved by the users
- An AppSync GraphQL API to access the todos of the logged in user from the table
- A Lamba function to perform the actual mutation on the DynamoDB table
- An EventBridge rule to invoke this function when a mutation is performed by the client side
- Another Lambda function to call an AppSync mutation to inform the client side about the changes in table through an AppSync subscription

<p align="center">
  <img alt="Architecture Diagram" src="./backend/P14a AWS Architecture.jpg" />
</p>

### Stack 2: CloudFront Distribution and S3 Bucket

It contains the infrastructure to deploy frontend client. It has the following constructs:

- A [S3](https://aws.amazon.com/s3/) Bucket with public access to store the static assets of Gatsby web app
- A Cloud Front Distribution to serve the static assets through a CDN. It also has the error handling capability: redirects any `404s` to `/404.html`.

<p align="center">
  <img alt="Architecture Diagram" src="./backend/CloudFront Distribution Stack.jpg" />
</p>
