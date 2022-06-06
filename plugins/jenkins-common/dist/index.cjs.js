'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pluginCatalogCommon = require('@backstage/plugin-catalog-common');
var pluginPermissionCommon = require('@backstage/plugin-permission-common');

const jenkinsExecutePermission = pluginPermissionCommon.createPermission({
  name: "jenkins.execute",
  attributes: {
    action: "update"
  },
  resourceType: pluginCatalogCommon.RESOURCE_TYPE_CATALOG_ENTITY
});

exports.jenkinsExecutePermission = jenkinsExecutePermission;
//# sourceMappingURL=index.cjs.js.map
