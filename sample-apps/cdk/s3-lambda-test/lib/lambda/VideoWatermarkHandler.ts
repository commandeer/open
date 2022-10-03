import * as cdk from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { addOutput } from '../_helper';
import * as path from 'path';

export class VideoWatermarkHandler {
  public readonly id = 'videoWatermarkHandler';
  public readonly description = 'Video Watermarking lambda that receives a video from the media bucket and saves it to the media-watermark bucket';
  public instance: NodejsFunction;

  constructor(scope: Construct, props: any) {
    this.instance = new NodejsFunction(scope, this.id, {
      description: this.description,
      functionName: this.id,
      runtime: lambda.Runtime.NODEJS_14_X,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(900), // 15 minutes
      handler: 'main',
      entry: path.join(__dirname, `/../../src/video/videoWatermarkHandler.ts`),
      environment: {
        VIDEO_ENV: process.env.VIDEO_ENV || 'dev',
        VERBOSE: process.env.VERBOSE || 'false',
      },
    });

    cdk.Tags.of(scope).add('Service', 'Media');
    cdk.Tags.of(scope).add('Environment', props.envName.valueAsString);

    // add output for the stack
    addOutput(scope, 'videoWatermarkHandlerLambdaName', this.instance.functionName, this.description,`${this.id}Name`);
    addOutput(scope, 'videoWatermarkHandlerLambdaArn', this.instance.functionArn, this.description,`${this.id}Arn`);
  }
}
