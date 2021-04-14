import {Construct, RemovalPolicy} from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as secrets from '@aws-cdk/aws-secretsmanager';

interface DatabaseProps {
  vpc: ec2.Vpc;
  instanceType: ec2.InstanceType;
}

export class Database extends Construct {
  public readonly databaseCluster: rds.DatabaseCluster;
  public readonly secret: rds.DatabaseSecret;

  constructor(scope: Construct, id: string, props: DatabaseProps) {
    super(scope, id);

    const {vpc, instanceType} = props;

    this.secret = new rds.DatabaseSecret(scope, `${id}DatabaseSecret`, {
      secretName: 'postgreeSecret',
      username: 'api',
    });

    this.databaseCluster = new rds.DatabaseCluster(scope, `${id}Database`, {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_12_4,
      }),
      credentials: rds.Credentials.fromGeneratedSecret('api'),

      instanceProps: {
        // optional , defaults to t3.medium
        instanceType,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE,
        },
        vpc,
      },
    });
  }
}
