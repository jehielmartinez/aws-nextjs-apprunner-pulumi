import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";

export interface SharedResourcesComponentArgs {
  billingId: string;
  forceDeleteEcrRepository?: boolean;
}
export class SharedResourcesComponent extends pulumi.ComponentResource {
  repository: awsx.ecr.Repository;
  constructor(name: string, args: SharedResourcesComponentArgs, opts?: pulumi.ComponentResourceOptions) {
    super("my:app:SharedResources", name, args, opts);

    const repository = new awsx.ecr.Repository(`${name}-repository`, {
      forceDelete: args.forceDeleteEcrRepository ?? false,
      tags: {
        BillingId: args.billingId,
      }
    }, { parent: this });

    this.repository = repository;
  }
}