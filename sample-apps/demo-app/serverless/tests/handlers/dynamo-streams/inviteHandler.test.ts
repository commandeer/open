import { expect } from 'chai';
import LambdaTester from 'lambda-tester';
import { EventName, process as inviteHandler } from '../../../handlers/dynamo-streams/inviteHandler';
import { eventNames } from 'cluster';

describe('Invite Handler Tests', function () {

  it('send a message to the invite handler', async () => {
    const event = {
      Records: [{
        eventName: EventName.INSERT,
        id: 'test',
      }]
    };

    return LambdaTester(inviteHandler).event(event).expectResult((result) => {
      const status = result.body;

      expect(result.statusCode).to.equal(200);
      expect(status).to.equal('true');
    });
  });

});
