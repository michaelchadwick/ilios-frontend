import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | sessions-grid-offering', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    const offering = {};
    this.set('offering', offering);
    await render(hbs`<SessionsGridOffering @offering={{this.offering}} />`);

    assert.dom(this.element).hasText('');
  });
});
