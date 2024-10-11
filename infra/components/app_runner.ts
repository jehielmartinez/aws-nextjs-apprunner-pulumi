import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export interface AppRunnerServiceArgs {
  cpu: pulumi.Input<number>;
  memory: pulumi.Input<number>;
  appPort: pulumi.Input<number>;
  maxConcurrency: pulumi.Input<number>;
  minSize: pulumi.Input<number>;
  maxSize: pulumi.Input<number>;
  billingId: string;
  imageUri: pulumi.Input<string>;
  runtimeEnvVariables?: Record<string, string>;
}

export class AppRunnerService extends pulumi.ComponentResource {
  app_runner: aws.apprunner.Service;
  url: pulumi.Output<string>;
  constructor(name: string, args: AppRunnerServiceArgs, opts?: pulumi.ComponentResourceOptions) {
    super("my:app:AppRunnerService", name, args, opts);
    
    const ecr_policy = new aws.iam.Policy(`${name}-ecr-policy-pull`, {
      description: 'Grants permission to pull images from Amazon ECR',
      policy: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              "ecr:GetDownloadUrlForLayer",
              "ecr:BatchGetImage",
              "ecr:DescribeImages",
              "ecr:GetAuthorizationToken",
              "ecr:BatchCheckLayerAvailability",
            ],
            Resource: '*',
          },
        ],
      },
      tags: {
        BillingId: args.billingId,
      }
    }, { parent: this });

    const apprunner_role = new aws.iam.Role(`${name}-apprunner-role`, {
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
      tags: {
        BillingId: args.billingId,
      }
    }, { parent: this });

    new aws.iam.RolePolicyAttachment(
      `${name}-apprunner-policy-attachment`,
      {
        role: apprunner_role,
        policyArn: ecr_policy.arn,
      },
      { parent: this }
    );

    const autoscaling = new aws.apprunner.AutoScalingConfigurationVersion(`${name}-apprunner-autoscaling`, {
      autoScalingConfigurationName: name,
      maxConcurrency: args.maxConcurrency,
      minSize: args.minSize,
      maxSize: args.maxSize,
      tags: {
        BillingId: args.billingId,
      }
    }, { parent: this });

    this.app_runner = new aws.apprunner.Service(`${name}-service`, {
      serviceName: name,
      sourceConfiguration: {
        autoDeploymentsEnabled: true,
        authenticationConfiguration: {
          accessRoleArn: apprunner_role.arn,
        },
        imageRepository: {
          imageIdentifier: args.imageUri,
          imageRepositoryType: 'ECR',
          imageConfiguration: {
            port: `${args.appPort}`,
            runtimeEnvironmentVariables: {
              ...args.runtimeEnvVariables,
              HOSTNAME: '0.0.0.0/16'
            }
          },
        },
      },
      healthCheckConfiguration: {
        protocol: 'HTTP',
      },
      instanceConfiguration: {
        cpu: `${args.cpu}`,
        memory: `${args.memory}`,
      },
      autoScalingConfigurationArn: autoscaling.arn,
    }, { parent: this });

    this.url = this.app_runner.serviceUrl;
  }
}