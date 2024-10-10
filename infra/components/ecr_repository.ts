import * as awsx from "@pulumi/awsx";
import { Config } from "@pulumi/pulumi";

const config = new Config();
const appName = config.require("app-name");
const billingId = config.require("billing-id");

const repository = new awsx.ecr.Repository(`${appName}-repository`, {
  forceDelete: true,
  tags: {
    BillingId: billingId,
  }
});

const image = new awsx.ecr.Image(`${appName}-image`, {
  repositoryUrl: repository.repository.repositoryUrl,
  context: "../",
  dockerfile: "../Dockerfile",
  imageTag: "latest",
  platform: 'linux/amd64',
});

export { repository, image };