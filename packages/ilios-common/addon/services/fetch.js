import Service, { service } from '@ember/service';
import queryString from 'query-string';
import { waitForFetch } from '@ember/test-waiters';

export default class Fetch extends Service {
  @service flashMessages;
  @service intl;
  @service session;
  @service router;
  @service iliosConfig;

  get authHeaders() {
    const headers = {};
    if (this.session && this.session.isAuthenticated) {
      const { jwt } = this.session.data.authenticated;
      if (jwt) {
        headers['X-JWT-Authorization'] = `Token ${jwt}`;
      }
    }

    return headers;
  }

  get host() {
    return this.iliosConfig.apiHost
      ? this.iliosConfig.apiHost
      : window.location.protocol + '//' + window.location.host;
  }

  apiHostUrlFromPath(relativePath) {
    const trimmedPath = relativePath.replace(/^\//, '');
    return `${this.host}/${trimmedPath}`;
  }

  async getJsonFromApiHost(relativePath) {
    const url = this.apiHostUrlFromPath(relativePath);

    const response = await waitForFetch(
      fetch(url, {
        headers: this.authHeaders,
      }),
    );

    // if invalid auth, invalidate session
    if (response.status == 401) {
      this.flashMessages.alert(this.intl.t('errors.invalidAuthentication'));
      this.session.invalidate();
    }

    return response.json();
  }

  async postToApiHost(relativePath, body, contentType) {
    const url = this.apiHostUrlFromPath(relativePath);
    const headers = this.authHeaders;
    headers['Content-Type'] = contentType;
    headers['Accept'] = 'application/vnd.api+json';

    const response = await waitForFetch(
      fetch(url, {
        method: 'POST',
        headers,
        body,
      }),
    );

    // if invalid auth, invalidate session
    if (response.status == 401) {
      this.flashMessages.alert(this.intl.t('errors.invalidAuthentication'));
      this.session.invalidate();
    }

    return response.json();
  }

  async postQueryToApi(path, data) {
    const apiPath = `/${this.iliosConfig.apiNameSpace}/${path}`;
    const body = queryString.stringify(data, {
      arrayFormat: 'bracket',
    });
    return this.postToApiHost(apiPath, body, 'application/x-www-form-urlencoded');
  }

  async postManyToApi(path, items) {
    const apiPath = `/${this.iliosConfig.apiNameSpace}/${path}`;
    const body = JSON.stringify({ data: items });
    return this.postToApiHost(apiPath, body, 'application/vnd.api+json');
  }
}
