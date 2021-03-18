
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { ApiLoadBalancer } from './load-balancer';




interface ApiStackProps extends cdk.StackProps {
    appName: string;

}

export class ApiStack extends cdk.Stack {

    vpc: ec2.Vpc
    elb: ApiLoadBalancer;

    constructor(scope: cdk.App, id: string, props: ApiStackProps) {
        super(scope, id, props)

        this.vpc = new ec2.Vpc(this, `${id}Vpc` , {
            cidr: '172.31.0.0/16'
        })
        
        this.elb = new ApiLoadBalancer(this, `${id}LoadBalancer`, {
            vpc: this.vpc
        })
           

        }


    



}

