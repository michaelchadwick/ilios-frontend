import Component from '@glimmer/component';
import { service } from '@ember/service';
import { cleanQuery } from 'ilios-common/utils/query-utils';
import { restartableTask, timeout } from 'ember-concurrency';
import { TrackedAsyncData } from 'ember-async-data';
import { cached } from '@glimmer/tracking';
import { ensureSafeComponent } from '@embroider/util';
import { action } from '@ember/object';
import NewDirectoryUser from './new-directory-user';
import NewUser from './new-user';

const DEBOUNCE_TIMEOUT = 250;

export default class IliosUsersComponent extends Component {
  @service iliosConfig;
  @service store;
  @service dataLoader;
  searchTypeConfig = new TrackedAsyncData(this.iliosConfig.itemFromConfig('userSearchType'));

  constructor() {
    super(...arguments);
    this.searchForUsers.perform();
  }

  @cached
  get userSearchType() {
    return this.searchTypeConfig.isResolved ? this.searchTypeConfig.value : null;
  }

  @cached
  get loadAllSchoolCohortsPromise() {
    return this.dataLoader.loadSchoolsForLearnerGroups();
  }

  get newUserComponent() {
    const component = this.userSearchType === 'ldap' ? NewDirectoryUser : NewUser;
    return ensureSafeComponent(component, this);
  }

  searchForUsers = restartableTask(async () => {
    const q = cleanQuery(this.args.query);
    await timeout(DEBOUNCE_TIMEOUT);
    return this.store.query('user', {
      limit: this.args.limit,
      q,
      offset: this.args.offset,
      'order_by[lastName]': 'ASC',
      'order_by[firstName]': 'ASC',
    });
  });

  @action
  setQuery(query) {
    this.args.setQuery(query);
    this.searchForUsers.perform();
  }

  @action
  setLimit(limit) {
    this.args.setLimit(limit);
    this.searchForUsers.perform();
  }

  @action
  setOffset(offset) {
    this.args.setOffset(offset);
    this.searchForUsers.perform();
  }
}
