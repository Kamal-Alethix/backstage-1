import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, IconButton, Tooltip, Grid, makeStyles, Avatar, Paper, CardActionArea } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { Octokit } from '@octokit/rest';
import { useApi, githubAuthApiRef, configApiRef } from '@backstage/core-plugin-api';
import { readGitHubIntegrationConfigs } from '@backstage/integration';
import { useEntity, catalogApiRef } from '@backstage/plugin-catalog-react';
import moment from 'moment';

const InfoCardHeader = (props) => {
  const { children, onRefresh } = props;
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h5"
  }, "Open pull requests"), /* @__PURE__ */ React.createElement(IconButton, {
    color: "secondary",
    onClick: onRefresh
  }, /* @__PURE__ */ React.createElement(RefreshIcon, null))), children);
};

const PullRequestBoardOptions = (props) => {
  const { value, onClickOption, options } = props;
  return /* @__PURE__ */ React.createElement(ToggleButtonGroup, {
    size: "small",
    value,
    onChange: (_event, selectedOptions) => onClickOption(selectedOptions),
    "aria-label": "Pull Request board settings"
  }, options.map(({ icon, value: toggleValue, ariaLabel }, index) => /* @__PURE__ */ React.createElement(ToggleButton, {
    value: toggleValue,
    "aria-label": ariaLabel,
    key: `${ariaLabel}-${index}`
  }, /* @__PURE__ */ React.createElement(Tooltip, {
    title: ariaLabel
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }, icon)))));
};

const Wrapper = (props) => {
  const { children, fullscreen } = props;
  return /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: true
  }, /* @__PURE__ */ React.createElement(Box, {
    maxHeight: fullscreen ? "100vh" : "50vh",
    overflow: "auto"
  }, children));
};

const COLUMNS = Object.freeze({
  REVIEW_REQUIRED: "\u{1F50D} Review required",
  REVIEW_IN_PROGRESS: "\u{1F4DD} Review in progress",
  APPROVED: "\u{1F44D} Approved"
});

const GITHUB_PULL_REQUESTS_ANNOTATION = "github.com/project-slug";
const getProjectNameFromEntity = (entity) => {
  var _a, _b;
  return (_b = (_a = entity == null ? void 0 : entity.metadata.annotations) == null ? void 0 : _a[GITHUB_PULL_REQUESTS_ANNOTATION]) != null ? _b : "";
};
const getApprovedReviews = (reviews = []) => {
  return reviews.filter(({ state }) => state === "APPROVED");
};
const getCommentedReviews = (reviews = []) => {
  return reviews.filter(({ state }) => state === "COMMENTED");
};
const getChangeRequests = (reviews = []) => {
  return reviews.filter(({ state }) => state === "CHANGES_REQUESTED");
};
const filterSameUser = (users) => {
  return users.reduce((acc, curr) => {
    const containsUser = acc.find(({ login }) => login === curr.login);
    if (!containsUser) {
      return [...acc, curr];
    }
    return acc;
  }, []);
};
const getElapsedTime = (start) => {
  return moment(start).fromNow();
};
const formatPRsByReviewDecision = (prs) => {
  const reviewDecisions = prs.reduce((acc, curr) => {
    const decision = curr.reviewDecision || "REVIEW_REQUIRED";
    if (decision !== "APPROVED" && curr.latestReviews.nodes.length === 0) {
      return {
        ...acc,
        REVIEW_REQUIRED: [...acc.REVIEW_REQUIRED, curr]
      };
    }
    if (decision !== "APPROVED" && curr.latestReviews.nodes.length > 0) {
      return {
        ...acc,
        IN_PROGRESS: [...acc.IN_PROGRESS, curr]
      };
    }
    if (decision === "APPROVED") {
      return {
        ...acc,
        APPROVED: [...acc.APPROVED, curr]
      };
    }
    return acc;
  }, {
    REVIEW_REQUIRED: [],
    IN_PROGRESS: [],
    APPROVED: []
  });
  return [
    {
      title: COLUMNS.REVIEW_REQUIRED,
      content: reviewDecisions.REVIEW_REQUIRED
    },
    { title: COLUMNS.REVIEW_IN_PROGRESS, content: reviewDecisions.IN_PROGRESS },
    { title: COLUMNS.APPROVED, content: reviewDecisions.APPROVED }
  ];
};

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginLeft: theme.spacing(1)
  }
}));
const UserHeader = (props) => {
  const { name, avatar } = props;
  const classes = useStyles();
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    alignItems: "center",
    marginX: 1
  }, /* @__PURE__ */ React.createElement(Typography, {
    color: "textSecondary",
    variant: "body2",
    component: "p"
  }, name), /* @__PURE__ */ React.createElement(Avatar, {
    alt: name,
    src: avatar,
    className: classes.small
  }));
};

