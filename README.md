# NextJS / AWS App Runner / Pulumi

This is a simple example of how to deploy a NextJS app to AWS App Runner using Pulumi with multiple environments.

## Technologies

- [NextJS](https://nextjs.org/)
- [AWS ECR](https://aws.amazon.com/ecr/)
- [AWS App Runner](https://aws.amazon.com/apprunner/)
- [Pulumi](https://www.pulumi.com/)

## Prerequisites

- [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

## How to use it

- Make sure you have the [AWS CLI configured with the right credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
- Clone this repository
- Navigate to the `infra` folder
- Run `export AWS_PROFILE={YOUR PROFILE}` on your terminal
- Apply any configuration to any environment on the `infra/config.ts` file.
- The `appName`, `billing_id` and `region` are required to be configured using pulumi config.
- Run `pulumi up` to deploy the infrastructure.
- You can create more environents as needed by adding more configurations to the `infra/config.ts` file and adding more Envs to the `infra/index.ts` file.

## What is being deployed

- A ECR repository to store the docker image of the NextJS app
- All environments are using the same ECR repository, the image is tagged with the environment name
- A App Runner service for each environment
- Other resources like IAM roles, policies, etc

## TODO

- [ ] Github action to build the Docker image and push it to ECR
- [ ] Add a custom domain to the App Runner service
- [ ] There's an issue with the environment variables on the App Runner service, it's not being set correctly
