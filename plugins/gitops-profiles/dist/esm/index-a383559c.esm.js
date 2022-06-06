import React, { useState } from 'react';
import { t as transformStatus } from './ProfileCatalog-c04dc83c.esm.js';
import { Table, Link, Content, ContentHeader, SupportButton, Page, Header, HeaderLabel, Progress } from '@backstage/core-components';
import { Button } from '@material-ui/core';
import useAsync from 'react-use/lib/useAsync';
import { gitOpsApiRef } from '../index.esm.js';
import { Alert } from '@material-ui/lab';
import { useApi, githubAuthApiRef } from '@backstage/core-plugin-api';
import '@material-ui/core/styles';
import '@material-ui/core/Card';
import '@material-ui/core/CardHeader';
import '@material-ui/core/CardContent';
import '@material-ui/core/CardActions';
import '@material-ui/core/Avatar';
import '@material-ui/core/IconButton';
import '@material-ui/core/Typography';
import '@material-ui/core/colors';
import '@material-ui/icons/CheckBoxOutlineBlank';
import '@material-ui/icons/CheckBox';
import 'react-use/lib/useLocalStorage';

const columns = [
  {
    title: "Cluster Name",
    field: "name",
    highlight: true,
    render: (componentData) => /* @__PURE__ */ React.createElement(Link, {
      to: `/gitops-cluster/${encodeURIComponent(componentData.name)}`
    }, componentData.name)
  },
  {
    title: "Status",
    field: "status",
    render: (componentData) => /* @__PURE__ */ React.createElement(React.Fragment, null, transformStatus({
      status: componentData.status,
      conclusion: componentData.conclusion,
      message: componentData.status
    }))
  },
  {
    title: "Conclusion",
    field: "Conclusion",
    render: (componentData) => /* @__PURE__ */ React.createElement(React.Fragment, null, transformStatus({
      status: componentData.status,
      conclusion: componentData.conclusion,
      message: componentData.conclusion
    }))
  }
];
const ClusterTable = ({ components }) => {
  return /* @__PURE__ */ React.createElement(Table, {
    columns,
    options: { paging: false },
    data: components
  });
};

const ClusterList = () => {
  const api = useApi(gitOpsApiRef);
  const githubAuth = useApi(githubAuthApiRef);
  const [githubUsername, setGithubUsername] = useState(String);
  const { loading, error, value } = useAsync(async () => {
    const accessToken = await githubAuth.getAccessToken(["repo", "user"]);
    if (!githubUsername) {
      const userInfo = await api.fetchUserInfo({ accessToken });
      setGithubUsername(userInfo.login);
    }
    return api.listClusters({
      gitHubToken: accessToken,
      gitHubUser: githubUsername
    });
  });
  let content;
  if (loading) {
    content = /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(Progress, null));
  } else if (error) {
    content = /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Error encountered while fetching list of GitOps-managed cluster.", " ", error.toString()), /* @__PURE__ */ React.createElement(Alert, {
      severity: "info"
    }, "Please make sure that you start GitOps-API backend on localhost port 3008 before using this plugin.")));
  } else {
    content = /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(ContentHeader, {
      title: "Clusters"
    }, /* @__PURE__ */ React.createElement(Button, {
      variant: "contained",
      color: "primary",
      href: "/gitops-cluster-create"
    }, "Create GitOps-managed Cluster"), /* @__PURE__ */ React.createElement(SupportButton, null, "All clusters")), /* @__PURE__ */ React.createElement(ClusterTable, {
      components: value.result
    }));
  }
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "home"
  }, /* @__PURE__ */ React.createElement(Header, {
    title: "GitOps-managed Clusters"
  }, /* @__PURE__ */ React.createElement(HeaderLabel, {
    label: "Welcome",
    value: githubUsername
  })), content);
};
var ClusterList$1 = ClusterList;

export { ClusterList$1 as default };
//# sourceMappingURL=index-a383559c.esm.js.map
