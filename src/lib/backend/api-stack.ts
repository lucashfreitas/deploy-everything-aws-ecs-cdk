import * as ec2 from '@aws-cdk/aws-ec2';
import {SecurityGroup} from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import {ApplicationLoadBalancedFargateService} from '@aws-cdk/aws-ecs-patterns';

const DEFAULT_API_OPTIONS: ApiServiceOptions = {
  disiredCount: 1,
  memoryLimit: 512,
  cpu: 256,
};

interface ApiStackProps extends cdk.StackProps {
  apiOptions?: ApiServiceOptions;
}

interface ApiServiceOptions {
  disiredCount: number;
  memoryLimit: number;
  cpu: number;
}

export class ApiStack extends cdk.Stack {
  vpc: ec2.Vpc;
  fargateSecurityGroup: SecurityGroup;
  ecsCluster: ecs.Cluster;
  fargateService: ApplicationLoadBalancedFargateService;

  constructor(
    scope: cdk.App,
    id: string,
    props: ApiStackProps = {
      apiOptions: DEFAULT_API_OPTIONS,
    },
  ) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, `${id}Vpc`, {
      cidr: '172.31.0.0/16',
    });

    this.fargateSecurityGroup = new SecurityGroup(
      this,
      `${id}Ec2SecurityGroup`,
      {
        securityGroupName: 'Ec2SecurityGroup',
        description: 'Security Group to EC2/Fargate Taks',
        vpc: this.vpc,
        allowAllOutbound: true,
      },
    );

    this.ecsCluster = new ecs.Cluster(this, `${id}EcsCluster`, {
      vpc: this.vpc,
      clusterName: `${id}EcsCluster`,
    });

    this.fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      'Service',
      {
        cluster: this.ecsCluster,
        memoryLimitMiB: 1024,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
          environment: {},
        },
        publicLoadBalancer: true,
        desiredCount: props.apiOptions?.disiredCount,
        securityGroups: [this.fargateSecurityGroup],
      },
    );
  }
}
