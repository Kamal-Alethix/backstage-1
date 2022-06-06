import { stringifyEntityRef } from '@backstage/catalog-model';
import { ResponseError } from '@backstage/errors';
import { createApiRef, createRouteRef, createPlugin, createApiFactory, identityApiRef, discoveryApiRef, createRoutableExtension } from '@backstage/core-plugin-api';

class TodoClient {
  constructor(options) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }
  async listTodos(options) {
    const { entity, offset, limit, orderBy, filters } = options;
    const baseUrl = await this.discoveryApi.getBaseUrl("todo");
    const { token } = await this.identityApi.getCredentials();
    const query = new URLSearchParams();
    if (entity) {
      query.set("entity", stringifyEntityRef(entity));
    }
    if (typeof offset === "number") {
      query.set("offset", String(offset));
    }
    if (typeof limit === "number") {
      query.set("limit", String(limit));
    }
    if (orderBy) {
      query.set("orderBy", `${orderBy.field}=${orderBy.direction}`);
    }
    if (filters) {
      for (const filter of filters) {
        query.append("filter", `${filter.field}=${filter.value}`);
      }
    }
    const res = await fetch(`${baseUrl}/v1/todos?${query}`, {
      headers: token ? {
        Authorization: `Bearer ${token}`
      } : void 0
    });
    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }
    const data = await res.json();
    return data;
  }
}

const todoApiRef = createApiRef({
  id: "plugin.todo.api"
});

const rootRouteRef = createRouteRef({
  id: "todo"
});

const todoPlugin = createPlugin({
  id: "todo",
  apis: [
    createApiFactory({
      api: todoApiRef,
      deps: {
        identityApi: identityApiRef,
        discoveryApi: discoveryApiRef
      },
      factory({ identityApi, discoveryApi }) {
        return new TodoClient({ identityApi, discoveryApi });
      }
    })
  ],
  routes: {
    entityContent: rootRouteRef
  }
});
const EntityTodoContent = todoPlugin.provide(createRoutableExtension({
  name: "EntityTodoContent",
  component: () => import('./esm/index-7674c077.esm.js').then((m) => m.TodoList),
  mountPoint: rootRouteRef
}));

export { EntityTodoContent, TodoClient, todoApiRef, todoPlugin };
//# sourceMappingURL=index.esm.js.map
