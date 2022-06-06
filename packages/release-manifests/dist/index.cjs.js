'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fetch = require('cross-fetch');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);

const VERSIONS_DOMAIN = "https://versions.backstage.io";
async function getManifestByVersion(options) {
  const url = `${VERSIONS_DOMAIN}/v1/releases/${encodeURIComponent(options.version)}/manifest.json`;
  const response = await fetch__default["default"](url);
  if (response.status === 404) {
    throw new Error(`No release found for ${options.version} version`);
  }
  if (response.status !== 200) {
    throw new Error(`Unexpected response status ${response.status} when fetching release from ${url}.`);
  }
  return await response.json();
}
async function getManifestByReleaseLine(options) {
  const url = `${VERSIONS_DOMAIN}/v1/tags/${encodeURIComponent(options.releaseLine)}/manifest.json`;
  const response = await fetch__default["default"](url);
  if (response.status === 404) {
    throw new Error(`No '${options.releaseLine}' release line found`);
  }
  if (response.status !== 200) {
    throw new Error(`Unexpected response status ${response.status} when fetching release from ${url}.`);
  }
  return await response.json();
}

exports.getManifestByReleaseLine = getManifestByReleaseLine;
exports.getManifestByVersion = getManifestByVersion;
//# sourceMappingURL=index.cjs.js.map
