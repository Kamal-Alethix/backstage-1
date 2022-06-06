import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/plugin-catalog-common';
import { createPermission } from '@backstage/plugin-permission-common';

const jenkinsExecutePermission = createPermission({
  name: "jenkins.execute",
  attributes: {
    action: "update"
  },
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY
});

export { jenkinsExecutePermission };
//# sourceMappingURL=index.esm.js.map
