import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { setupMirage } from 'frontend/tests/test-support/mirage';
import { component } from 'frontend/tests/pages/components/reports/subject/new/program-year';
import ProgramYear from 'frontend/components/reports/subject/new/program-year';
import noop from 'ilios-common/helpers/noop';

module('Integration | Component | reports/subject/new/program-year', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.intl = this.owner.lookup('service:intl');
    const [school1, school2] = this.server.createList('school', 2);
    const program1 = this.server.create('program', { school: school1 });
    const program2 = this.server.create('program', { school: school2, duration: 7 });
    this.server.create('program-year', {
      startYear: 2006,
      program: program1,
    });
    this.server.create('program-year', {
      startYear: 2007,
      program: program1,
    });
    this.server.create('program-year', {
      startYear: 2020,
      program: program2,
    });
    this.server.create('program-year', {
      startYear: 2004,
      program: program1,
    });
  });

  test('it renders', async function (assert) {
    assert.expect(15);
    this.set('currentId', null);
    this.set('changeId', (id) => {
      assert.strictEqual(id, '3');
      this.set('currentId', id);
    });
    await render(
      <template>
        <ProgramYear @currentId={{this.currentId}} @changeId={{this.changeId}} @school={{null}} />
      </template>,
    );

    assert.strictEqual(component.options.length, 5);
    assert.strictEqual(component.options[0].text, this.intl.t('general.selectPolite'));
    assert.ok(component.options[0].isSelected);
    assert.strictEqual(component.value, '');

    assert.strictEqual(component.options[1].text, '2027 program 1');
    assert.notOk(component.options[1].isSelected);
    assert.strictEqual(component.options[2].text, '2011 program 0');
    assert.notOk(component.options[2].isSelected);
    assert.strictEqual(component.options[3].text, '2010 program 0');
    assert.notOk(component.options[3].isSelected);
    assert.strictEqual(component.options[4].text, '2008 program 0');
    assert.notOk(component.options[4].isSelected);

    this.set('currentId', '2');
    assert.notOk(component.options[0].isSelected);
    assert.ok(component.options[2].isSelected);
    assert.strictEqual(component.value, '2');
  });

  test('it works', async function (assert) {
    assert.expect(5);
    this.set('currentId', '3');
    await render(
      <template>
        <ProgramYear @currentId={{this.currentId}} @changeId={{this.changeId}} @school={{null}} />
      </template>,
    );
    this.set('changeId', (id) => {
      assert.strictEqual(id, '1');
      this.set('currentId', id);
    });
    assert.ok(component.options[1].isSelected);
    await component.set('1');
    assert.notOk(component.options[0].isSelected);
    assert.ok(component.options[3].isSelected);
    assert.strictEqual(component.value, '1');
  });

  test('it filters by school', async function (assert) {
    assert.expect(9);
    const schoolModel = await this.owner.lookup('service:store').findRecord('school', 1);
    this.set('currentId', null);
    this.set('school', schoolModel);
    this.set('changeId', (id) => {
      assert.strictEqual(id, '2');
      this.set('currentId', id);
    });
    await render(
      <template>
        <ProgramYear
          @currentId={{this.currentId}}
          @changeId={{this.changeId}}
          @school={{this.school}}
        />
      </template>,
    );

    assert.strictEqual(component.options.length, 4);
    assert.strictEqual(component.options[0].text, this.intl.t('general.selectPolite'));
    assert.ok(component.options[0].isSelected);
    assert.strictEqual(component.options[1].text, '2011 program 0');
    assert.notOk(component.options[1].isSelected);
    assert.strictEqual(component.options[2].text, '2010 program 0');
    assert.notOk(component.options[2].isSelected);
    assert.strictEqual(component.options[3].text, '2008 program 0');
    assert.notOk(component.options[3].isSelected);
  });

  test('changing school resets default value', async function (assert) {
    assert.expect(4);
    const schoolModels = await this.owner.lookup('service:store').findAll('school');
    this.set('school', schoolModels[0]);
    await render(
      <template>
        <ProgramYear @currentId={{null}} @changeId={{noop}} @school={{this.school}} />
      </template>,
    );

    assert.strictEqual(component.options[0].text, this.intl.t('general.selectPolite'));
    this.set('school', schoolModels[1]);
    assert.strictEqual(component.options[0].text, this.intl.t('general.selectPolite'));
    this.set('school', null);
    assert.strictEqual(component.options[0].text, this.intl.t('general.selectPolite'));
    this.set('school', schoolModels[0]);
    assert.strictEqual(component.options[0].text, this.intl.t('general.selectPolite'));
  });
});
