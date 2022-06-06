import { createApiRef, createRouteRef, createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';
import ObservableImpl from 'zen-observable';
import { ResponseError } from '@backstage/errors';

const configSchemaApiRef = createApiRef({
  id: "plugin.config-schema"
});

const DEFAULT_URL = "config-schema.json";
class StaticSchemaLoader {
  constructor(options = {}) {
    var _a;
    this.url = (_a = options == null ? void 0 : options.url) != null ? _a : DEFAULT_URL;
  }
  schema$() {
    return new ObservableImpl((subscriber) => {
      this.fetchSchema().then((schema) => subscriber.next({ schema }), (error) => subscriber.error(error));
    });
  }
  async fetchSchema() {
    const res = await fetch(this.url);
    if (!res.ok) {
      if (res.status === 404) {
        return void 0;
      }
      throw await ResponseError.fromResponse(res);
    }
    return await res.json();
  }
}

const rootRouteRef = createRouteRef({
  id: "config-schema"
});

const configSchemaPlugin = createPlugin({
  id: "config-schema",
  routes: {
    root: rootRouteRef
  }
});
const ConfigSchemaPage = configSchemaPlugin.provide(createRoutableExtension({
  name: "ConfigSchemaPage",
  component: () => import('./esm/index-f3b4f759.esm.js').then((m) => m.ConfigSchemaPage),
  mountPoint: rootRouteRef
}));

export { ConfigSchemaPage, StaticSchemaLoader, configSchemaApiRef, configSchemaPlugin };
//# sourceMappingURL=index.esm.js.map
