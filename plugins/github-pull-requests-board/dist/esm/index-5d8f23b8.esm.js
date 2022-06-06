import React, { useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { InfoCard, Progress } from '@backstage/core-components';
import { u as useUserRepositories, a as usePullRequestsByTeam, I as InfoCardHeader, P as PullRequestBoardOptions, D as DraftPr, W as Wrapper, b as PullRequestCard } from './useUserRepositories-fabfff57.esm.js';
import '@material-ui/icons/Refresh';
import '@material-ui/lab';
import '@octokit/rest';
import '@backstage/core-plugin-api';
import '@backstage/integration';
import '@backstage/plugin-catalog-react';
import 'moment';

const EntityTeamPullRequestsCard = () => {
  const [infoCardFormat, setInfoCardFormat] = useState([]);
  const { repositories } = useUserRepositories();
  const { loading, pullRequests, refreshPullRequests } = usePullRequestsByTeam(repositories);
  const header = /* @__PURE__ */ React.createElement(InfoCardHeader, {
    onRefresh: refreshPullRequests
  }, /* @__PURE__ */ React.createElement(PullRequestBoardOptions, {
    onClickOption: (newFormats) => setInfoCardFormat(newFormats),
    value: infoCardFormat,
    options: [
      {
        icon: /* @__PURE__ */ React.createElement(DraftPr, null),
        value: "draft",
        ariaLabel: "Show draft PRs"
      },
      {
        icon: /* @__PURE__ */ React.createElement(FullscreenIcon, null),
        value: "fullscreen",
        ariaLabel: "Info card is set to fullscreen"
      }
    ]
  }));
  const getContent = () => {
    if (loading) {
      return /* @__PURE__ */ React.createElement(Progress, null);
    }
    return /* @__PURE__ */ React.createElement(Grid, {
      container: true,
      spacing: 2
    }, pullRequests.length ? pullRequests.map(({ title: columnTitle, content }) => /* @__PURE__ */ React.createElement(Wrapper, {
      key: columnTitle,
      fullscreen: infoCardFormat.includes("fullscreen")
    }, /* @__PURE__ */ React.createElement(Typography, {
      variant: "overline"
    }, columnTitle), content.map(({
      id,
      title,
      createdAt,
      lastEditedAt,
      author,
      url,
      latestReviews,
      repository,
      isDraft
    }, index) => infoCardFormat.includes("draft") === isDraft && /* @__PURE__ */ React.createElement(PullRequestCard, {
      key: `pull-request-${id}-${index}`,
      title,
      createdAt,
      updatedAt: lastEditedAt,
      author,
      url,
      reviews: latestReviews.nodes,
      repositoryName: repository.name,
      isDraft
    })))) : /* @__PURE__ */ React.createElement(Typography, {
      variant: "overline"
    }, "No pull requests found"));
  };
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: header
  }, getContent());
};
var EntityTeamPullRequestsCard$1 = EntityTeamPullRequestsCard;

export { EntityTeamPullRequestsCard$1 as EntityTeamPullRequestsCard };
//# sourceMappingURL=index-5d8f23b8.esm.js.map
