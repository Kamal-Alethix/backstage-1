import { A as AZURE_DEVOPS_REPO_ANNOTATION } from './index-00a5c1e5.esm.js';

function useProjectRepoFromEntity(entity) {
  var _a, _b;
  const [project, repo] = ((_b = (_a = entity.metadata.annotations) == null ? void 0 : _a[AZURE_DEVOPS_REPO_ANNOTATION]) != null ? _b : "").split("/");
  if (!project && !repo) {
    throw new Error("Value for annotation dev.azure.com/project-repo was not in the correct format: <project-name>/<repo-name>");
  }
  if (!project) {
    throw new Error("Project Name for annotation dev.azure.com/project-repo was not found; expected format is: <project-name>/<repo-name>");
  }
  if (!repo) {
    throw new Error("Repo Name for annotation dev.azure.com/project-repo was not found; expected format is: <project-name>/<repo-name>");
  }
  return { project, repo };
}

export { useProjectRepoFromEntity as u };
//# sourceMappingURL=useProjectRepoFromEntity-c5be856f.esm.js.map
