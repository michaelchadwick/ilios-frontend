import {
  collection,
  clickable,
  create,
  fillable,
  isPresent,
  property,
  text,
  triggerable,
  value,
} from 'ember-cli-page-object';
import { flatpickrDatePicker } from 'ilios-common';
import yesNoToggle from 'ilios-common/page-objects/components/toggle-yesno';

const definition = {
  scope: '[data-test-curriculum-inventory-new-sequence-block]',
  title: {
    scope: '[data-test-title]',
    label: text('label'),
    value: value('input'),
    set: fillable('input'),
    hasError: isPresent('[data-test-title-validation-error-message]'),
    error: text('[data-test-title-validation-error-message]'),
    save: triggerable('keyup', 'input', { eventProperties: { key: 'Enter' } }),
    cancel: triggerable('keyup', 'input', { eventProperties: { key: 'Escape' } }),
  },
  course: {
    scope: '[data-test-course]',
    label: text('label'),
    value: value('select'),
    select: fillable('select'),
    options: collection('option', {
      isSelected: property('selected'),
    }),
    details: {
      scope: '[data-test-course-details]',
    },
  },
  description: {
    scope: '[data-test-description]',
    label: text('label'),
    set: fillable('textarea'),
    value: text('textarea'),
  },
  required: {
    scope: '[data-test-required]',
    label: text('label'),
    value: value('select'),
    select: fillable('select'),
    options: collection('option', {
      isSelected: property('selected'),
    }),
  },
  track: {
    scope: '[data-test-track]',
    label: text('label'),
    yesNoToggle,
  },
  duration: {
    scope: '[data-test-duration]',
    label: text('label'),
    value: value('input'),
    set: fillable('input'),
    hasError: isPresent('[data-test-duration-validation-error-message]'),
    error: text('[data-test-duration-validation-error-message]'),
    save: triggerable('keyup', 'input', { eventProperties: { key: 'Enter' } }),
    cancel: triggerable('keyup', 'input', { eventProperties: { key: 'Escape' } }),
  },
  startDate: {
    scope: '[data-test-startdate]',
    label: text('label'),
    value: value('input'),
    set: flatpickrDatePicker('input'),
    hasError: isPresent('[data-test-start-date-validation-error-message]'),
    error: text('[data-test-start-date-validation-error-message]'),
  },
  endDate: {
    scope: '[data-test-enddate]',
    label: text('label'),
    value: value('input'),
    set: flatpickrDatePicker('input'),
    hasError: isPresent('[data-test-end-date-validation-error-message]'),
    error: text('[data-test-end-date-validation-error-message]'),
  },
  clearDates: clickable('[data-test-clear-dates]'),
  minimum: {
    scope: '[data-test-minimum]',
    label: text('label'),
    value: value('input'),
    set: fillable('input'),
    hasError: isPresent('[data-test-minimum-validation-error-message]'),
    error: text('[data-test-minimum-validation-error-message]'),
    save: triggerable('keyup', 'input', { eventProperties: { key: 'Enter' } }),
    cancel: triggerable('keyup', 'input', { eventProperties: { key: 'Escape' } }),
  },
  maximum: {
    scope: '[data-test-maximum]',
    label: text('label'),
    value: value('input'),
    set: fillable('input'),
    hasError: isPresent('[data-test-maximum-validation-error-message]'),
    error: text('[data-test-maximum-validation-error-message]'),
    save: triggerable('keyup', 'input', { eventProperties: { key: 'Enter' } }),
    cancel: triggerable('keyup', 'input', { eventProperties: { key: 'Escape' } }),
  },
  startLevel: {
    scope: '[data-test-starting-academic-level]',
    label: text('label'),
    value: value('select'),
    select: fillable('select'),
    options: collection('option', {
      isSelected: property('selected'),
    }),
    hasError: isPresent('[data-test-start-level-validation-error-message]'),
    error: text('[data-test-start-level-validation-error-message]'),
  },
  endLevel: {
    scope: '[data-test-ending-academic-level]',
    label: text('label'),
    value: value('select'),
    select: fillable('select'),
    options: collection('option', {
      isSelected: property('selected'),
    }),
    hasError: isPresent('[data-test-end-level-validation-error-message]'),
    error: text('[data-test-end-level-validation-error-message]'),
  },
  childSequenceOrder: {
    scope: '[data-test-child-sequence-order]',
    label: text('label'),
    value: value('select'),
    select: fillable('select'),
    options: collection('option', {
      isSelected: property('selected'),
    }),
  },
  orderInSequence: {
    scope: '[data-test-order-in-sequence]',
    label: text('label'),
    value: value('select'),
    select: fillable('select'),
    options: collection('option', {
      isSelected: property('selected'),
    }),
  },
  save: clickable('[data-test-save]'),
  cancel: clickable('[data-test-cancel]'),
};

export default definition;
export const component = create(definition);
