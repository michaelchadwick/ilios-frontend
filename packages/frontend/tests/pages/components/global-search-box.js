import {
  clickable,
  create,
  collection,
  fillable,
  hasClass,
  triggerable,
  value,
} from 'ember-cli-page-object';
import { hasFocus } from 'ilios-common';

const definition = {
  scope: '[data-test-global-search-box]',
  input: fillable('input'),
  inputValue: value('input'),
  inputHasFocus: hasFocus('input'),
  triggerInput: triggerable('keyup', 'input'),
  clickIcon: clickable('[data-test-search-icon]'),
  autocompleteResults: collection('[data-test-autocomplete-row]'),
  resultsRow1HasActiveClass: hasClass('active', '[data-test-autocomplete-row]:nth-of-type(1)'),
  resultsRow2HasActiveClass: hasClass('active', '[data-test-autocomplete-row]:nth-of-type(2)'),
  resultsRow3HasActiveClass: hasClass('active', '[data-test-autocomplete-row]:nth-of-type(3)'),
  keyDown: {
    scope: '[data-test-input]',
    enter: triggerable('keydown', '', { eventProperties: { key: 'Enter' } }),
    down: triggerable('keydown', '', { eventProperties: { key: 'ArrowDown' } }),
    up: triggerable('keydown', '', { eventProperties: { key: 'ArrowUp' } }),
    escape: triggerable('keydown', '', { eventProperties: { key: 'Escape' } }),
  },
};

export default definition;
export const component = create(definition);
