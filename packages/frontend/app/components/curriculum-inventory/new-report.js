import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { validatable, Length, NotBlank } from 'ilios-common/decorators/validation';
import { findById } from 'ilios-common/utils/array-helpers';
import { dropTask, restartableTask } from 'ember-concurrency';

@validatable
export default class CurriculumInventoryNewReportComponent extends Component {
  @service store;
  @service iliosConfig;
  @service intl;

  @tracked @NotBlank() @Length(1, 60) name;
  @tracked @NotBlank() @Length(1, 21844) description;
  @tracked selectedYear;
  @tracked years = [];
  @tracked academicYearCrossesCalendarYearBoundaries;

  constructor() {
    super(...arguments);
    this.description = this.intl.t('general.curriculumInventoryReport');
  }

  load = restartableTask(async () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    this.academicYearCrossesCalendarYearBoundaries = await this.iliosConfig.itemFromConfig(
      'academicYearCrossesCalendarYearBoundaries',
    );
    for (let id = currentYear - 5, n = currentYear + 5; id <= n; id++) {
      let title = id.toString();
      if (this.academicYearCrossesCalendarYearBoundaries) {
        title = title + ' - ' + (id + 1);
      }
      const year = { id, title };
      years.push(year);
    }
    this.years = years;
    this.selectedYear = findById(years, currentYear);
  });

  save = dropTask(async () => {
    this.addErrorDisplaysFor(['name', 'description']);
    const isValid = await this.isValid();
    if (!isValid) {
      return false;
    }
    const year = this.selectedYear.id;
    const startDate = this.academicYearCrossesCalendarYearBoundaries
      ? new Date(year, 6, 1)
      : new Date(year, 0, 1);
    const endDate = this.academicYearCrossesCalendarYearBoundaries
      ? new Date(year + 1, 5, 30)
      : new Date(year, 11, 31);
    const report = this.store.createRecord('curriculum-inventory-report', {
      name: this.name,
      program: this.args.currentProgram,
      year: year,
      startDate,
      endDate,
      description: this.description,
    });
    await this.args.save(report);
  });

  @action
  setSelectedYear(year) {
    const id = Number(year);
    this.selectedYear = findById(this.years, id);
  }

  keyboard = dropTask(async (ev) => {
    const keyCode = ev.keyCode;

    if (13 === keyCode) {
      await this.save.perform();
      return;
    }

    if (27 === keyCode) {
      this.args.cancel();
    }
  });
}
