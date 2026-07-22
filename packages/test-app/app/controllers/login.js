import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class LoginController extends Controller {
  @service session;
  @service fetch;
  @tracked jwt = null;
  @tracked error = null;

  login = task({ drop: true }, async () => {
    this.error = null;

    if (this.jwt) {
      const response = await this.fetch.fetchFromApiHost('/auth/token', {
        headers: {
          'X-JWT-Authorization': `Token ${this.jwt}`,
        },
      });
      if (response.ok) {
        const authenticator = 'authenticator:ilios-jwt';
        this.session.authenticate(authenticator, { jwt: this.jwt });
      } else {
        this.error = await response.text();
      }
    }
  });

  loginOnEnter = task({ drop: true }, async (event) => {
    const keyCode = event.keyCode;
    if (13 === keyCode) {
      await this.login.perform();
    }
  });
}
