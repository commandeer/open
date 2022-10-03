#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { VideoS3 } from '../lib';

/******************************************************************************
 * Environment Information - see https://docs.aws.amazon.com/cdk/latest/guide/environments.html
 * If you don't specify 'env', this stack will be environment-agnostic.
 * Account/Region-dependent features and context lookups will not work,
 * but a single synthesized template can be deployed anywhere.
 ********************************************************************************/

 const app = new cdk.App();
 const props = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
};

new VideoS3(app, 'VideoS3', {
  description: 'Video S3 Buckets',
  ...props
});
