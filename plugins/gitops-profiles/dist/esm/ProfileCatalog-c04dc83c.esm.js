import React, { useState, useEffect } from 'react';
import { Grid, createStyles as createStyles$1, Card as Card$1, CardHeader as CardHeader$1, Avatar as Avatar$1, IconButton as IconButton$1, CardContent as CardContent$1, Typography as Typography$1, CardActions as CardActions$1, List, ListItem, TextField, Link } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red, green } from '@material-ui/core/colors';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import { gitOpsApiRef } from '../index.esm.js';
import { Page, Header, HeaderLabel, Content, ContentHeader, SupportButton, SimpleStepper, SimpleStepperStep, InfoCard, Progress, Table, StatusRunning, StatusOK, StatusError, StatusAborted, StatusWarning, StatusPending } from '@backstage/core-components';
import { useApi, githubAuthApiRef } from '@backstage/core-plugin-api';

const useStyles$1 = makeStyles((theme) => createStyles({
  root: {
    maxWidth: 345
  },
  media: {
    height: 0,
    paddingTop: "56.25%"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    fontSize: "1.0rem",
    backgroundColor: red[500]
  }
}));
const ClusterTemplateCard = (props) => {
  const classes = useStyles$1();
  const handleSelect = () => {
    props.onClick(props.index, props.repository);
  };
  return /* @__PURE__ */ React.createElement(Card, {
    className: classes.root
  }, /* @__PURE__ */ React.createElement(CardHeader, {
    avatar: /* @__PURE__ */ React.createElement(Avatar, {
      "aria-label": "recipe",
      className: classes.avatar
    }, props.platformName),
    action: /* @__PURE__ */ React.createElement(IconButton, {
      "aria-label": "settings"
    }),
    title: props.title,
    subheader: props.repository
  }), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2",
    color: "textSecondary",
    component: "p"
  }, props.description)), /* @__PURE__ */ React.createElement(CardActions, {
    disableSpacing: true
  }, /* @__PURE__ */ React.createElement(IconButton, {
    "aria-label": "select",
    onClick: handleSelect
  }, props.activeIndex === props.index ? /* @__PURE__ */ React.createElement(CheckBoxIcon, {
    color: "primary"
  }) : /* @__PURE__ */ React.createElement(CheckBoxOutlineBlankIcon, null))));
};

const ClusterTemplateCardList = (props) => {
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const handleClicked = (index, repository) => {
    setActiveIndex(index);
    window.localStorage.setItem("gitops-template-repo", repository);
  };
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    xl: 12,
    spacing: 4
  }, props.template.map((value, index) => /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xl: 2,
    key: index
  }, /* @__PURE__ */ React.createElement(ClusterTemplateCard, {
    activeIndex,
    onClick: handleClicked,
    index,
    key: index,
    platformName: value.platformName,
    title: value.title,
    repository: value.repository,
    description: value.description
  }))));
};

const useStyles = makeStyles((theme) => createStyles$1({
  root: {
    maxWidth: 345
  },
  media: {
    height: 0,
    paddingTop: "56.25%"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: green[500]
  }
}));
const ProfileCard = (props) => {
  const [selection, setSelection] = useState(false);
  const handleSelect = () => {
    props.onClick(props.index, props.repository);
    setSelection(props.selections.has(props.index));
  };
  const classes = useStyles();
  return /* @__PURE__ */ React.createElement(Card$1, {
    className: classes.root
  }, /* @__PURE__ */ React.createElement(CardHeader$1, {
    avatar: /* @__PURE__ */ React.createElement(Avatar$1, {
      "aria-label": "recipe",
      className: classes.avatar
    }, props.shortName),
    action: /* @__PURE__ */ React.createElement(IconButton$1, {
      "aria-label": "settings"
    }),
    title: props.title,
    subheader: props.repository.replace("https://github.com/", "")
  }), /* @__PURE__ */ React.createElement(CardContent$1, null, /* @__PURE__ */ React.createElement(Typography$1, {
    variant: "body2",
    color: "textSecondary",
    component: "p"
  }, props.description)), /* @__PURE__ */ React.createElement(CardActions$1, {
    disableSpacing: true
  }, /* @__PURE__ */ React.createElement(IconButton$1, {
    "aria-label": "select",
    onClick: handleSelect
  }, selection ? /* @__PURE__ */ React.createElement(CheckBoxIcon, {
    color: "primary"
  }) : /* @__PURE__ */ React.createElement(CheckBoxOutlineBlankIcon, null))));
};

