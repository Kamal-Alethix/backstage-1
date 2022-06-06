import React, { useState, useEffect } from 'react';
import { Link } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { gitOpsApiRef } from '../index.esm.js';
import { a as transformRunStatus } from './ProfileCatalog-c04dc83c.esm.js';
import { Page, Header, HeaderLabel, Content, Progress, Table } from '@backstage/core-components';
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

const ClusterPage = () => {
  const params = useParams();
  const [pollingLog, setPollingLog] = useState(true);
  const [runStatus, setRunStatus] = useState([]);
  const [runLink, setRunLink] = useState("");
  const [showProgress, setShowProgress] = useState(true);
  const api = useApi(gitOpsApiRef);
  const githubAuth = useApi(githubAuthApiRef);
  const [githubAccessToken, setGithubAccessToken] = useState(String);
  const [githubUsername, setGithubUsername] = useState(String);
  const columns = [
    { field: "status", title: "Status" },
    { field: "message", title: "Message" }
  ];
  useEffect(() => {
    const fetchGithubUserInfo = async () => {
      const accessToken = await githubAuth.getAccessToken(["repo", "user"]);
      const userInfo = await api.fetchUserInfo({ accessToken });
      setGithubAccessToken(accessToken);
      setGithubUsername(userInfo.login);
    };
    if (!githubAccessToken || !githubUsername) {
      fetchGithubUserInfo();
    } else {
      if (pollingLog) {
        const interval = setInterval(async () => {
          const resp = await api.fetchLog({
            gitHubToken: githubAccessToken,
            gitHubUser: githubUsername,
            targetOrg: params.owner,
            targetRepo: params.repo
          });
          setRunStatus(resp.result);
          setRunLink(resp.link);
          if (resp.status === "completed") {
            setPollingLog(false);
            setShowProgress(false);
          }
        }, 1e4);
        return () => clearInterval(interval);
      }
    }
    return () => {
    };
  }, [pollingLog, api, params, githubAuth, githubAccessToken, githubUsername]);
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "home"
  }, /* @__PURE__ */ React.createElement(Header, {
    title: `Cluster ${params.owner}/${params.repo}`
  }, /* @__PURE__ */ React.createElement(HeaderLabel, {
    label: "Welcome",
    value: githubUsername
  })), /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(Progress, {
    hidden: !showProgress
  }), /* @__PURE__ */ React.createElement(Table, {
    options: { search: false, paging: false, toolbar: false },
    data: transformRunStatus(runStatus),
    columns
  }), /* @__PURE__ */ React.createElement(Link, {
    hidden: runLink === "",
    rel: "noopener noreferrer",
    href: `${runLink}?check_suite_focus=true`,
    target: "_blank"
  }, "Details")));
};
var ClusterPage$1 = ClusterPage;

export { ClusterPage$1 as default };
//# sourceMappingURL=index-c384ac37.esm.js.map
