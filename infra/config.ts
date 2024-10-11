import { CloudEnvironmentArgs } from "./components/environment"

const devConfig: Partial<CloudEnvironmentArgs> = {
  imageTag: "dev",
  cpu: 512,
  memory: 1024,
  appPort: 3000,
  maxConcurrency: 100,
  minSize: 1,
  maxSize: 1,
  runtimeEnvVariables: {
    NEXT_PUBLIC_ENVIRONMENT: "dev"
  }
}

const prodConfig: Partial<CloudEnvironmentArgs> = {
  imageTag: "prod",
  cpu: 1024,
  memory: 2048,
  appPort: 3000,
  maxConcurrency: 100,
  minSize: 1,
  maxSize: 2,
  runtimeEnvVariables: {
    NEXT_PUBLIC_ENVIRONMENT: "prod"
  }
}

export { devConfig, prodConfig }