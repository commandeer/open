import { IFunctionConfiguration } from './IFunctionConfiguration';

export class FunctionConfiguration implements IFunctionConfiguration {
  roleArn?: string;

  constructor(configuration?: IFunctionConfiguration) {
    if (configuration) {
      if (configuration.roleArn) {
        this.roleArn = configuration.roleArn;
      }
    }
  }
}
