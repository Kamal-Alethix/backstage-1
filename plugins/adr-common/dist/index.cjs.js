'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var catalogModel = require('@backstage/catalog-model');

const ANNOTATION_ADR_LOCATION = "backstage.io/adr-location";
const MADR_DATE_FORMAT = "yyyy-MM-dd";
const getAdrLocationDir = (entity) => {
  var _a, _b;
  return (_b = (_a = entity.metadata.annotations) == null ? void 0 : _a[ANNOTATION_ADR_LOCATION]) == null ? void 0 : _b.trim();
};
const isAdrAvailable = (entity) => Boolean(getAdrLocationDir(entity));
const getAdrLocationUrl = (entity, scmIntegration) => {
  if (!isAdrAvailable(entity)) {
    throw new Error(`Missing ADR annotation: ${ANNOTATION_ADR_LOCATION}`);
  }
  return scmIntegration.resolveUrl({
    url: getAdrLocationDir(entity),
    base: catalogModel.getEntitySourceLocation(entity).target
  });
};
const madrFilePathFilter = (path) => /^\d{4}-.+\.md$/.test(path);

exports.ANNOTATION_ADR_LOCATION = ANNOTATION_ADR_LOCATION;
exports.MADR_DATE_FORMAT = MADR_DATE_FORMAT;
exports.getAdrLocationUrl = getAdrLocationUrl;
exports.isAdrAvailable = isAdrAvailable;
exports.madrFilePathFilter = madrFilePathFilter;
//# sourceMappingURL=index.cjs.js.map