const CardHeader = (props) => {
  const {
    title,
    createdAt,
    updatedAt,
    authorName,
    authorAvatar,
    repositoryName
  } = props;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    justifyContent: "space-between"
  }, /* @__PURE__ */ React.createElement(Typography, {
    color: "textSecondary",
    variant: "body2",
    component: "p"
  }, repositoryName), /* @__PURE__ */ React.createElement(UserHeader, {
    name: authorName,
    avatar: authorAvatar
  })), /* @__PURE__ */ React.createElement(Typography, {
    component: "h3"
  }, /* @__PURE__ */ React.createElement("b", null, title)), /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    justifyContent: "space-between",
    marginY: 1
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2",
    component: "p"
  }, "Created at: ", /* @__PURE__ */ React.createElement("strong", null, getElapsedTime(createdAt))), updatedAt && /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2",
    component: "p"
  }, "Last update: ", /* @__PURE__ */ React.createElement("strong", null, getElapsedTime(updatedAt)))));
};

const Card = (props) => {
  const {
    title,
    createdAt,
    updatedAt,
    prUrl,
    authorName,
    authorAvatar,
    repositoryName,
    children
  } = props;
  return /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 1
  }, /* @__PURE__ */ React.createElement(Paper, {
    variant: "outlined"
  }, /* @__PURE__ */ React.createElement(CardActionArea, {
    href: prUrl,
    target: "_blank"
  }, /* @__PURE__ */ React.createElement(Box, {
    padding: 1
  }, /* @__PURE__ */ React.createElement(CardHeader, {
    title,
    createdAt,
    updatedAt,
    authorName,
    authorAvatar,
    repositoryName
  }), children))));
};

const UserHeaderList = (props) => {
  const { users, label } = props;
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    width: "100%",
    alignItems: "center",
    marginY: 2,
    flexWrap: "wrap"
  }, label && /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2"
  }, label), filterSameUser(users).map(({ login, avatarUrl }) => /* @__PURE__ */ React.createElement(UserHeader, {
    name: login,
    avatar: avatarUrl,
    key: login
  })));
};

const PullRequestCard = (props) => {
  const {
    title,
    createdAt,
    updatedAt,
    author,
    url,
    reviews,
    repositoryName,
    isDraft
  } = props;
  const approvedReviews = getApprovedReviews(reviews);
  const commentsReviews = getCommentedReviews(reviews);
  const changeRequests = getChangeRequests(reviews);
  const cardTitle = isDraft ? `\u{1F527} DRAFT - ${title}` : title;
  return /* @__PURE__ */ React.createElement(Card, {
    title: cardTitle,
    createdAt,
    updatedAt,
    authorName: author.login,
    authorAvatar: author.avatarUrl,
    repositoryName,
    prUrl: url
  }, !!approvedReviews.length && /* @__PURE__ */ React.createElement(UserHeaderList, {
    label: "\u{1F44D}",
    users: approvedReviews.map(({ author: reviewAuthor }) => reviewAuthor)
  }), !!commentsReviews.length && /* @__PURE__ */ React.createElement(UserHeaderList, {
    label: "\u{1F4AC}",
    users: commentsReviews.map(({ author: reviewAuthor }) => reviewAuthor)
  }), !!changeRequests.length && /* @__PURE__ */ React.createElement(UserHeaderList, {
    label: "\u{1F6A7}",
    users: changeRequests.map(({ author: reviewAuthor }) => reviewAuthor)
  }));
};

let octokit;
const useOctokitGraphQl = () => {
  var _a;
  const auth = useApi(githubAuthApiRef);
  const config = useApi(configApiRef);
  const baseUrl = readGitHubIntegrationConfigs((_a = config.getOptionalConfigArray("integrations.github")) != null ? _a : [])[0].apiBaseUrl;
  return (path, options) => auth.getAccessToken(["repo"]).then((token) => {
    if (!octokit) {
      octokit = new Octokit({ auth: token, ...baseUrl && { baseUrl } });
    }
    return octokit;
  }).then((octokitInstance) => {
    return octokitInstance.graphql(path, options);
  });
};

const useGetPullRequestsFromRepository = () => {
  const graphql = useOctokitGraphQl();
  const fn = React.useRef(async (repo) => {
    const [organisation, repositoryName] = repo.split("/");
    const { repository } = await graphql(`
          query ($name: String!, $owner: String!) {
            repository(name: $name, owner: $owner) {
              pullRequests(states: OPEN, first: 10) {
                edges {
                  node {
                    number
                  }
                }
              }
            }
          }
        `, {
      name: repositoryName,
      owner: organisation
    });
    return repository.pullRequests.edges;
  });
  return fn.current;
};

