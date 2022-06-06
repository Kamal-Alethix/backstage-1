const FOSSA_PROJECT_NAME_ANNOTATION = "fossa.io/project-name";
const getProjectName = (entity) => {
  var _a, _b;
  return (_b = (_a = entity == null ? void 0 : entity.metadata.annotations) == null ? void 0 : _a[FOSSA_PROJECT_NAME_ANNOTATION]) != null ? _b : void 0;
};

export { FOSSA_PROJECT_NAME_ANNOTATION as F, getProjectName as g };
//# sourceMappingURL=getProjectName-f8006249.esm.js.map
