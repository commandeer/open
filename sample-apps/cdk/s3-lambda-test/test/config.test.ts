import { expect } from 'chai';
import { Config, Environment } from '../src/config';

describe('Config Tests', () => {

  it('Initialize config with local environment', async () => {
    const configSetting = {
      environment: Environment.LOCAL,
    };

    const config = new Config(configSetting);

    expect(configSetting.environment).to.equal(config.environment);
    expect(config.isLocal).to.equal(true);
    expect(config.isDevelopment).to.equal(false);
  });
});