const useGetPullRequestDetails = () => {
  const graphql = useOctokitGraphQl();
  const fn = React.useRef(async (repo, number) => {
    const [organisation, repositoryName] = repo.split("/");
    const { repository } = await graphql(`
          query ($name: String!, $owner: String!, $pull_number: Int!) {
            repository(name: $name, owner: $owner) {
              pullRequest(number: $pull_number) {
                id
                repository {
                  name
                }
                title
                url
                createdAt
                lastEditedAt
                latestReviews(first: 10) {
                  nodes {
                    author {
                      login
                      avatarUrl
                      ... on User {
                        id
                        email
                        name
                        login
                      }
                    }
                    state
                  }
                }
                mergeable
                state
                reviewDecision
                isDraft
                createdAt
                author {
                  ... on User {
                    id
                    email
                    avatarUrl
                    name
                    login
                  }
                  ... on Bot {
                    id
                    avatarUrl
                    login
                  }
                }
              }
            }
          }
        `, {
      name: repositoryName,
      owner: organisation,
      pull_number: number
    });
    return repository.pullRequest;
  });
  return fn.current;
};

function usePullRequestsByTeam(repositories) {
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const getPullRequests = useGetPullRequestsFromRepository();
  const getPullRequestDetails = useGetPullRequestDetails();
  const getPRsPerRepository = useCallback(async (repository) => {
    const pullRequestsNumbers = await getPullRequests(repository);
    const pullRequestsWithDetails = await Promise.all(pullRequestsNumbers.map(({ node }) => getPullRequestDetails(repository, node.number)));
    return pullRequestsWithDetails;
  }, [getPullRequests, getPullRequestDetails]);
  const getPRsFromTeam = useCallback(async (teamRepositories) => {
    const teamRepositoriesPromises = teamRepositories.map((repository) => getPRsPerRepository(repository));
    const teamPullRequests = await Promise.allSettled(teamRepositoriesPromises).then((promises) => promises.reduce((acc, curr) => {
      if (curr.status === "fulfilled") {
        return [...acc, ...curr.value];
      }
      return acc;
    }, []));
    return teamPullRequests;
  }, [getPRsPerRepository]);
  const getAllPullRequests = useCallback(async () => {
    setLoading(true);
    const teamPullRequests = await getPRsFromTeam(repositories);
    setPullRequests(formatPRsByReviewDecision(teamPullRequests));
    setLoading(false);
  }, [getPRsFromTeam, repositories]);
  useEffect(() => {
    getAllPullRequests();
  }, [getAllPullRequests]);
  return {
    pullRequests,
    loading,
    refreshPullRequests: getAllPullRequests
  };
}

const DraftPr = () => /* @__PURE__ */ React.createElement("svg", {
  "aria-hidden": "true",
  height: "16",
  viewBox: "0 0 16 16",
  version: "1.1",
  width: "16",
  "data-view-component": "true"
}, /* @__PURE__ */ React.createElement("path", {
  d: "M2.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.25 1a2.25 2.25 0 00-.75 4.372v5.256a2.251 2.251 0 101.5 0V5.372A2.25 2.25 0 003.25 1zm0 11a.75.75 0 100 1.5.75.75 0 000-1.5zm9.5 3a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zm0-3a.75.75 0 100 1.5.75.75 0 000-1.5z"
}), /* @__PURE__ */ React.createElement("path", {
  d: "M14 7.5a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zm0-4.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"
}));

function useUserRepositories() {
  var _a;
  const { entity: teamEntity } = useEntity();
  const catalogApi = useApi(catalogApiRef);
  const [repositories, setRepositories] = useState([]);
  const getRepositoriesNames = useCallback(async () => {
    var _a2;
    const entitiesList = await catalogApi.getEntities({
      filter: {
        kind: "Component",
        "spec.type": "service",
        "spec.owner": (_a2 = teamEntity == null ? void 0 : teamEntity.metadata) == null ? void 0 : _a2.name
      }
    });
    const entitiesNames = entitiesList.items.map((componentEntity) => getProjectNameFromEntity(componentEntity));
    setRepositories([...new Set(entitiesNames)]);
  }, [catalogApi, (_a = teamEntity == null ? void 0 : teamEntity.metadata) == null ? void 0 : _a.name]);
  useEffect(() => {
    getRepositoriesNames();
  }, [getRepositoriesNames]);
  return {
    repositories
  };
}

export { DraftPr as D, InfoCardHeader as I, PullRequestBoardOptions as P, Wrapper as W, usePullRequestsByTeam as a, PullRequestCard as b, useUserRepositories as u };
//# sourceMappingURL=useUserRepositories-fabfff57.esm.js.map
