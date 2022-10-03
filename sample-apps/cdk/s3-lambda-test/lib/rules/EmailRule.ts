import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { addOutput } from '../_helper';

export class EmailRule {
  public readonly id = 'emailRule';
  public readonly description = 'Email EventBridge Rule that calls the CRON email';
  public instance: events.Rule;

  constructor(scope: Construct, props: any) {
    this.instance = new events.Rule(scope, 'emailRule', {
      schedule: events.Schedule.expression('cron(0 17 ? * * *)'),
      description: 'Runs daily emails: Everyday, (9 AM PST - 10 AM PDT) / (12 PM EST 1PM EDT) (5 PM GMT)'
    });

    this.instance.addTarget(
      new targets.LambdaFunction(props.lambda, {
        event: events.RuleTargetInput.fromObject({ message: 'Hello Lambda' }),
      })
    )

    targets.addLambdaPermission(this.instance, props.lambda);

    cdk.Tags.of(scope).add('Service', 'User');
    cdk.Tags.of(scope).add('Environment', props.envName.valueAsString);

    // add output for the stack
    addOutput(scope, 'emailRuleName', this.instance.ruleName, this.description,`${this.id}Name`);
  }
}
