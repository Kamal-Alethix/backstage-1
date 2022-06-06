import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { catalogApiRef, getEntityRelations, humanizeEntityRef, EntityRefLink, EntityRefLinks } from '@backstage/plugin-catalog-react';
import { Tooltip } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { DateTime } from 'luxon';
import * as React from 'react';
import { useState, useMemo } from 'react';
import useAsync from 'react-use/lib/useAsync';
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect';
import { f as fossaApiRef } from './index-5999b13b.esm.js';
import '@backstage/errors';
import 'cross-fetch';
import 'p-limit';
import { g as getProjectName } from './getProjectName-f8006249.esm.js';
import { Page, Header, Content, Table, StatusWarning, StatusError, StatusOK, Link } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

const columns = [
  {
    title: "Name",
    field: "resolved.name",
    highlight: true,
    width: "auto",
    render: ({ entity }) => /* @__PURE__ */ React.createElement(EntityRefLink, {
      entityRef: entity,
      defaultKind: "Component"
    })
  },
  {
    title: "Owner",
    field: "resolved.ownedByRelationsTitle",
    render: ({ resolved }) => /* @__PURE__ */ React.createElement(EntityRefLinks, {
      entityRefs: resolved.ownedByRelations,
      defaultKind: "group"
    })
  },
  {
    title: "Status",
    field: "resolved.details.issueCount",
    customSort: (a, b) => {
      var _a, _b, _c, _d, _e, _f;
      return ((_c = (_b = (_a = b == null ? void 0 : b.resolved) == null ? void 0 : _a.details) == null ? void 0 : _b.issueCount) != null ? _c : 0.5) - ((_f = (_e = (_d = a == null ? void 0 : a.resolved) == null ? void 0 : _d.details) == null ? void 0 : _e.issueCount) != null ? _f : 0.5);
    },
    render: ({ resolved }) => {
      if (resolved.loading) {
        return /* @__PURE__ */ React.createElement(Skeleton, {
          animation: "pulse"
        });
      } else if (!resolved.details) {
        return /* @__PURE__ */ React.createElement(StatusWarning, null, "Not configured");
      } else if (resolved.details.dependencyCount === 0) {
        return /* @__PURE__ */ React.createElement(StatusWarning, null, "No dependencies");
      } else if (resolved.details.issueCount > 0) {
        return /* @__PURE__ */ React.createElement(StatusError, null, resolved.details.issueCount, " Issues");
      }
      return /* @__PURE__ */ React.createElement(StatusOK, null, resolved.details.issueCount, " Issues");
    }
  },
  {
    title: "Dependencies",
    field: "resolved.details.dependencyCount",
    render: ({ resolved: { loading, details } }) => {
      if (loading) {
        return /* @__PURE__ */ React.createElement(Skeleton, {
          animation: "pulse"
        });
      }
      return details == null ? void 0 : details.dependencyCount;
    }
  },
  {
    title: "Branch",
    field: "resolved.details.projectDefaultBranch",
    render: ({ resolved: { loading, details } }) => {
      if (loading) {
        return /* @__PURE__ */ React.createElement(Skeleton, {
          animation: "pulse"
        });
      }
      return details == null ? void 0 : details.projectDefaultBranch;
    }
  },
  {
    title: "Last Updated",
    field: "resolved.details.timestamp",
    render: ({ resolved: { loading, details } }) => {
      if (loading) {
        return /* @__PURE__ */ React.createElement(Skeleton, {
          animation: "pulse"
        });
      }
      return (details == null ? void 0 : details.timestamp) && /* @__PURE__ */ React.createElement(Tooltip, {
        title: DateTime.fromISO(details.timestamp).toLocaleString(DateTime.DATETIME_MED)
      }, /* @__PURE__ */ React.createElement("span", null, DateTime.fromISO(details.timestamp).toRelative({
        locale: "en"
      })));
    }
  },
  {
    sorting: false,
    render: ({ resolved: { loading, details } }) => {
      if (loading) {
        return /* @__PURE__ */ React.createElement(Skeleton, {
          animation: "pulse"
        });
      }
      return details && /* @__PURE__ */ React.createElement(Link, {
        to: details.projectUrl
      }, "View in FOSSA");
    }
  }
];
const filters = [
  { column: "Owner", type: "multiple-select" },
  { column: "Branch", type: "select" }
];
const FossaPage = ({
  entitiesFilter = { kind: "Component" }
}) => {
  const catalogApi = useApi(catalogApiRef);
  const fossaApi = useApi(fossaApiRef);
  const [filter, setFilter] = useState(entitiesFilter);
  useDeepCompareEffect(() => setFilter(entitiesFilter), [entitiesFilter]);
  const { value: entities, loading: entitiesLoading } = useAsync(() => {
    return catalogApi.getEntities({
      filter,
      fields: [
        "kind",
        "metadata.namespace",
        "metadata.name",
        "metadata.annotations",
        "relations"
      ]
    });
  }, [filter]);
  const projectNames = useMemo(() => {
    var _a, _b;
    return (_b = (_a = entities == null ? void 0 : entities.items) == null ? void 0 : _a.map(getProjectName)) != null ? _b : [];
  }, [entities == null ? void 0 : entities.items]);
  const { value: summaries, loading: summariesLoading } = useAsync(async () => await fossaApi.getFindingSummaries(projectNames.filter((n) => n !== void 0)), [projectNames]);
  const rows = useMemo(() => {
    var _a, _b;
    return (_b = (_a = entities == null ? void 0 : entities.items) == null ? void 0 : _a.map((entity, idx) => {
      const projectName = projectNames[idx];
      const summary = projectName ? summaries == null ? void 0 : summaries.get(projectName) : void 0;
      const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);
      return {
        entity,
        resolved: {
          name: humanizeEntityRef(entity),
          ownedByRelations,
          ownedByRelationsTitle: ownedByRelations.map((r) => humanizeEntityRef(r, { defaultKind: "group" })).join(", "),
          loading: summariesLoading,
          details: summary
        }
      };
    })) != null ? _b : [];
  }, [projectNames, entities == null ? void 0 : entities.items, summaries, summariesLoading]);
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "home"
  }, /* @__PURE__ */ React.createElement(Header, {
    title: "FOSSA Component Overview"
  }), /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(Table, {
    columns,
    data: rows,
    filters,
    isLoading: entitiesLoading,
    options: {
      pageSize: 20,
      actionsColumnIndex: -1,
      loadingType: "linear",
      padding: "dense",
      showEmptyDataSourceMessage: !entitiesLoading
    }
  })));
};

export { FossaPage };
//# sourceMappingURL=index-9346ad27.esm.js.map
