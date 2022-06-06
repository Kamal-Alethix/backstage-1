import { createRouteRef, createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

const rootRouteRef = createRouteRef({
  id: "todo-list"
});

const todoListPlugin = createPlugin({
  id: "todolist",
  routes: {
    root: rootRouteRef
  }
});
const TodoListPage = todoListPlugin.provide(createRoutableExtension({
  name: "TodoListPage",
  component: () => import('./esm/index-174e102a.esm.js').then((m) => m.TodoListPage),
  mountPoint: rootRouteRef
}));

export { TodoListPage, todoListPlugin };
//# sourceMappingURL=index.esm.js.map
