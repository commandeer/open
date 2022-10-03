# Welcome to the Video Backend Project!

This project handles the creation of the Video infrastructure using CDK.

The CDK files are located in the ./bin and ./lib folders.  These are used to create the stack.  The stack can be created on AWS or on LocalStack.

The Lambda code is located in the ./src folder.

All tests for the code are located in the ./test folder.

## Useful commands

 * `yarn build`   compile typescript to js
 * `yarn watch`   watch for changes and compile
 * `yarn test`    perform the unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## Setup

  ```
  npm install -g aws-cdk-local aws-cdk

  cdklocal --version
  ```

## LocalStack Deploy
  ```
    # Set these in your .aws/credentials file
      [default]
      aws_access_key_id = test
      aws_secret_access_key = test

    yarn build
    cdklocal boostrap
    yarn deply:lcl
  ```

## AWS Deploy
  ```
    # Need to set for the proper environment
    VIDEO_ENV=dev
    CDK_DEFAULT_ACCOUNT=accountId

    cdk bootstrap aws://ACCOUNT_ID/REGION
    yarn deploy
  ```