const ProfileCardList = (props) => {
  const [selections, setSelections] = useState(/* @__PURE__ */ new Set());
  const [profiles, setProfiles] = useState(/* @__PURE__ */ new Set());
  const handleClicked = (index, repository) => {
    if (selections.has(index)) {
      selections.delete(index);
      profiles.delete(repository);
    } else {
      selections.add(index);
      profiles.add(repository);
    }
    setSelections(selections);
    setProfiles(profiles);
    window.localStorage.setItem("gitops-profiles", JSON.stringify(Array.from(profiles)));
  };
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    xl: 12,
    spacing: 4
  }, props.profileTemplates.map((value, index) => /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xl: 2,
    key: index
  }, /* @__PURE__ */ React.createElement(ProfileCard, {
    shortName: value.shortName,
    selections,
    onClick: handleClicked,
    key: index,
    index,
    title: value.title,
    repository: value.repository,
    description: value.description
  }))));
};

const transformStatus = (value) => {
  let status = /* @__PURE__ */ React.createElement(StatusRunning, null, "Unknown");
  if (value.status === "completed" && value.conclusion === "success") {
    status = /* @__PURE__ */ React.createElement(StatusOK, null, "Success");
  } else if (value.conclusion === "failure") {
    status = /* @__PURE__ */ React.createElement(StatusError, null, "Failure");
  } else if (value.conclusion === "cancelled") {
    status = /* @__PURE__ */ React.createElement(StatusAborted, null, "Cancelled");
  } else if (value.conclusion === "timed_out") {
    status = /* @__PURE__ */ React.createElement(StatusError, null, "Timed out");
  } else if (value.conclusion === "skipped") {
    status = /* @__PURE__ */ React.createElement(StatusWarning, null, "Skipped");
  } else if (value.status === "queued") {
    status = /* @__PURE__ */ React.createElement(StatusPending, null, "Queued");
  } else if (value.status === "in_progress") {
    status = /* @__PURE__ */ React.createElement(StatusRunning, null, "In Progress");
  }
  return status;
};
const transformRunStatus = (x) => {
  return x.map((value) => {
    return {
      status: transformStatus(value),
      message: value.message
    };
  });
};
const ProfileCatalog = () => {
  const [clusterTemplates] = React.useState([
    {
      platformName: "15m",
      title: "EKS 2 workers",
      repository: "chanwit/eks-cluster-template",
      description: "EKS with Kubernetes 1.16 / 2 nodes of m5.xlarge (15 mins)"
    },
    {
      platformName: "15m",
      title: "EKS 1 worker",
      repository: "chanwit/template-2",
      description: "EKS with Kubernetes 1.16 / 1 node of m5.xlarge (15 mins)"
    }
  ]);
  const [profileTemplates] = React.useState([
    {
      shortName: "ml",
      title: "MLOps",
      repository: "https://github.com/weaveworks/mlops-profile",
      description: "Kubeflow-based Machine Learning pipeline"
    },
    {
      shortName: "ai",
      title: "COVID ML",
      repository: "https://github.com/weaveworks/covid-ml-profile",
      description: "Fk-covid Application profile"
    }
  ]);
  const [templateRepo] = useLocalStorage("gitops-template-repo");
  const [gitopsProfiles] = useLocalStorage("gitops-profiles");
  const [showProgress, setShowProgress] = useState(false);
  const [pollingLog, setPollingLog] = useState(false);
  const [gitHubOrg, setGitHubOrg] = useState(String);
  const [gitHubRepo, setGitHubRepo] = useState("new-cluster");
  const [awsAccessKeyId, setAwsAccessKeyId] = useState(String);
  const [awsSecretAccessKey, setAwsSecretAccessKey] = useState(String);
  const [runStatus, setRunStatus] = useState([]);
  const [runLink, setRunLink] = useState("");
  const api = useApi(gitOpsApiRef);
  const githubAuth = useApi(githubAuthApiRef);
  const [githubAccessToken, setGithubAccessToken] = useState(String);
  const [githubUsername, setGithubUsername] = useState(String);
  useEffect(() => {
    const fetchGithubUserInfo = async () => {
      const accessToken = await githubAuth.getAccessToken(["repo", "user"]);
      const userInfo = await api.fetchUserInfo({ accessToken });
      setGithubAccessToken(accessToken);
      setGithubUsername(userInfo.login);
      setGitHubOrg(userInfo.login);
    };
    if (!githubAccessToken || !githubUsername) {
      fetchGithubUserInfo();
    } else {
      if (pollingLog) {
        const interval = setInterval(async () => {
          const resp = await api.fetchLog({
            gitHubToken: githubAccessToken,
            gitHubUser: githubUsername,
            targetOrg: gitHubOrg,
            targetRepo: gitHubRepo
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
  }, [
    pollingLog,
    api,
    gitHubOrg,
    gitHubRepo,
    githubAuth,
    githubAccessToken,
    githubUsername
  ]);
  const showFailureMessage = (msg) => {
    setRunStatus(runStatus.concat([
      {
        status: "completed",
        message: msg,
        conclusion: "failure"
      }
    ]));
  };
  const showSuccessMessage = (msg) => {
    setRunStatus(runStatus.concat([
      {
        status: "completed",
        message: msg,
        conclusion: "success"
      }
    ]));
  };
  const doCreateCluster = async () => {
    setShowProgress(true);
    setRunStatus([]);
    const cloneResponse = await api.cloneClusterFromTemplate({
      templateRepository: templateRepo,
      gitHubToken: githubAccessToken,
      gitHubUser: githubUsername,
      targetOrg: gitHubOrg,
      targetRepo: gitHubRepo,
      secrets: {
        awsAccessKeyId,
        awsSecretAccessKey
      }
    });
    if (cloneResponse.error === void 0) {
      showSuccessMessage("Forked new cluster repo");
    } else {
      setShowProgress(false);
      showFailureMessage(cloneResponse.error);
    }
    const applyProfileResp = await api.applyProfiles({
      gitHubToken: githubAccessToken,
      gitHubUser: githubUsername,
      targetOrg: gitHubOrg,
      targetRepo: gitHubRepo,
      profiles: gitopsProfiles
    });
    if (applyProfileResp.error === void 0) {
      showSuccessMessage("Applied profiles to the repo");
    } else {
      setShowProgress(false);
      showFailureMessage(applyProfileResp.error);
    }
    const clusterStateResp = await api.changeClusterState({
      gitHubToken: githubAccessToken,
      gitHubUser: githubUsername,
      targetOrg: gitHubOrg,
      targetRepo: gitHubRepo,
      clusterState: "present"
    });
    if (clusterStateResp.error === void 0) {
      setPollingLog(true);
      showSuccessMessage("Changed desired cluster state to present");
    } else {
      setPollingLog(false);
      setShowProgress(false);
      showFailureMessage(clusterStateResp.error);
    }
  };
  const columns = [
    { field: "status", title: "Status" },
    { field: "message", title: "Message" }
  ];
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "tool"
  }, /* @__PURE__ */ React.createElement(Header, {
    title: "Create GitOps-managed Cluster",
    subtitle: "Kubernetes cluster with ready-to-use profiles"
  }, /* @__PURE__ */ React.createElement(HeaderLabel, {
    label: "Welcome",
    value: githubUsername
  })), /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: "Create Cluster"
  }, /* @__PURE__ */ React.createElement(SupportButton, null, "A description of your plugin goes here.")), /* @__PURE__ */ React.createElement(SimpleStepper, null, /* @__PURE__ */ React.createElement(SimpleStepperStep, {
    title: "Choose Cluster Template"
  }, /* @__PURE__ */ React.createElement(ClusterTemplateCardList, {
    template: clusterTemplates
  })), /* @__PURE__ */ React.createElement(SimpleStepperStep, {
    title: "Select GitOps Profile"
  }, /* @__PURE__ */ React.createElement(ProfileCardList, {
    profileTemplates
  })), /* @__PURE__ */ React.createElement(SimpleStepperStep, {
    title: "Create Cluster",
    actions: { nextText: "Create", onNext: () => doCreateCluster() }
  }, /* @__PURE__ */ React.createElement(InfoCard, null, /* @__PURE__ */ React.createElement(List, null, /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(TextField, {
    name: "github-org-tf",
    label: "GitHub Organization",
    defaultValue: gitHubOrg,
    required: true,
    onChange: (e) => {
      setGitHubOrg(e.target.value);
    }
  })), /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(TextField, {
    name: "github-repo-tf",
    label: "New Repository",
    defaultValue: gitHubRepo,
    required: true,
    onChange: (e) => {
      setGitHubRepo(e.target.value);
    }
  })), /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(TextField, {
    name: "aws-access-key-id-tf",
    label: "Access Key ID",
    required: true,
    type: "password",
    onChange: (e) => {
      setAwsAccessKeyId(e.target.value);
    }
  })), /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(TextField, {
    name: "aws-secret-access-key-tf",
    label: "Secret Access Key",
    required: true,
    type: "password",
    onChange: (e) => {
      setAwsSecretAccessKey(e.target.value);
    }
  })))))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Progress, {
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
  }, "Details"))));
};
var ProfileCatalog$1 = ProfileCatalog;

export { ProfileCatalog$1 as P, transformRunStatus as a, transformStatus as t };
//# sourceMappingURL=ProfileCatalog-c04dc83c.esm.js.map
