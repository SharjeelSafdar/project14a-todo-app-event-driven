import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";

export class FrontendDeployStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const p14aBucketForFrontendAssets = new s3.Bucket(
      this,
      "P14aBucketForFrontendAssets",
      {
        bucketName: "p14a-bucket-for-frontend-assets",
        versioned: true,
        autoDeleteObjects: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        websiteIndexDocument: "index.html",
        publicReadAccess: true,
      }
    );

    const p14aDistribution = new cloudfront.Distribution(
      this,
      "P14aFrontendDist",
      {
        defaultBehavior: {
          origin: new origins.S3Origin(p14aBucketForFrontendAssets),
        },
        errorResponses: [
          {
            httpStatus: 404,
            responsePagePath: "/404.html",
          },
        ],
      }
    );

    new cdk.CfnOutput(this, "CloudFrontUrl", {
      value: p14aDistribution.domainName,
    });

    cdk.Tags.of(this).add("Project", "P14a-Todo-App-event-driven");
  }
}
