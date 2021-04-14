import { expect as expectCDK, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { ApiStack } from '../backend/api-stack';


/*
 * Example test 
 */
test('SNS Topic Created', () => {
  const app = new cdk.App();
  const stack = new ApiStack(app, "MyTestConstruct", {
  })
  
  // THEN
  expectCDK(stack).to(countResources("AWS::SNS::Topic",0));
});
