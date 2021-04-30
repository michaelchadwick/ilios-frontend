import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import { component } from 'ilios/tests/pages/components/instructor-groups/new';

module('Integration | Component | instructor-groups/new', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<InstructorGroups::New
      @save={{noop}}
      @cancel={{noop}}
    />`);
    assert.equal(component.title.label, 'Title:');
    assert.equal(component.done.text, 'Done');
    assert.equal(component.cancel.text, 'Cancel');
    await a11yAudit(this.element);
  });

  test('cancel', async function (assert) {
    assert.expect(1);
    this.set('cancel', () => {
      assert.ok(true, 'cancel fired.');
    });
    await render(hbs`<InstructorGroups::New
      @save={{noop}}
      @cancel={{this.cancel}}
    />`);
    await component.cancel.click();
  });

  test('validation fails, no title', async function (assert) {
    assert.expect(3);

    await render(hbs`<InstructorGroups::New
      @save={{noop}}
      @cancel={{noop}}
    />`);
    assert.equal(component.title.errors.length, 0);
    await component.done.click();
    assert.equal(component.title.errors.length, 1);
    assert.equal(component.title.errors[0].text, 'This field can not be blank');
  });

  test('validation fails, title too short', async function (assert) {
    assert.expect(3);

    await render(hbs`<InstructorGroups::New
      @save={{noop}}
      @cancel={{noop}}
    />`);
    assert.equal(component.title.errors.length, 0);
    await component.title.set('Aa');
    await component.done.click();
    assert.equal(component.title.errors.length, 1);
    assert.equal(
      component.title.errors[0].text,
      'This field is too short (minimum is 3 characters)'
    );
  });

  test('validation fails, title too long', async function (assert) {
    assert.expect(3);

    await render(hbs`<InstructorGroups::New
      @save={{noop}}
      @cancel={{noop}}
    />`);
    assert.equal(component.title.errors.length, 0);
    await component.title.set('0123456789'.repeat(21));
    await component.done.click();
    assert.equal(component.title.errors.length, 1);
    assert.equal(
      component.title.errors[0].text,
      'This field is too long (maximum is 60 characters)'
    );
  });

  test('save', async function (assert) {
    assert.expect(2);
    this.set('save', async (instructorGroup) => {
      assert.equal(instructorGroup.title, 'Jayden Rules!');
      assert.equal(await instructorGroup.school, this.schoolModel);
    });

    await render(hbs`<InstructorGroups::New
      @save={{this.save}}
      @cancel={{noop}}
    />`);
    await component.title.set('Jayden Rules!');
    await component.done.click();
  });
});