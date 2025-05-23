import {
  attribute,
  blurrable,
  clickable,
  create,
  fillable,
  isPresent,
  isVisible,
  property,
  text,
  value,
} from 'ember-cli-page-object';

const definition = {
  scope: '[data-test-curriculum-inventory-report-header]',
  lockedName: text('[data-test-locked-name]'),
  hasLockOnName: isVisible('[data-test-locked-name] .fa-lock'),
  name: {
    scope: '[data-test-name]',
    value: text('span', { at: 0 }),
    isEditable: isVisible('[data-test-edit]'),
    set: fillable('input'),
    edit: clickable('[data-test-edit]'),
    save: clickable('.done'),
    cancel: clickable('.cancel'),
    hasError: isPresent('[data-test-name-validation-error-message]'),
    inputValue: value('input'),
    blur: blurrable('input'),
  },
  downloadLink: {
    scope: '[data-test-download]',
    link: attribute('href'),
  },
  canBeDownloaded: isVisible('[data-test-download]'),
  finalize: clickable('[data-test-finalize]'),
  finalizeButtonIsDisabled: property('disabled', '[data-test-finalize]'),
};

export default definition;
export const component = create(definition);
