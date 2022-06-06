import { generatePath } from 'react-router';
import { ResponseError } from '@backstage/errors';
import { DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { createApiRef, createPlugin, createApiFactory, discoveryApiRef, identityApiRef, createComponentExtension } from '@backstage/core-plugin-api';

class BadgesClient {
  constructor(options) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }
  async getEntityBadgeSpecs(entity) {
    const entityBadgeSpecsUrl = await this.getEntityBadgeSpecsUrl(entity);
    const { token } = await this.identityApi.getCredentials();
    const response = await fetch(entityBadgeSpecsUrl, {
      headers: token ? {
        Authorization: `Bearer ${token}`
      } : void 0
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return await response.json();
  }
  async getEntityBadgeSpecsUrl(entity) {
    const routeParams = this.getEntityRouteParams(entity);
    const path = generatePath(`:namespace/:kind/:name`, routeParams);
    return `${await this.discoveryApi.getBaseUrl("badges")}/entity/${path}/badge-specs`;
  }
  getEntityRouteParams(entity) {
    var _a, _b;
    return {
      kind: entity.kind.toLocaleLowerCase("en-US"),
      namespace: (_b = (_a = entity.metadata.namespace) == null ? void 0 : _a.toLocaleLowerCase("en-US")) != null ? _b : DEFAULT_NAMESPACE,
      name: entity.metadata.name
    };
  }
}

const badgesApiRef = createApiRef({
  id: "plugin.badges.client"
});

const badgesPlugin = createPlugin({
  id: "badges",
  apis: [
    createApiFactory({
      api: badgesApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) => new BadgesClient({ discoveryApi, identityApi })
    })
  ]
});
const EntityBadgesDialog = badgesPlugin.provide(createComponentExtension({
  name: "EntityBadgesDialog",
  component: {
    lazy: () => import('./EntityBadgesDialog-d78a9ab5.esm.js').then((m) => m.EntityBadgesDialog)
  }
}));

export { EntityBadgesDialog as E, badgesPlugin as a, badgesApiRef as b };
//# sourceMappingURL=index-d686cb1a.esm.js.map
