import { jwtDecode, getAudienceClaimsFromDecodedJwt } from 'ilios-common/utils/jwt-utils';
import { module, test } from 'qunit';
import { jwtEncode } from 'ilios-common';

module('Unit | Utility | jwt-utils', function () {
  test('it decodes a token', function (assert) {
    const token = jwtEncode({ sub: '1234567890', name: 'John Doe', admin: true });
    const obj = jwtDecode(token);
    assert.strictEqual(obj.sub, '1234567890');
    assert.strictEqual(obj.name, 'John Doe');
    assert.true(obj.admin);
  });

  test.each(
    'get audience claims from decoded token',
    [
      [{}, []],
      [{ aud: null }, []],
      [{ aud: [] }, []],
      [{ aud: 'ilios' }, ['ilios']],
      [{ aud: ['ilios'] }, ['ilios']],
      [{ aud: ['ilios', 'lti'] }, ['ilios', 'lti']],
    ],
    function (assert, [decodedJwt, expectedAudiences]) {
      assert.deepEqual(getAudienceClaimsFromDecodedJwt(decodedJwt), expectedAudiences);
    },
  );
});
