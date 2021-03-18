import * as ec2 from "@aws-cdk/aws-ec2";
import * as elb2 from "@aws-cdk/aws-elasticloadbalancingv2";
import { Construct } from "@aws-cdk/core";


export interface LoadBalancerProps {
    vpc: ec2.IVpc
}


export class ApiLoadBalancer extends Construct {

    public readonly loadBalancer: elb2.ApplicationLoadBalancer;

    constructor(scope: Construct, id: string, props:LoadBalancerProps ) {
        super(scope,id)

        this.loadBalancer = new elb2.ApplicationLoadBalancer(this, id, {
            vpc: props.vpc,
            internetFacing: true,
        })
    }

}