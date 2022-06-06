import { SvgIcon, Box } from '@material-ui/core';
import { ResponseErrorPanel, Table, Link } from '@backstage/core-components';
import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { c as azureDevOpsApiRef } from './index-00a5c1e5.esm.js';
import '@backstage/errors';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { u as useProjectRepoFromEntity } from './useProjectRepoFromEntity-c5be856f.esm.js';
import '@backstage/plugin-azure-devops-common';
import 'luxon';
import 'humanize-duration';
import '@material-ui/icons/DoneAll';
import '@material-ui/core/styles';
import '@material-ui/icons/Cancel';
import '@material-ui/icons/GroupWork';
import '@material-ui/icons/WatchLater';
import 'react-use/lib/useAsyncRetry';
import 'react-use/lib/useInterval';

const AzureGitTagsIcon = (props) => /* @__PURE__ */ React.createElement(SvgIcon, {
  ...props,
  viewBox: "0 0 32 32"
}, /* @__PURE__ */ React.createElement("path", {
  d: "M22.5 12C23.8807 12 25 10.8807 25 9.5C25 8.11929 23.8807 7 22.5 7C21.1193 7 20 8.11929 20 9.5C20 10.8807 21.1193 12 22.5 12ZM18.6842 3C17.6695 3 16.6927 3.38568 15.9516 4.07892L3.77041 15.4742C2.01578 17.1157 1.96966 19.8841 3.66863 21.5831L9.99455 27.909C11.6543 29.5687 14.3452 29.5687 16.005 27.909L27.8282 16.0858C28.5783 15.3356 28.9998 14.3182 28.9998 13.2574V6.5C28.9998 4.567 27.4328 3 25.4998 3H18.6842ZM17.3179 5.53946C17.6884 5.19284 18.1769 5 18.6842 5H25.4998C26.3282 5 26.9998 5.67157 26.9998 6.5V13.2574C26.9998 13.7878 26.789 14.2965 26.414 14.6716L14.5907 26.4948C13.7121 27.3735 12.2874 27.3735 11.4088 26.4948L5.08284 20.1689C4.18339 19.2694 4.20781 17.8038 5.13673 16.9348L17.3179 5.53946Z"
}));

function useGitTags(entity) {
  const api = useApi(azureDevOpsApiRef);
  const { project, repo } = useProjectRepoFromEntity(entity);
  const { value, loading, error } = useAsync(() => {
    return api.getGitTags(project, repo);
  }, [api, project, repo]);
  return {
    items: value == null ? void 0 : value.items,
    loading,
    error
  };
}

const columns = [
  {
    title: "Tag",
    field: "name",
    highlight: false,
    defaultSort: "desc",
    width: "auto",
    render: (row) => {
      var _a;
      return /* @__PURE__ */ React.createElement(Box, {
        display: "flex",
        alignItems: "center"
      }, /* @__PURE__ */ React.createElement(Link, {
        to: (_a = row.link) != null ? _a : ""
      }, row.name));
    }
  },
  {
    title: "Commit",
    field: "peeledObjectId",
    width: "auto",
    render: (row) => {
      var _a;
      return /* @__PURE__ */ React.createElement(Box, {
        display: "flex",
        alignItems: "center"
      }, /* @__PURE__ */ React.createElement(Link, {
        to: (_a = row.commitLink) != null ? _a : ""
      }, row.peeledObjectId));
    }
  },
  {
    title: "Created By",
    field: "createdBy",
    width: "auto"
  }
];
const GitTagTable = () => {
  const { entity } = useEntity();
  const { items, loading, error } = useGitTags(entity);
  if (error) {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error
    });
  }
  return /* @__PURE__ */ React.createElement(Table, {
    isLoading: loading,
    columns,
    options: {
      search: true,
      paging: true,
      pageSize: 5,
      showEmptyDataSourceMessage: !loading
    },
    title: /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(AzureGitTagsIcon, {
      style: { fontSize: 30 }
    }), /* @__PURE__ */ React.createElement(Box, {
      mr: 1
    }), "Azure Repos - Git Tags (", items ? items.length : 0, ")"),
    data: items != null ? items : []
  });
};

const EntityPageAzureGitTags = () => /* @__PURE__ */ React.createElement(GitTagTable, null);

export { EntityPageAzureGitTags };
//# sourceMappingURL=index-47100e58.esm.js.map
