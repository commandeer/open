# Battle Tanks

- The Commandeer Open Source Tank Demo

This website is an example of how to build a Commandeer Service.  This can be a great resource if you wanted to implement the use of another service into the Commandeer ecosystem.

The sample service consists of tanks and a battle service.  Currently you can view a list of tanks and view the details of the tank.  These serve as the building blocks for how you can submit a service to Commandeer to have it integrated into the system.

If you would like to make any enhancements to this, simply submit a PR to develoment, and one of our teammates will git it merged.

## Important Links
- [Tank Demo Website](https://tanks.getcommandeer.com)
- [Submit Issues](https://github.com/commandeer/open/issues)
- [Submit a Service to Commandeer Instructions](https://getcommandeer.com/docs/openSource/submitService)

![Tank Service Animation](https://commander-development-images.s3.amazonaws.com/tank-service-2.gif)
> Tank Service running on http://localhost:8081 after running `yarn install && yarn serve`

## Service Ideas
- redis
- mongodb
- elasticache
- postgres/mysql

## Other Links
- [Vue Cli Configuration Reference](https://cli.vuejs.org/config/)

## Project setup

```
# Install Dependencies
yarn install

# Compiles and hot-reloads for development
# Note; This defaults to http://localhost:8081
yarn serve

# Compiles and minifies for production
yarn build

# Lints and fixes files
yarn run lint

# Run your end-to-end tests
yarn run test:e2e

# Run your unit tests
yarn run test:unit
```

### Deployment

```
# Prerequisites
yarn add -g firebase-tools
firebase login # connect to your own firebase app to install

# Deploy
yarn deploy
```

### System Structure