import * as pulumi from "@pulumi/pulumi";
import { AppRunnerService } from "./components/app_runner";
import { SharedResourcesComponent } from "./components/shared_resources";
import { CloudEnvironment } from "./components/environment";

const config = new pulumi.Config();
const appName = config.require("app-name");
const cpu = config.getNumber("cpu") || 256;
const memory = config.getNumber("memory") || 1024;
const appPort = config.getNumber("app-port") || 80;
const maxConcurrency = config.getNumber("max-concurrency") || 50;
const minSize = config.getNumber("min-size") || 1;
const maxSize = config.getNumber("max-size") || 3;
const billingId = config.require("billing-id");

const sharedResources = new SharedResourcesComponent("shared-resources", {
  billingId,
  forceDeleteEcrRepository: true,
});

const devEnv = new CloudEnvironment(`${appName}-dev`, {
  cpu,
  memory,
  appPort,
  maxConcurrency,
  minSize,
  maxSize,
  billingId,
  contextPath: "../",
  dockerFilePath: "../Dockerfile",
  imageTag: "dev",
  ecrRepositoryUrl: sharedResources.repository.url
});

export const devUrl = devEnv.url;