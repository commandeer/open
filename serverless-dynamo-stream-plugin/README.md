# Serverless Dynamo Stream Plugin

Creates and connects DynamoDB streams for pre-existing tables with AWS Lambdas using Serverless.

## Purpose

This plugin allows you to connect a DynamoDB stream to a Lambda for a table that exists outside of Serverless code.  Meaning if you have a DynamoDB table being created via Ansible, Terraform, or another IaC tool, this will allow you to then connect it to a Lambda.

Note: Serverless can only connect tables created within Serverless, and it will throw an error if the table already exists.  Because DynamoDB tables are not usually ephemeral, this plugin is needed for most use cases.

## Install

### Install the plugin

Using your favorite package manager, simply install the package into your project.

```
yarn install serverless-dynamo-stream-plugin
```

or

```
npm install serverless-dynamo-stream-plugin
```

### Add to serverless.yml

Add the plugin to the `plugins` section in `serverless.yml` file.

```
...
plugins:
  - serverless-dynamo-stream-plugin
...
```

## Usage

### existingDynamoStream event

The plugin adds a new type of event for your Dynamo tables called `existingDynamoStream`.
This event accepts the table name and some other parameters (more optional parameters to come in the future).
Here is how you can configure your `tankHandler` Lambda to connect to `Battle` DynamoDB table stream.

```yaml
tankHandler:
  handler: handlers/dynamo-streams/tankHandler.process
  events:
    - existingDynamoStream:
        tableName: Battle
        streamType: NEW_IMAGE
        startingPosition: LATEST
```

## Running

There are two ways to run the plugin.

1) `sls deploy`

The plugin runs automatically after the deploy phase.
If you deploy your Serverless infrastructure using the `sls deploy` command,
the plugin starts running automatically once the deploy is finished.

2) `sls dynamo-stream`

In case you would like to run the plugin on demand, there is a separate command for it called `dynamo-stream`.
Running `sls dynamo-stream` will not run the deploy and it will only try to connect the lambdas to your DynamoDB streams.
Please note that the plugin relies on having a successful serverless deploy first.
Meaning that before running your `dynamo-stream` command,
you'll need to make sure all lambdas are already deployed by Serverless.

## Release

Initially developed at [Commandeer](https://getcommandeer.com) and now Open Sourced for everyone to use.
