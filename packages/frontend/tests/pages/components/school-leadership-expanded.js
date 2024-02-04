import { clickable, create, text } from 'ember-cli-page-object';
import leadershipManager from 'ilios-common/page-objects/components/leadership-manager';
import leadershipList from 'ilios-common/page-objects/components/leadership-list';

const definition = {
  scope: '[data-test-school-leadership-expanded]',
  title: text('[data-test-title]'),
  collapse: clickable('[data-test-title]'),
  save: clickable('[data-test-save]'),
  cancel: clickable('[data-test-cancel]'),
  manage: clickable('[data-test-manage]'),
  leadershipManager,
  leadershipList,
};

export default definition;
export const component = create(definition);