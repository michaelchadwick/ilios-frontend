import Component from '@glimmer/component';
import { action } from '@ember/object';
import { deprecate } from '@ember/debug';
import { DateTime } from 'luxon';
import isArray from 'ember-truth-helpers/helpers/is-array';
import WeeklyCalendar from 'ilios-common/components/weekly-calendar';
import noop from 'ilios-common/helpers/noop';
import IliosCalendarMultidayEvents from 'ilios-common/components/ilios-calendar-multiday-events';

export default class IliosCalendarWeekComponent extends Component {
  get date() {
    if (typeof this.args.date === 'string') {
      deprecate(`String passed to IliosCalendarWeek @date instead of Date`, false, {
        id: 'common.dates-no-strings',
        for: 'ilios-common',
        until: '72',
        since: '71',
      });
      return DateTime.fromISO(this.args.date).toJSDate();
    }

    return this.args.date;
  }

  get ilmPreWorkEvents() {
    const preWork = this.args.calendarEvents.reduce((arr, ev) => {
      if (!ev.isBlanked && ev.isPublished && !ev.isScheduled) {
        arr = [...arr, ...ev.prerequisites];
      }
      return arr;
    }, []);

    return preWork
      .filter((ev) => ev.ilmSession)
      .filter((ev) => {
        return !ev.isBlanked && ev.isPublished && !ev.isScheduled;
      });
  }

  get nonIlmPreWorkEvents() {
    return this.args.calendarEvents.filter((ev) => {
      return ev.postrequisites.length === 0 || !ev.ilmSession;
    });
  }
  get singleDayEvents() {
    return this.nonIlmPreWorkEvents.filter((event) =>
      DateTime.fromISO(event.startDate).hasSame(DateTime.fromISO(event.endDate), 'day'),
    );
  }
  get multiDayEventsList() {
    return this.nonIlmPreWorkEvents.filter(
      (event) => !DateTime.fromISO(event.startDate).hasSame(DateTime.fromISO(event.endDate), 'day'),
    );
  }

  @action
  changeToDayView(date) {
    if (this.args.areDaysSelectable && this.args.changeDate && this.args.changeView) {
      this.args.changeDate(date);
      this.args.changeView('day');
    }
  }
  <template>
    {{#if (isArray @calendarEvents)}}
      <div class="ilios-calendar-week" data-test-ilios-calendar-week>
        <WeeklyCalendar
          @isLoadingEvents={{@isLoadingEvents}}
          @date={{this.date}}
          @events={{this.singleDayEvents}}
          @changeToDayView={{if @areDaysSelectable this.changeToDayView (noop)}}
          @selectEvent={{if @areEventsSelectable @selectEvent (noop)}}
        />
        <IliosCalendarMultidayEvents
          @events={{this.multiDayEventsList}}
          @selectEvent={{@selectEvent}}
          @areEventsSelectable={{@areDaysSelectable}}
        />
      </div>
    {{/if}}
  </template>
}
