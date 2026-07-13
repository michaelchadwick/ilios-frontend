/**
 * This module exports utility methods for dealing with JTWs.
 */

import { isEmpty } from '@ember/utils';

/**
 * Stolen from https://github.com/auth0/jwt-decode/blob/master/lib/base64_url_decode.js
 */
const b64DecodeUnicode = function (str) {
  return decodeURIComponent(
    atob(str).replace(/(.)/g, function (m, p) {
      let code = p.charCodeAt(0).toString(16).toUpperCase();
      if (code.length < 2) {
        code = '0' + code;
      }
      return '%' + code;
    }),
  );
};

/**
 * Decodes a given JWT.
 * @param {string} token The base-64 encoded token.
 * @returns {object} The decoded token payload.
 */
const jwtDecode = function (token) {
  const parts = token.split('.');
  const body = parts[1];
  return JSON.parse(b64DecodeUnicode(body));
};

/**
 * Returns a list of audience claims declared in the given JWT.
 *
 * @param {object} decodedJwt The decoded JTW object.
 * @returns {array} A list of audience claims extracted from the given token object.
 */
const getAudienceClaimsFromDecodedJwt = function (decodedJwt) {
  if (!Object.hasOwn(decodedJwt, 'aud')) {
    return [];
  }
  const scopes = decodedJwt['aud'];
  if (isEmpty(scopes)) {
    return [];
  }

  if (Array.isArray(scopes)) {
    return scopes;
  }

  if ('string' === typeof scopes) {
    return [scopes];
  }

  return [];
};

export { getAudienceClaimsFromDecodedJwt, jwtDecode };
