import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { image } from "./ecr_repository";

const config = new pulumi.Config();
const appName = config.require("app-name");
const cpu = config.getNumber("cpu") || 256;
const memory = config.getNumber("memory") || 1024;
const appPort = config.getNumber("app-port") || 80;
const maxConcurrency = config.getNumber("max-concurrency") || 50;
const minSize = config.getNumber("min-size") || 1;
const maxSize = config.getNumber("max-size") || 3;
const billingId = config.require("billing-id");

const ecr_policy = new aws.iam.Policy("ecr-policy-pull", {
  description: "Grants permission to pull images from Amazon ECR",
  policy: {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:DescribeImages",
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
        ],
        Resource: "*",
      },
    ],
  },
});

const apprunner_role = new aws.iam.Role("apprunner-role", {
  assumeRolePolicy: {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: { Service: "build.apprunner.amazonaws.com" },
        Action: "sts:AssumeRole",
      },
    ],
  },
  description: "Gives App Runner permission to access ECR",
  forceDetachPolicies: false,
  path: "/service-role/",
  tags: {
    BillingId: billingId,
  }
});

new aws.iam.RolePolicyAttachment(
  "apprunner-policy-attachment",
  {
    role: apprunner_role,
    policyArn: ecr_policy.arn,
  }
);

const autoscaling = new aws.apprunner.AutoScalingConfigurationVersion("apprunner-autoscaling", {
  autoScalingConfigurationName: appName,
  maxConcurrency: maxConcurrency,
  minSize: minSize,
  maxSize: maxSize,
  tags: {
    BillingId: billingId,
  }
});

export const service = new aws.apprunner.Service(appName, {
  serviceName: appName,
  sourceConfiguration: {
    autoDeploymentsEnabled: true,
    authenticationConfiguration: {
      accessRoleArn: pulumi.interpolate`${apprunner_role.arn.apply(arn => arn)}`,
    },
    imageRepository: {
      imageIdentifier: image.imageUri,
      imageRepositoryType: "ECR",
      imageConfiguration: {
        port: `${appPort}`,
      },
    },
  },
  healthCheckConfiguration: {
    protocol: "HTTP",
  },
  instanceConfiguration: {
    cpu: `${cpu}`,
    memory: `${memory}`,
  },
  autoScalingConfigurationArn: autoscaling.arn, 
  tags: {
    BillingId: billingId,
  }
});