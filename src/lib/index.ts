
import * as cdk from '@aws-cdk/core';
import { Environment } from '@aws-cdk/core/lib/environment';

import { ApiStack } from './backend/api-stack';
import { appName } from './utils';

import * as dotenv from "dotenv"

const env: Environment =  {
    account: process.env.CDK_DEPLOY_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION 

}

dotenv.config();

const app = new cdk.App();

new ApiStack(app,appName("NodeJsApiStack"), {
    env

})


