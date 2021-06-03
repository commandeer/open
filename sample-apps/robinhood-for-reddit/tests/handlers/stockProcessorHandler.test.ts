import { expect } from 'chai';
import LambdaTester from 'lambda-tester';
import { process as stockProcessorHandler } from '../../handlers/stockProcessor/stockProcessorHandler';

describe('Stock Procesoor Handler Tests', function () {
  this.timeout(300000);

  it('load the hot stocks', async () => {
    return LambdaTester(stockProcessorHandler).expectSucceed((result) => {
      expect(result).to.equal(true);
    });
  });

});
