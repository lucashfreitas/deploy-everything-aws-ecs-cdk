import * as ec2 from '@aws-cdk/aws-ec2';
import {SecurityGroup} from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import {ApplicationLoadBalancedFargateService} from '@aws-cdk/aws-ecs-patterns';
import * as secrets from '@aws-cdk/aws-secretsmanager';
import {Construct, DockerImage, RemovalPolicy} from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds';
import {DatabaseCluster} from '@aws-cdk/aws-rds';
import {Database} from './database';
import {DockerImageAsset} from '@aws-cdk/aws-ecr-assets';
import * as path from 'path';
import {DockerBuild} from './docker-build';

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
  databaseSecurityGroup: SecurityGroup;
  ecsCluster: ecs.Cluster;
  fargateService: ApplicationLoadBalancedFargateService;
  database: Database;
  dockerBuild: DockerBuild;

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

    this.databaseSecurityGroup = new SecurityGroup(
      this,
      `${id}DbSecurityGroup`,
      {
        securityGroupName: 'DatabaseSecurityGroup',
        description: 'Database ecurity Group',
        vpc: this.vpc,
        allowAllOutbound: true,
      },
    );

    this.database = new Database(this, id, {
      vpc: this.vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2,
        ec2.InstanceSize.SMALL,
      ),
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
      clusterName: `EcsCluster`,
    });

    const imagePath = path.join(__dirname, '..', '..', '..', 'node-api');

    this.dockerBuild = new DockerBuild(this, `${id}Dockerapp`, {
      imagePath: imagePath,
    });

    this.fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      'Service',
      {
        cluster: this.ecsCluster,
        memoryLimitMiB: 1024,
        taskImageOptions: {
          image: ecs.ContainerImage.fromEcrRepository(
            this.dockerBuild.image.repository,
          ),
        },

        publicLoadBalancer: true,
        desiredCount: props.apiOptions?.disiredCount,
        securityGroups: [this.fargateSecurityGroup],
      },
    );
  }
}
