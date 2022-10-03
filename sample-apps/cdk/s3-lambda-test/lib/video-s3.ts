import * as cdk from 'aws-cdk-lib';
import { CfnParameter } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from './lambda';
import * as s3 from './s3';

export class VideoS3 extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const extraProps: any = {};

    // set the environment name and account id;
    const envName = new CfnParameter(this, 'envName', { type: 'String', description: 'The name of the Environment.' });
    const accountId = new CfnParameter(this, 'accountId', { type: 'String', description: 'AWS Account Id.' });

    extraProps.envName = envName;
    extraProps.accountId = accountId;

    /* Media Buckets */

    // setup the video watermark lambda handler
    const videoWatermarkLambda = new lambda.VideoWatermarkHandler(this, extraProps);
    extraProps.lambda = videoWatermarkLambda.instance;

    // setup bucket to write media files to, including connecting
    // the videos location to the videoWatermarkLambda
    new s3.Media(this, extraProps);
  }
}
