import { expect } from 'chai';
import LambdaTester from 'lambda-tester';
import { process as tankDynamoStreamHandler } from '../../../handlers/dynamo-streams/tankDynamoStreamHandler';

describe('Tank Dynamo Stream Handler Tests', function () {

  it('send a message to the invite handler', async () => {
    const event = {
      Records: [{
        id: 'test',
      }]
    };

    return LambdaTester(tankDynamoStreamHandler).event(event).expectResult((result) => {
      const status = result.body;

      expect(result.statusCode).to.equal(200);
      expect(status).to.equal('true');
    });
  });

});
