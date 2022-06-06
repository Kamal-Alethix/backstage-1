import { createRouteRef, createPlugin, createComponentExtension, createRoutableExtension } from '@backstage/core-plugin-api';

const rootRouteRef = createRouteRef({
  id: "github-pull-requests-board"
});

const githubPullRequestsBoardPlugin = createPlugin({
  id: "github-pull-requests-board",
  routes: {
    root: rootRouteRef
  }
});
const EntityTeamPullRequestsCard = githubPullRequestsBoardPlugin.provide(createComponentExtension({
  name: "EntityTeamPullRequestsCard",
  component: {
    lazy: () => import('./esm/index-5d8f23b8.esm.js').then((m) => m.EntityTeamPullRequestsCard)
  }
}));
const EntityTeamPullRequestsContent = githubPullRequestsBoardPlugin.provide(createRoutableExtension({
  name: "PullRequestPage",
  component: () => import('./esm/index-c00fa91f.esm.js').then((m) => m.EntityTeamPullRequestsContent),
  mountPoint: rootRouteRef
}));

export { EntityTeamPullRequestsCard, EntityTeamPullRequestsContent };
//# sourceMappingURL=index.esm.js.map
