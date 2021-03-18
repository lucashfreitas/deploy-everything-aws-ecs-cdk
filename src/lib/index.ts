
import * as cdk from '@aws-cdk/core';

import { ApiStack } from './backend/api-stack';



const app = new cdk.App();

new ApiStack(app,"NodeJsApiStack", {
    appName: "nodeJs"
})


