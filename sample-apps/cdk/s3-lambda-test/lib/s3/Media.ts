import * as cdk from 'aws-cdk-lib';
import { aws_s3 as s3, RemovalPolicy } from 'aws-cdk-lib';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';
import { addOutput } from '../_helper';

export class Media {
  public readonly id = 'video';
  public readonly description = 'This is the S3 bucket for storing videos of users in the app';
  public instance: s3.Bucket;

  constructor(scope: Construct, props: any) {
    this.instance = new s3.Bucket(scope, this.id, {
      bucketName: `media-${props.envName.valueAsString}`,
      accessControl: s3.BucketAccessControl.PRIVATE,
      removalPolicy: RemovalPolicy.RETAIN
    });

    // setup the S3 Event connected to the bucket
    this.instance.addEventNotification(s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(props.lambda),
      { prefix: 'videos/' },
    );

    cdk.Tags.of(scope).add('Service', 'Media');
    cdk.Tags.of(scope).add('Environment', props.envName.valueAsString);

    // add output for the stack
    addOutput(scope, 'mediaBucket', this.instance.bucketName, this.description, this.id);
  }
}
