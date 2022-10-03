import * as cdk from 'aws-cdk-lib';
import { CfnOutputProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

/**
 * @description - add CDK outputs to the CloudFormation stack
 * @param scope
 * @param name 
 * @param value 
 * @param description 
 * @param exportName 
 */
export function addOutput(scope: Construct, name: string, value: string, description: string, exportName: string) {
  const props: CfnOutputProps = {
    value,
    description,
    exportName,
  };

  new cdk.CfnOutput(scope, name, props);
}