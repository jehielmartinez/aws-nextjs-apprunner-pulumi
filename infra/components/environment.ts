import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import { AppRunnerService, AppRunnerServiceArgs } from "./app_runner";

type OmitImageUri<T> = Omit<T, 'imageUri'>;

export interface CloudEnvironmentArgs extends OmitImageUri<AppRunnerServiceArgs> {
  contextPath: pulumi.Input<string>;
  dockerFilePath: pulumi.Input<string>;
  ecrRepositoryUrl: pulumi.Input<string>;
  imageTag?: pulumi.Input<string>;
  platform?: pulumi.Input<string>;
}

export class CloudEnvironment extends pulumi.ComponentResource {
  url: pulumi.Output<string>;
  constructor(name: string, args: CloudEnvironmentArgs, opts?: pulumi.ComponentResourceOptions) {
    super("my:app:CloudEnvironment", name, args, opts);

    // Builds a new Docker image and pushes it to the ECR repository
    const image = new awsx.ecr.Image(`${name}-image`, {
      repositoryUrl: args.ecrRepositoryUrl,
      context: args.contextPath,
      dockerfile: args.dockerFilePath,
      imageTag: args.imageTag ?? 'latest',
      platform: args.platform ?? 'linux/amd64',
    }, { parent: this });

    const appRunner = new AppRunnerService(`${name}-apprunner-service`, {
      cpu: args.cpu,
      memory: args.memory,
      appPort: args.appPort,
      maxConcurrency: args.maxConcurrency,
      minSize: args.minSize,
      maxSize: args.maxSize,
      billingId: args.billingId,
      runtimeEnvVariables: args.runtimeEnvVariables,
      imageUri: image.imageUri,      
    }, { parent: this });

    this.url = appRunner.url;
  }
}