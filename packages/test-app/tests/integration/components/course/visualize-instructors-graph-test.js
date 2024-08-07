import { module, test } from 'qunit';
import { setupRenderingTest } from 'test-app/tests/helpers';
import { render, waitFor } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'test-app/tests/test-support/mirage';
import { component } from 'ilios-common/page-objects/components/course/visualize-instructors-graph';

module('Integration | Component | course/visualize-instructors-graph', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const instructor1 = this.server.create('user', { displayName: 'Marie' });
    const instructor2 = this.server.create('user', { displayName: 'Daisy' });
    const instructor3 = this.server.create('user', { displayName: 'Duke' });
    const instructor4 = this.server.create('user', {
      displayName: 'William',
    });

    const course = this.server.create('course');
    const session1 = this.server.create('session', {
      title: 'Berkeley Investigations',
      course,
    });
    const session2 = this.server.create('session', {
      title: 'The San Leandro Horror',
      course,
    });
    this.server.create('offering', {
      session: session1,
      startDate: new Date('2019-12-08T12:00:00'),
      endDate: new Date('2019-12-08T17:00:00'),
      instructors: [instructor1],
    });
    this.server.create('offering', {
      session: session1,
      startDate: new Date('2019-12-21T12:00:00'),
      endDate: new Date('2019-12-21T17:30:00'),
      instructors: [instructor1, instructor4],
    });
    this.server.create('offering', {
      session: session2,
      startDate: new Date('2019-12-05T18:00:00'),
      endDate: new Date('2019-12-05T21:00:00'),
      instructors: [instructor1, instructor2, instructor3, instructor4],
    });

    this.courseModel = await this.owner.lookup('service:store').findRecord('course', course.id);
  });

  test('it renders', async function (assert) {
    this.set('course', this.courseModel);

    await render(hbs`<Course::VisualizeInstructorsGraph @course={{this.course}} @isIcon={{false}} />
`);
    //let the chart animations finish
    await waitFor('.loaded');
    await waitFor('svg .bars');

    assert.strictEqual(component.chart.bars.length, 4);
    assert.strictEqual(component.chart.labels.length, 4);
    assert.strictEqual(component.chart.labels[0].text, 'Daisy: 180 Minutes');
    assert.strictEqual(component.chart.labels[1].text, 'Duke: 180 Minutes');
    assert.strictEqual(component.chart.labels[2].text, 'William: 510 Minutes');
    assert.strictEqual(component.chart.labels[3].text, 'Marie: 810 Minutes');
  });

  test('filter applies', async function (assert) {
    this.set('name', 'Marie');
    this.set('course', this.courseModel);

    await render(
      hbs`<Course::VisualizeInstructorsGraph @course={{this.course}} @filter={{this.name}} @isIcon={{false}} />
`,
    );
    //let the chart animations finish
    await waitFor('.loaded');
    await waitFor('svg .bars');

    assert.strictEqual(component.chart.bars.length, 1);
    assert.strictEqual(component.chart.labels.length, 1);
    assert.strictEqual(component.chart.labels[0].text, 'Marie: 810 Minutes');
  });

  test('it renders as donut chart', async function (assert) {
    this.set('course', this.courseModel);

    await render(
      hbs`<Course::VisualizeInstructorsGraph @course={{this.course}} @isIcon={{false}} @chartType="donut" />
`,
    );
    //let the chart animations finish
    await waitFor('.loaded');
    await waitFor('svg .slice');

    assert.strictEqual(component.chart.slices.length, 4);
    assert.strictEqual(component.chart.slices[0].text, 'Daisy: 180 Minutes');
    assert.strictEqual(component.chart.slices[1].text, 'Duke: 180 Minutes');
    assert.strictEqual(component.chart.slices[2].text, 'William: 510 Minutes');
    assert.strictEqual(component.chart.slices[3].text, 'Marie: 810 Minutes');
  });
});
