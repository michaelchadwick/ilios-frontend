import { clickable, count, create, collection, text } from 'ember-cli-page-object';
import objectives from './objectives';
import learningMaterials from '../detail-learning-materials';
import meshTerms from '../mesh-terms';
import taxonomies from '../detail-taxonomies';
import collapsedTaxonomies from '../collapsed-taxonomies';
import leadershipCollapsed from '../leadership-collapsed';
import leadershipExpanded from '../leadership-expanded';
import collapsedCompetencies from '../collapsed-competencies';
import overview from './overview';
import header from './header';

export default create({
  scope: '[data-test-ilios-course-details]',
  collapseControl: clickable('[data-test-expand-course-details]'),
  titles: count('.title'),
  header,
  overview,
  leadershipCollapsed,
  leadershipExpanded,
  objectives,
  learningMaterials,
  meshTerms,
  taxonomies,
  collapsedTaxonomies,
  cohorts: {
    scope: '[data-test-detail-cohorts]',
    manage: clickable('.actions button'),
    save: clickable('.actions button.bigadd'),
    cancel: clickable('.actions button.bigcancel'),
    current: collection('table tbody tr', {
      school: text('td', { at: 0 }),
      program: text('td', { at: 1 }),
      cohort: text('td', { at: 2 }),
      level: text('td', { at: 3 }),
    }),
    selected: collection('.selected-cohorts li', {
      name: text(),
      remove: clickable('button'),
    }),
    selectable: collection('.selectable-cohorts li', {
      name: text(),
      add: clickable('button'),
    }),
  },
  collapsedCompetencies,
});
