import Application from '@ember/application';
import config from 'frontend/config/environment';
import { initialize } from 'frontend/initializers/metrics-imports';
import { module, test } from 'qunit';
import Resolver from 'ember-resolver';
import { run } from '@ember/runloop';

module('Unit | Initializer | metrics-imports', function (hooks) {
  hooks.beforeEach(function () {
    this.TestApplication = class TestApplication extends Application {
      modulePrefix = config.modulePrefix;
      podModulePrefix = config.podModulePrefix;
      Resolver = Resolver;
    };
    this.TestApplication.initializer({
      name: 'initializer under test',
      initialize,
    });

    this.application = this.TestApplication.create({ autoboot: false });
  });

  hooks.afterEach(function () {
    // eslint-disable-next-line ember/no-runloop
    run(this.application, 'destroy');
  });

  test('it works', async function (assert) {
    await this.application.boot();

    assert.ok(true);
  });
});
