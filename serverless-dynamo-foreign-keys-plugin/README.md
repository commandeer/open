# Serverless Dynamo Stream Plugin

Creates Tags for a DynamoDB table that explains the entiry relationship.

## Purpose

Allows you to view relationships between tables.  While DynamoDB is a NoSQL database, having
foreign keys clearly defined helps to have a better working model of your system.

## Install

### Install the plugin

Using your favorite package manager, simply install the package into your project.

```
yarn install serverless-dynamo-foreign-keys-plugin
```

or

```
npm install serverless-dynamo-foreign-keys-plugin
```

### Add to serverless.yml

Add the plugin to the `plugins` section in `serverless.yml` file.

```
...
plugins:
  - serverless-dynamo-foreign-keys-plugin
...
```

## Usage

### existingDynamoStream event

The plugin adds a new type of field for your Dynamo tables called `relationships`.
This event accepts the column name, the foreign table name, and the foreign table column to relate to.
Here is how you can configure your `Team` DynamoDB table to connect to the `User` DynamoDB table.

```yaml
resources:
  Resources:
    teamsTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: Team
        AttributeDefinitions:
          - AttributeName: name
            AttributeType: S
          - AttributeName: teamId
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
        Relationships:
          - ColumnName: teamId
            RelatedTableName: Team
            RelatedTableId: Id
```

## Running

There are two ways to run the plugin.

1) `sls deploy`

The plugin runs automatically after the deploy phase.
If you deploy your Serverless infrastructure using the `sls deploy` command,
the plugin starts running automatically once the deploy is finished.

2) `sls foreign-keys`

In case you would like to run the plugin on demand, there is a separate command for it called `foreign-keys`.
Running `sls foreign-keys` will not run the deploy and it will only put the data into the tags for the DynamoDB tables.

## Release

Initially developed at [Commandeer](https://getcommandeer.com) and now Open Sourced for everyone to use.
