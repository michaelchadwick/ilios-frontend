import { create, collection, clickable, fillable, text } from 'ember-cli-page-object';

const definition = {
  scope: '[data-test-program-new]',
  title: {
    scope: '[data-test-title]',
    label: text(),
    set: fillable('input'),
    errors: collection('[data-test-title-validation-error-message]'),
  },
  done: {
    scope: '[data-test-done]',
    click: clickable(),
  },
  cancel: {
    scope: '[data-test-cancel]',
    click: clickable(),
  },
};

export default definition;
export const component = create(definition);
