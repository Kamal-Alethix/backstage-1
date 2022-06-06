import fetch from 'cross-fetch';

const VERSIONS_DOMAIN = "https://versions.backstage.io";
async function getManifestByVersion(options) {
  const url = `${VERSIONS_DOMAIN}/v1/releases/${encodeURIComponent(options.version)}/manifest.json`;
  const response = await fetch(url);
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
  const response = await fetch(url);
  if (response.status === 404) {
    throw new Error(`No '${options.releaseLine}' release line found`);
  }
  if (response.status !== 200) {
    throw new Error(`Unexpected response status ${response.status} when fetching release from ${url}.`);
  }
  return await response.json();
}

export { getManifestByReleaseLine, getManifestByVersion };
//# sourceMappingURL=index.esm.js.map
