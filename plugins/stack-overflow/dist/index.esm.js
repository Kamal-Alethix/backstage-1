import { createPlugin, createComponentExtension } from '@backstage/core-plugin-api';
import { createCardExtension } from '@backstage/plugin-home';

const stackOverflowPlugin = createPlugin({
  id: "stack-overflow"
});
const StackOverflowSearchResultListItem = stackOverflowPlugin.provide(createComponentExtension({
  name: "StackOverflowResultListItem",
  component: {
    lazy: () => import('./esm/index-767ad4f2.esm.js').then((m) => m.StackOverflowSearchResultListItem)
  }
}));
const HomePageStackOverflowQuestions = stackOverflowPlugin.provide(createCardExtension({
  name: "HomePageStackOverflowQuestions",
  title: "Stack Overflow Questions",
  components: () => import('./esm/index-c9b32493.esm.js')
}));

export { HomePageStackOverflowQuestions, StackOverflowSearchResultListItem, stackOverflowPlugin };
//# sourceMappingURL=index.esm.js.map
