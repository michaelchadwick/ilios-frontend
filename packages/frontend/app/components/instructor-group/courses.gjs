import Component from '@glimmer/component';
import { TrackedAsyncData } from 'ember-async-data';
import { cached } from '@glimmer/tracking';
import { service } from '@ember/service';
import t from 'ember-intl/helpers/t';
import sortBy from 'ilios-common/helpers/sort-by';
import { LinkTo } from '@ember/routing';
import FaIcon from 'ilios-common/components/fa-icon';
import add from 'ember-math-helpers/helpers/add';

export default class InstructorGroupCoursesComponent extends Component {
  @service iliosConfig;

  crossesBoundaryConfig = new TrackedAsyncData(
    this.iliosConfig.itemFromConfig('academicYearCrossesCalendarYearBoundaries'),
  );

  @cached
  get academicYearCrossesCalendarYearBoundaries() {
    return this.crossesBoundaryConfig.isResolved ? this.crossesBoundaryConfig.value : false;
  }
  <template>
    <section class="instructor-group-courses" data-test-instructor-group-courses ...attributes>
      <div class="instructor-group-courses-header">
        <h3 class="title" data-test-title>
          {{t "general.associatedCourses"}}
          ({{@instructorGroup.courses.length}})
        </h3>
      </div>
      {{#if @instructorGroup.courses.length}}
        <div class="instructor-group-courses-content">
          <ul class="instructor-group-courses-list" data-test-courses-list>
            {{#each (sortBy "title" @instructorGroup.courses) as |course|}}
              <li data-test-course>
                <LinkTo @route="course" @model={{course}}>
                  <FaIcon @icon="square-up-right" />
                  {{course.title}}
                  {{#if this.academicYearCrossesCalendarYearBoundaries}}
                    ({{course.year}}
                    -
                    {{add course.year 1}})
                  {{else}}
                    ({{course.year}})
                  {{/if}}
                </LinkTo>
              </li>
            {{/each}}
          </ul>
        </div>
      {{/if}}
    </section>
  </template>
}
