import * as pulumi from "@pulumi/pulumi";
import { SharedResourcesComponent } from "./components/shared_resources";
import { CloudEnvironment, CloudEnvironmentArgs } from "./components/environment";
import { devConfig, prodConfig } from "./config";

const config = new pulumi.Config();
const appName = config.require("app-name");
const billingId = config.require("billing-id");

const sharedResources = new SharedResourcesComponent(`${appName}-shared`, {
  billingId,
  forceDeleteEcrRepository: true,
});

const defaultConfig: Partial<CloudEnvironmentArgs> = {
  contextPath: "../",
  dockerFilePath: "../Dockerfile",
  platform: "linux/amd64",
  ecrRepositoryUrl: sharedResources.repository.url,
}

// DEVELOPMENT ENVIRONMENT
const devEnv = new CloudEnvironment(`${appName}-${devConfig.imageTag}`, {
  ...defaultConfig,
  ...devConfig,
  billingId: `${billingId}-${devConfig.imageTag}`,
} as CloudEnvironmentArgs);
export const devUrl = devEnv.url;

// PRODUCTION ENVIRONMENT
const prodEnv = new CloudEnvironment(`${appName}-${prodConfig.imageTag}`, {
  ...defaultConfig,
  ...prodConfig,
  billingId: `${billingId}-${devConfig.imageTag}`,
} as CloudEnvironmentArgs);
export const prodUrl = prodEnv.url;