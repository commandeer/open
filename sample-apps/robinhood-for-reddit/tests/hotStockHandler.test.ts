import { expect } from 'chai';
import LambdaTester from 'lambda-tester';
import { EventName } from '@/handlers/_base/types';
import { process as hotStockHandler } from '@/handlers/hotStock/hotStockHandler';

describe('Hot Stock Handler Tests', function () {
  this.timeout(300000);

  it('get the hot stocks', async () => {
    return LambdaTester(hotStockHandler).expectSucceed((result) => {
      expect(result).to.equal(true);
    });
  });

});