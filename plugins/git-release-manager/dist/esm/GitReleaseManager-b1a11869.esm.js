import React, { useState, createContext, useContext, useEffect } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography, Button, Tooltip, makeStyles, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Collapse, withStyles, createStyles, Dialog, List, ListItem, ListItemIcon, Checkbox, ListItemText, ListItemSecondaryAction, FormHelperText, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import { Progress, Link, ErrorBoundary, ContentHeader } from '@backstage/core-components';
import { g as getSemverTagParts, a as getBumpedSemverTagParts, G as GitReleaseManagerError, b as gitReleaseManagerApiRef, T as TAG_OBJECT_MESSAGE, S as SEMVER_PARTS, R as ResponseStepDialog, c as TEST_IDS, D as Differ, I as InfoCardPlus, s as semverRegexp, d as calverRegexp, L as LinearProgressWithLabel, e as Transition, N as NoLatestRelease, f as getBumpedTag, h as getTagParts, v as validateTagName, i as RefetchContext, V as VERSIONING_STRATEGIES, j as isProjectValid } from './index-08755cda.esm.js';
import { DateTime } from 'luxon';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import BarChartIcon from '@material-ui/icons/BarChart';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import { BarChart, XAxis, YAxis, Tooltip as Tooltip$1, Legend, Bar } from 'recharts';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import flowImage from '../features/Info/flow.png';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { useLocation, useNavigate } from 'react-router';
import qs from 'qs';
import '@octokit/rest';
import '@backstage/integration';
import '@material-ui/core/colors';
import '@material-ui/icons/CallSplit';
import '@material-ui/icons/Chat';
import '@material-ui/icons/DynamicFeed';
import '@material-ui/icons/GitHub';
import '@material-ui/icons/LocalOffer';
import '@material-ui/icons/CheckCircleOutline';
import '@material-ui/icons/ErrorOutline';
import '@material-ui/icons/FiberManualRecord';

const getReleaseCandidateGitInfo = ({
  project,
  latestRelease,
  semverBumpLevel,
  injectedDate = DateTime.now().toFormat("yyyy.MM.dd")
}) => {
  if (project.versioningStrategy === "calver") {
    return {
      rcBranch: `rc/${injectedDate}`,
      rcReleaseTag: `rc-${injectedDate}_0`,
      releaseName: `Version ${injectedDate}`
    };
  }
  if (!latestRelease) {
    return {
      rcBranch: "rc/0.0.1",
      rcReleaseTag: "rc-0.0.1",
      releaseName: "Version 0.0.1"
    };
  }
  const semverTagParts = getSemverTagParts(latestRelease.tagName);
  if (semverTagParts.error !== void 0) {
    return {
      error: semverTagParts.error
    };
  }
  const { bumpedTagParts } = getBumpedSemverTagParts(semverTagParts.tagParts, semverBumpLevel);
  const bumpedTag = `${bumpedTagParts.major}.${bumpedTagParts.minor}.${bumpedTagParts.patch}`;
  return {
    rcBranch: `rc/${bumpedTag}`,
    rcReleaseTag: `rc-${bumpedTag}`,
    releaseName: `Version ${bumpedTag}`
  };
};

function useResponseSteps() {
  const [responseSteps, setResponseSteps] = useState([]);
  const addStepToResponseSteps = (responseStep) => {
    setResponseSteps([...responseSteps, responseStep]);
  };
  const asyncCatcher = (error) => {
    const responseStepError = {
      message: /* @__PURE__ */ React.createElement("b", null, "Something went wrong", " ", /* @__PURE__ */ React.createElement("span", {
        role: "img",
        "aria-label": "fire"
      }, "\u{1F525}")),
      secondaryMessage: `Error message: ${(error == null ? void 0 : error.message) ? error.message : "unknown"}`,
      icon: "failure"
    };
    addStepToResponseSteps(responseStepError);
    throw error;
  };
  const abortIfError = (error) => {
    if (error) {
      throw error;
    }
  };
  return {
    responseSteps,
    addStepToResponseSteps,
    asyncCatcher,
    abortIfError
  };
}

const UserContext = createContext(void 0);
const useUserContext = () => {
  var _a;
  const { user } = (_a = useContext(UserContext)) != null ? _a : {};
  if (!user) {
    throw new GitReleaseManagerError("user not found");
  }
  return {
    user
  };
};

function useCreateReleaseCandidate({
  defaultBranch,
  latestRelease,
  releaseCandidateGitInfo,
  project,
  onSuccess
}) {
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { user } = useUserContext();
  if (releaseCandidateGitInfo.error) {
    throw new GitReleaseManagerError(`Unexpected error: ${releaseCandidateGitInfo.error.title ? `${releaseCandidateGitInfo.error.title} (${releaseCandidateGitInfo.error.subtitle})` : releaseCandidateGitInfo.error.subtitle}`);
  }
  const { responseSteps, addStepToResponseSteps, asyncCatcher, abortIfError } = useResponseSteps();
  const [latestCommitRes, run] = useAsyncFn(async () => {
    const { commit: latestCommit } = await pluginApiClient.getCommit({
      owner: project.owner,
      repo: project.repo,
      ref: defaultBranch
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: `Fetched latest commit from "${defaultBranch}"`,
      secondaryMessage: `with message "${latestCommit.commit.message}"`,
      link: latestCommit.htmlUrl
    });
    return {
      latestCommit
    };
  });
  const releaseBranchRes = useAsync(async () => {
    abortIfError(latestCommitRes.error);
    if (!latestCommitRes.value)
      return void 0;
    const { reference: createdReleaseBranch } = await pluginApiClient.createRef({
      owner: project.owner,
      repo: project.repo,
      sha: latestCommitRes.value.latestCommit.sha,
      ref: `refs/heads/${releaseCandidateGitInfo.rcBranch}`
    }).catch((error) => {
      var _a;
      if (((_a = error == null ? void 0 : error.body) == null ? void 0 : _a.message) === "Reference already exists") {
        throw new GitReleaseManagerError(`Branch "${releaseCandidateGitInfo.rcBranch}" already exists: .../tree/${releaseCandidateGitInfo.rcBranch}`);
      }
      throw error;
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: "Created Release Branch",
      secondaryMessage: `with ref "${createdReleaseBranch.ref}"`
    });
    return {
      ...createdReleaseBranch
    };
  }, [latestCommitRes.value, latestCommitRes.error]);
  const tagObjectRes = useAsync(async () => {
    abortIfError(releaseBranchRes.error);
    if (!releaseBranchRes.value)
      return void 0;
    const { tagObject } = await pluginApiClient.createTagObject({
      owner: project.owner,
      repo: project.repo,
      tag: releaseCandidateGitInfo.rcReleaseTag,
      object: releaseBranchRes.value.objectSha,
      taggerName: user.username,
      taggerEmail: user.email,
      message: TAG_OBJECT_MESSAGE
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: "Created Tag Object",
      secondaryMessage: `with sha "${tagObject.tagSha}"`
    });
    return {
      ...tagObject
    };
  }, [releaseBranchRes.value, releaseBranchRes.error]);
  const createRcRes = useAsync(async () => {
    abortIfError(tagObjectRes.error);
    if (!tagObjectRes.value)
      return void 0;
    const { reference: createdRef } = await pluginApiClient.createRef({
      owner: project.owner,
      repo: project.repo,
      ref: `refs/tags/${releaseCandidateGitInfo.rcReleaseTag}`,
      sha: tagObjectRes.value.tagSha
    }).catch((error) => {
      var _a;
      if (((_a = error == null ? void 0 : error.body) == null ? void 0 : _a.message) === "Reference already exists") {
        throw new GitReleaseManagerError(`Tag reference "${releaseCandidateGitInfo.rcReleaseTag}" already exists`);
      }
      throw error;
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: "Cut Tag Reference",
      secondaryMessage: `with ref "${createdRef.ref}"`
    });
    return {
      ...createdRef
    };
  }, [tagObjectRes.value, tagObjectRes.error]);
  const getComparisonRes = useAsync(async () => {
    abortIfError(createRcRes.error);
    if (!createRcRes.value)
      return void 0;
    const previousReleaseBranch = latestRelease ? latestRelease.targetCommitish : defaultBranch;
    const nextReleaseBranch = releaseCandidateGitInfo.rcBranch;
    const { comparison } = await pluginApiClient.getComparison({
      owner: project.owner,
      repo: project.repo,
      base: previousReleaseBranch,
      head: nextReleaseBranch
    }).catch(asyncCatcher);
    const releaseBody = `**Compare** ${comparison.htmlUrl}

**Ahead by** ${comparison.aheadBy} commits

**Release branch** ${createRcRes.value.ref}

---

`;
    addStepToResponseSteps({
      message: "Fetched commit comparison",
      secondaryMessage: `${previousReleaseBranch}...${nextReleaseBranch}`,
      link: comparison.htmlUrl
    });
    return {
      ...comparison,
      releaseBody
    };
  }, [createRcRes.value, createRcRes.error]);
  const createReleaseRes = useAsync(async () => {
    abortIfError(getComparisonRes.error);
    if (!getComparisonRes.value)
      return void 0;
    const { release: createReleaseResult } = await pluginApiClient.createRelease({
      owner: project.owner,
      repo: project.repo,
      tagName: releaseCandidateGitInfo.rcReleaseTag,
      name: releaseCandidateGitInfo.releaseName,
      targetCommitish: releaseCandidateGitInfo.rcBranch,
      body: getComparisonRes.value.releaseBody
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: `Created Release Candidate "${createReleaseResult.name}"`,
      secondaryMessage: `with tag "${releaseCandidateGitInfo.rcReleaseTag}"`,
      link: createReleaseResult.htmlUrl
    });
    return {
      ...createReleaseResult
    };
  }, [getComparisonRes.value, getComparisonRes.error]);
  useAsync(async () => {
    if (onSuccess && !!createReleaseRes.value && !!getComparisonRes.value) {
      abortIfError(createReleaseRes.error);
      try {
        await onSuccess({
          input: {
            defaultBranch,
            latestRelease,
            releaseCandidateGitInfo,
            project
          },
          comparisonUrl: getComparisonRes.value.htmlUrl,
          createdTag: createReleaseRes.value.tagName,
          gitReleaseName: createReleaseRes.value.name,
          gitReleaseUrl: createReleaseRes.value.htmlUrl,
          previousTag: latestRelease == null ? void 0 : latestRelease.tagName
        });
      } catch (error) {
        asyncCatcher(error);
      }
      addStepToResponseSteps({
        message: "Success callback successfully called \u{1F680}",
        icon: "success"
      });
    }
  }, [createReleaseRes.value, createReleaseRes.error]);
  const TOTAL_STEPS = 6 + (!!onSuccess ? 1 : 0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(responseSteps.length / TOTAL_STEPS * 100);
  }, [TOTAL_STEPS, responseSteps.length]);
  return {
    progress,
    responseSteps,
    run,
    runInvoked: Boolean(latestCommitRes.loading || latestCommitRes.value || latestCommitRes.error)
  };
}

const ProjectContext = createContext(void 0);
const useProjectContext = () => {
  var _a;
  const { project } = (_a = useContext(ProjectContext)) != null ? _a : {};
  if (!project) {
    throw new GitReleaseManagerError("project not found");
  }
  return {
    project
  };
};

const InfoCardPlusWrapper = ({ children }) => {
  return /* @__PURE__ */ React.createElement(InfoCardPlus, null, /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 2
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h4"
  }, "Create Release Candidate")), children);
};
const CreateReleaseCandidate = ({
  defaultBranch,
  latestRelease,
  releaseBranch,
  onSuccess
}) => {
  const { project } = useProjectContext();
  const [semverBumpLevel, setSemverBumpLevel] = useState(SEMVER_PARTS.minor);
  const [releaseCandidateGitInfo, setReleaseCandidateGitInfo] = useState(getReleaseCandidateGitInfo({ latestRelease, project, semverBumpLevel }));
  useEffect(() => {
    setReleaseCandidateGitInfo(getReleaseCandidateGitInfo({ latestRelease, project, semverBumpLevel }));
  }, [semverBumpLevel, setReleaseCandidateGitInfo, latestRelease, project]);
  const { progress, responseSteps, run, runInvoked } = useCreateReleaseCandidate({
    defaultBranch,
    latestRelease,
    releaseCandidateGitInfo,
    project,
    onSuccess
  });
  if (responseSteps.length > 0) {
    return /* @__PURE__ */ React.createElement(ResponseStepDialog, {
      progress,
      responseSteps,
      title: "Create Release Candidate"
    });
  }
  if (releaseCandidateGitInfo.error !== void 0) {
    return /* @__PURE__ */ React.createElement(InfoCardPlusWrapper, null, /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, releaseCandidateGitInfo.error.title && /* @__PURE__ */ React.createElement(AlertTitle, null, releaseCandidateGitInfo.error.title), releaseCandidateGitInfo.error.subtitle));
  }
  const tagAlreadyExists = latestRelease !== null && latestRelease.tagName === releaseCandidateGitInfo.rcReleaseTag;
  const conflictingPreRelease = latestRelease !== null && latestRelease.prerelease;
  return /* @__PURE__ */ React.createElement(InfoCardPlusWrapper, null, project.versioningStrategy === "semver" && latestRelease && !conflictingPreRelease && /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 2,
    "data-testid": TEST_IDS.createRc.semverSelect
  }, /* @__PURE__ */ React.createElement(FormControl, {
    style: { margin: 5, minWidth: 250 }
  }, /* @__PURE__ */ React.createElement(InputLabel, null, "Select bump severity"), /* @__PURE__ */ React.createElement(Select, {
    value: semverBumpLevel,
    onChange: ({ target: { value: semverSeverity } }) => {
      setSemverBumpLevel(semverSeverity);
    }
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    value: SEMVER_PARTS.minor
  }, SEMVER_PARTS.minor), /* @__PURE__ */ React.createElement(MenuItem, {
    value: SEMVER_PARTS.major
  }, SEMVER_PARTS.major)))), conflictingPreRelease || tagAlreadyExists ? /* @__PURE__ */ React.createElement(React.Fragment, null, conflictingPreRelease && /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 2
  }, /* @__PURE__ */ React.createElement(Alert, {
    severity: "warning"
  }, "The most recent release is already a Release Candidate")), tagAlreadyExists && /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 2
  }, /* @__PURE__ */ React.createElement(Alert, {
    severity: "warning"
  }, "There's already a tag named", " ", /* @__PURE__ */ React.createElement("strong", null, releaseCandidateGitInfo.rcReleaseTag)))) : /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 2
  }, /* @__PURE__ */ React.createElement(Typography, null, /* @__PURE__ */ React.createElement(Differ, {
    icon: "branch",
    current: releaseBranch == null ? void 0 : releaseBranch.name,
    next: releaseCandidateGitInfo.rcBranch
  })), /* @__PURE__ */ React.createElement(Typography, null, /* @__PURE__ */ React.createElement(Differ, {
    icon: "tag",
    current: latestRelease == null ? void 0 : latestRelease.tagName,
    next: releaseCandidateGitInfo.rcReleaseTag
  }))), /* @__PURE__ */ React.createElement(Button, {
    "data-testid": TEST_IDS.createRc.cta,
    disabled: conflictingPreRelease || tagAlreadyExists || runInvoked,
    variant: "contained",
    color: "primary",
    onClick: () => run()
  }, "Create Release Candidate"));
};

function getMappedReleases({
  allReleases,
  project
}) {
  return {
    mappedReleases: allReleases.reduce((acc, release) => {
      const match = project.versioningStrategy === "semver" ? release.tagName.match(semverRegexp) : release.tagName.match(calverRegexp);
      if (!match) {
        acc.unmatchedReleases.push(release.tagName);
        return acc;
      }
      const baseVersion = project.versioningStrategy === "semver" ? `${match[2]}.${match[3]}` : match[2];
      if (!acc.releases[baseVersion]) {
        acc.releases[baseVersion] = {
          baseVersion,
          createdAt: release.createdAt,
          htmlUrl: release.htmlUrl,
          candidates: [],
          versions: []
        };
        return acc;
      }
      return acc;
    }, {
      releases: {},
      unmappableTags: [],
      unmatchedReleases: [],
      unmatchedTags: []
    })
  };
}

function getReleaseStats({
  allTags,
  project,
  mappedReleases
}) {
  const releaseStats = allTags.reduce((acc, tag) => {
    const match = project.versioningStrategy === "semver" ? tag.tagName.match(semverRegexp) : tag.tagName.match(calverRegexp);
    if (!match) {
      acc.unmatchedTags.push(tag.tagName);
      return acc;
    }
    const prefix = match[1];
    const baseVersion = project.versioningStrategy === "semver" ? `${match[2]}.${match[3]}` : match[2];
    const release = acc.releases[baseVersion];
    if (!release) {
      acc.unmappableTags.push(tag.tagName);
      return acc;
    }
    const dest = release[prefix === "rc" ? "candidates" : "versions"];
    dest.push(tag);
    return acc;
  }, {
    ...mappedReleases
  });
  return {
    releaseStats
  };
}

function getDecimalNumber(n, decimals = 2) {
  if (isNaN(n)) {
    return 0;
  }
  if (n.toString().includes(".")) {
    return parseFloat(n.toFixed(decimals));
  }
  return n;
}

function AverageReleaseTime({
  averageReleaseTime
}) {
  if (averageReleaseTime.length === 0) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, "-");
  }
  const average = averageReleaseTime.reduce((acc, { daysWithHours }) => {
    acc.daysWithHours += daysWithHours / averageReleaseTime.length;
    return acc;
  }, { daysWithHours: 0 });
  const days = Math.floor(average.daysWithHours);
  const hours = getDecimalNumber((average.daysWithHours - days) * 24, 1);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, days, " days ", hours, " hours");
}

function LongestReleaseTime({
  averageReleaseTime
}) {
  if (averageReleaseTime.length === 0) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, "-");
  }
  const longestRelease = [...averageReleaseTime].sort((a, b) => b.daysWithHours - a.daysWithHours)[0];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, longestRelease.version, " (", longestRelease.days, " days", " ", getDecimalNumber(longestRelease.hours, 1), " hours )");
}

function getReleaseCommitPairs({
  releaseStats
}) {
  const releaseCommitPairs = Object.values(releaseStats.releases).reduce((acc, release) => {
    const startTag = [...release.candidates].reverse()[0];
    const endTag = release.versions[0];
    if (!startTag) {
      return acc;
    }
    if (!endTag) {
      return acc;
    }
    return acc.concat({
      baseVersion: release.baseVersion,
      startCommit: { ...startTag },
      endCommit: { ...endTag }
    });
  }, []);
  return {
    releaseCommitPairs
  };
}

const ReleaseStatsContext = createContext(void 0);
const useReleaseStatsContext = () => {
  var _a;
  const { releaseStats } = (_a = useContext(ReleaseStatsContext)) != null ? _a : {};
  if (!releaseStats) {
    throw new GitReleaseManagerError("releaseStats not found");
  }
  return {
    releaseStats
  };
};

const getTagDates = async ({
  pluginApiClient,
  project,
  startTag,
  endTag
}) => {
  if (!endTag) {
    if (startTag.tagType === "tag") {
      const { tag: startTagResponse } = await pluginApiClient.getTag({
        owner: project.owner,
        repo: project.repo,
        tagSha: startTag.tagSha
      });
      return {
        startDate: startTagResponse.date,
        endDate: void 0
      };
    }
    const { commit: startCommit } = await pluginApiClient.getCommit({
      owner: project.owner,
      repo: project.repo,
      ref: startTag.tagSha
    });
    return {
      startDate: startCommit.createdAt,
      endDate: void 0
    };
  }
  if (startTag.tagType === "tag" && endTag.tagType === "tag") {
    const [{ tag: startTagResponse }, { tag: endTagResponse }] = await Promise.all([
      pluginApiClient.getTag({
        owner: project.owner,
        repo: project.repo,
        tagSha: startTag.tagSha
      }),
      pluginApiClient.getTag({
        owner: project.owner,
        repo: project.repo,
        tagSha: endTag.tagSha
      })
    ]);
    return {
      startDate: startTagResponse.date,
      endDate: endTagResponse.date
    };
  }
  if (startTag.tagType === "commit" && endTag.tagType === "commit") {
    const [{ commit: startCommit }, { commit: endCommit }] = await Promise.all([
      pluginApiClient.getCommit({
        owner: project.owner,
        repo: project.repo,
        ref: startTag.tagSha
      }),
      pluginApiClient.getCommit({
        owner: project.owner,
        repo: project.repo,
        ref: endTag.tagSha
      })
    ]);
    return {
      startDate: startCommit.createdAt,
      endDate: endCommit.createdAt
    };
  }
  if (startTag.tagType === "tag" && endTag.tagType === "commit") {
    const [{ date: startDate }, { commit: endCommit }] = await Promise.all([
      getCommitFromTag({ pluginApiClient, project, tag: startTag }),
      pluginApiClient.getCommit({
        owner: project.owner,
        repo: project.repo,
        ref: endTag.tagSha
      })
    ]);
    return {
      startDate,
      endDate: endCommit.createdAt
    };
  }
  if (startTag.tagType === "commit" && endTag.tagType === "tag") {
    const [{ commit: startCommit }, { date: endDate }] = await Promise.all([
      pluginApiClient.getCommit({
        owner: project.owner,
        repo: project.repo,
        ref: startTag.tagSha
      }),
      getCommitFromTag({ pluginApiClient, project, tag: endTag })
    ]);
    return {
      startDate: startCommit.createdAt,
      endDate
    };
  }
  throw new GitReleaseManagerError(`Failed to get tag dates for tags with type "${startTag.tagType}" and "${endTag.tagType}"`);
};
async function getCommitFromTag({
  pluginApiClient,
  project,
  tag
}) {
  const { tag: tagResponse } = await pluginApiClient.getTag({
    owner: project.owner,
    repo: project.repo,
    tagSha: tag.tagSha
  });
  const { commit: startCommit } = await pluginApiClient.getCommit({
    owner: project.owner,
    repo: project.repo,
    ref: tagResponse.objectSha
  });
  return {
    date: startCommit.createdAt
  };
}

function useGetReleaseTimes() {
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { project } = useProjectContext();
  const { releaseStats } = useReleaseStatsContext();
  const [averageReleaseTime, setAverageReleaseTime] = useState([]);
  const [progress, setProgress] = useState(0);
  const { releaseCommitPairs } = getReleaseCommitPairs({ releaseStats });
  const [releaseTimeResult, run] = useAsyncFn(() => {
    setProgress(0);
    return getAndSetReleaseTime({ pairIndex: 0 });
  });
  useAsync(async () => {
    if (averageReleaseTime.length === 0)
      return;
    if (releaseCommitPairs.length === averageReleaseTime.length)
      return;
    await getAndSetReleaseTime({ pairIndex: averageReleaseTime.length });
  }, [releaseTimeResult.value, averageReleaseTime]);
  useEffect(() => {
    const unboundedProgress = Math.round(averageReleaseTime.length / releaseCommitPairs.length * 100);
    const boundedProgress = unboundedProgress > 100 ? 100 : unboundedProgress;
    setProgress(boundedProgress);
  }, [averageReleaseTime.length, releaseCommitPairs.length]);
  async function getAndSetReleaseTime({ pairIndex }) {
    const { baseVersion, startCommit, endCommit } = releaseCommitPairs[pairIndex];
    const { startDate: startCommitCreatedAt, endDate: endCommitCreatedAt } = await getTagDates({
      pluginApiClient,
      project,
      startTag: startCommit,
      endTag: endCommit
    });
    const releaseTime = {
      version: baseVersion,
      daysWithHours: 0,
      days: 0,
      hours: 0,
      startCommitCreatedAt,
      endCommitCreatedAt
    };
    if (startCommitCreatedAt && endCommitCreatedAt) {
      const { days: luxDays = 0, hours: luxHours = 0 } = DateTime.fromISO(endCommitCreatedAt).diff(DateTime.fromISO(startCommitCreatedAt), ["days", "hours"]).toObject();
      releaseTime.daysWithHours = luxDays + luxHours / 24;
      releaseTime.days = luxDays;
      releaseTime.hours = luxHours;
    }
    setAverageReleaseTime([...averageReleaseTime, releaseTime]);
  }
  return {
    releaseCommitPairs,
    averageReleaseTime,
    progress,
    run
  };
}

function InDepth() {
  const { releaseStats } = useReleaseStatsContext();
  const { averageReleaseTime, progress, releaseCommitPairs, run } = useGetReleaseTimes();
  const skipped = Object.keys(releaseStats.releases).length - releaseCommitPairs.length;
  return /* @__PURE__ */ React.createElement(Box, {
    style: { flex: 1 }
  }, /* @__PURE__ */ React.createElement(Box, {
    margin: 1
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h4"
  }, "In-depth")), /* @__PURE__ */ React.createElement(Box, {
    style: { display: "flex" }
  }, /* @__PURE__ */ React.createElement(Box, {
    margin: 1,
    style: { display: "flex", flex: 1 }
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6"
  }, "Release time"), /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2"
  }, /* @__PURE__ */ React.createElement("strong", null, "Release time"), " is derived by comparing", " ", /* @__PURE__ */ React.createElement("i", null, "createdAt"), " of the commits belonging to the first and last tag of each release. Releases without patches will have tags pointing towards the same commit and will thus be omitted. This project will omit ", skipped, " out of the total", " ", Object.keys(releaseStats.releases).length, " releases."))), /* @__PURE__ */ React.createElement(Box, {
    margin: 1,
    style: { display: "flex", flex: 1, flexDirection: "column" }
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6"
  }, "In numbers"), /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2",
    color: "textSecondary"
  }, /* @__PURE__ */ React.createElement("strong", null, "Average release time"), ":", " ", /* @__PURE__ */ React.createElement(AverageReleaseTime, {
    averageReleaseTime
  })), /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2",
    color: "textSecondary"
  }, /* @__PURE__ */ React.createElement("strong", null, "Lengthiest release"), ":", " ", /* @__PURE__ */ React.createElement(LongestReleaseTime, {
    averageReleaseTime
  }))), /* @__PURE__ */ React.createElement(Box, {
    marginTop: 1
  }, progress === 0 && /* @__PURE__ */ React.createElement(Tooltip, {
    title: `This action will send ~${releaseCommitPairs.length * 2} requests`
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "secondary",
    onClick: () => run(),
    size: "small"
  }, "Crunch the numbers"))))), /* @__PURE__ */ React.createElement(Box, {
    marginTop: 4
  }, /* @__PURE__ */ React.createElement(BarChart, {
    width: 700,
    height: 70 + averageReleaseTime.length * 22,
    data: averageReleaseTime.length > 0 ? averageReleaseTime : [{ version: "x.y.z", days: 0 }],
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
    layout: "vertical"
  }, /* @__PURE__ */ React.createElement(XAxis, {
    type: "number"
  }), /* @__PURE__ */ React.createElement(YAxis, {
    dataKey: "version",
    type: "category"
  }), /* @__PURE__ */ React.createElement(Tooltip$1, {
    labelStyle: { color: "#000", fontWeight: "bold" }
  }), /* @__PURE__ */ React.createElement(Legend, null), /* @__PURE__ */ React.createElement(Bar, {
    dataKey: "days",
    fill: "#82ca9d"
  })), progress > 0 && progress < 100 && /* @__PURE__ */ React.createElement(Box, {
    marginTop: 1
  }, /* @__PURE__ */ React.createElement(LinearProgressWithLabel, {
    progress,
    responseSteps: []
  }))));
}

function getSummary({ releaseStats }) {
  return {
    summary: Object.entries(releaseStats.releases).reduce((acc, [_baseVersion, mappedRelease]) => {
      const candidatePatches = Object.keys(mappedRelease.candidates).length - 1;
      const versionPatches = Object.keys(mappedRelease.versions).length - 1;
      acc.totalReleases += 1;
      acc.totalCandidatePatches += candidatePatches >= 0 ? candidatePatches : 0;
      acc.totalVersionPatches += versionPatches >= 0 ? versionPatches : 0;
      return acc;
    }, {
      totalReleases: 0,
      totalCandidatePatches: 0,
      totalVersionPatches: 0
    })
  };
}

const useStyles$1 = makeStyles({
  table: {
    minWidth: 650
  }
});
function Summary() {
  const { releaseStats } = useReleaseStatsContext();
  const { summary } = getSummary({ releaseStats });
  const classes = useStyles$1();
  return /* @__PURE__ */ React.createElement(Box, {
    margin: 1
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h4"
  }, "Summary"), /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2"
  }, /* @__PURE__ */ React.createElement("strong", null, "Total releases"), ": ", summary.totalReleases), /* @__PURE__ */ React.createElement(TableContainer, null, /* @__PURE__ */ React.createElement(Table, {
    size: "small",
    className: classes.table
  }, /* @__PURE__ */ React.createElement(TableHead, null, /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null), /* @__PURE__ */ React.createElement(TableCell, null, "Patches"), /* @__PURE__ */ React.createElement(TableCell, null, "Patches per release"))), /* @__PURE__ */ React.createElement(TableBody, null, /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, {
    component: "th",
    scope: "row"
  }, "Release Candidate"), /* @__PURE__ */ React.createElement(TableCell, null, summary.totalCandidatePatches), /* @__PURE__ */ React.createElement(TableCell, null, getDecimalNumber(summary.totalCandidatePatches / summary.totalReleases))), /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, {
    component: "th",
    scope: "row"
  }, "Release Version"), /* @__PURE__ */ React.createElement(TableCell, null, summary.totalVersionPatches), /* @__PURE__ */ React.createElement(TableCell, null, getDecimalNumber(summary.totalVersionPatches / summary.totalReleases))), /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, {
    component: "th",
    scope: "row"
  }, "Total"), /* @__PURE__ */ React.createElement(TableCell, null, summary.totalCandidatePatches + summary.totalVersionPatches), /* @__PURE__ */ React.createElement(TableCell, null, getDecimalNumber((summary.totalCandidatePatches + summary.totalVersionPatches) / summary.totalReleases)))))));
}

function Info$1() {
  return /* @__PURE__ */ React.createElement(Paper, {
    variant: "outlined",
    style: {
      padding: 20,
      marginLeft: 25,
      marginRight: 25,
      marginBottom: 25,
      display: "flex",
      flexDirection: "column"
    }
  }, /* @__PURE__ */ React.createElement(Summary, null), /* @__PURE__ */ React.createElement(InDepth, null));
}

function ReleaseTagList({
  releaseStat
}) {
  return /* @__PURE__ */ React.createElement(Box, {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }
  }, releaseStat.versions.length > 0 && /* @__PURE__ */ React.createElement(Box, {
    style: { position: "relative" }
  }, releaseStat.versions.map((version) => /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1",
    key: version.tagName
  }, version.tagName))), releaseStat.versions.length > 0 && /* @__PURE__ */ React.createElement(Box, {
    margin: 1,
    style: {
      position: "relative",
      transform: "rotate(-45deg)",
      fontSize: 30
    }
  }, " \u{1F680} "), /* @__PURE__ */ React.createElement(Box, {
    style: { position: "relative" }
  }, releaseStat.candidates.map((candidate) => /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1",
    key: candidate.tagName
  }, candidate.tagName))));
}

function ReleaseTime({ releaseStat }) {
  var _a, _b, _c, _d;
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { project } = useProjectContext();
  const releaseTimes = useAsync(() => getTagDates({
    pluginApiClient,
    project,
    startTag: [...releaseStat.candidates].reverse()[0],
    endTag: releaseStat.versions[0]
  }));
  if (releaseTimes.loading || releaseTimes.loading) {
    return /* @__PURE__ */ React.createElement(Wrapper, null, /* @__PURE__ */ React.createElement(Progress, null));
  }
  if (releaseTimes.error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Failed to fetch the first Release Candidate commit (", releaseTimes.error.message, ")");
  }
  const { days = 0, hours = 0 } = ((_a = releaseTimes.value) == null ? void 0 : _a.startDate) && ((_b = releaseTimes.value) == null ? void 0 : _b.endDate) ? DateTime.fromISO(releaseTimes.value.endDate).diff(DateTime.fromISO(releaseTimes.value.startDate), [
    "days",
    "hours"
  ]).toObject() : { days: -1 };
  return /* @__PURE__ */ React.createElement(Wrapper, null, /* @__PURE__ */ React.createElement(Box, {
    style: {
      flex: 1,
      display: "flex",
      alignItems: "flex-start"
    }
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1"
  }, releaseStat.versions.length === 0 ? "-" : "Release completed ", ((_c = releaseTimes.value) == null ? void 0 : _c.endDate) && DateTime.fromISO(releaseTimes.value.endDate).toFormat("yyyy-MM-dd"))), /* @__PURE__ */ React.createElement(Box, {
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center"
    }
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6",
    color: "secondary"
  }, days === -1 ? /* @__PURE__ */ React.createElement(React.Fragment, null, "Ongoing") : /* @__PURE__ */ React.createElement(React.Fragment, null, "Completed in: ", days, " days ", getDecimalNumber(hours, 1), " hours"))), /* @__PURE__ */ React.createElement(Box, {
    style: {
      flex: 1,
      display: "flex",
      alignItems: "flex-end"
    }
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1"
  }, "Release Candidate created", " ", ((_d = releaseTimes.value) == null ? void 0 : _d.startDate) && DateTime.fromISO(releaseTimes.value.startDate).toFormat("yyyy-MM-dd"))));
}
function Wrapper({ children }) {
  return /* @__PURE__ */ React.createElement(Box, {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }
  }, children);
}

function RowCollapsed({ releaseStat }) {
  return /* @__PURE__ */ React.createElement(Box, {
    margin: 1,
    style: {
      display: "flex",
      alignItems: "stretch",
      paddingLeft: "10%",
      paddingRight: "10%"
    }
  }, /* @__PURE__ */ React.createElement(ReleaseTagList, {
    releaseStat
  }), /* @__PURE__ */ React.createElement(ReleaseTime, {
    releaseStat
  }));
}

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset"
    }
  }
});
function Row({ baseVersion, releaseStat }) {
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(TableRow, {
    className: classes.root
  }, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(IconButton, {
    "aria-label": "expand row",
    size: "small",
    onClick: () => setOpen(!open)
  }, open ? /* @__PURE__ */ React.createElement(KeyboardArrowDownIcon, null) : /* @__PURE__ */ React.createElement(ChevronRightIcon, null))), /* @__PURE__ */ React.createElement(TableCell, {
    component: "th",
    scope: "row"
  }, /* @__PURE__ */ React.createElement(Link, {
    to: releaseStat.htmlUrl,
    target: "_blank"
  }, baseVersion, releaseStat.versions.length === 0 ? " (prerelease)" : "")), /* @__PURE__ */ React.createElement(TableCell, null, releaseStat.createdAt ? DateTime.fromISO(releaseStat.createdAt).toFormat("yyyy-MM-dd") : "-"), /* @__PURE__ */ React.createElement(TableCell, null, releaseStat.candidates.length), /* @__PURE__ */ React.createElement(TableCell, null, Math.max(0, releaseStat.versions.length - 1))), /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, {
    style: { paddingBottom: 0, paddingTop: 0 },
    colSpan: 6
  }, /* @__PURE__ */ React.createElement(Collapse, {
    in: open,
    timeout: "auto",
    unmountOnExit: true
  }, /* @__PURE__ */ React.createElement(RowCollapsed, {
    releaseStat
  })))));
}

const useGetStats = () => {
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { project } = useProjectContext();
  const stats = useAsync(async () => {
    const [{ releases: allReleases }, { tags: allTags }] = await Promise.all([
      pluginApiClient.getAllReleases({
        owner: project.owner,
        repo: project.repo
      }),
      pluginApiClient.getAllTags({
        owner: project.owner,
        repo: project.repo
      })
    ]);
    return {
      allReleases,
      allTags
    };
  }, [project]);
  return {
    stats
  };
};

const Warn = () => {
  const { releaseStats } = useReleaseStatsContext();
  const { project } = useProjectContext();
  return /* @__PURE__ */ React.createElement(Box, {
    marginTop: 2
  }, /* @__PURE__ */ React.createElement(Alert, {
    severity: "warning",
    style: { marginBottom: 10 }
  }, releaseStats.unmappableTags.length > 0 && /* @__PURE__ */ React.createElement("div", null, "Failed to map ", /* @__PURE__ */ React.createElement("strong", null, releaseStats.unmappableTags.length), " ", "tags to releases"), releaseStats.unmatchedTags.length > 0 && /* @__PURE__ */ React.createElement("div", null, "Failed to match ", /* @__PURE__ */ React.createElement("strong", null, releaseStats.unmatchedTags.length), " ", "tags to ", project.versioningStrategy), releaseStats.unmatchedReleases.length > 0 && /* @__PURE__ */ React.createElement("div", null, "Failed to match", " ", /* @__PURE__ */ React.createElement("strong", null, releaseStats.unmatchedReleases.length), " releases to", " ", project.versioningStrategy), /* @__PURE__ */ React.createElement(Box, {
    marginTop: 1,
    marginBottom: 1
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "secondary",
    size: "small",
    onClick: () => {
      console.log("Here's all unmapped/unmatched tags/releases", {
        unmatchedReleases: releaseStats.unmatchedReleases,
        unmatchedTags: releaseStats.unmatchedTags,
        unmappableTags: releaseStats.unmappableTags
      });
    }
  }, "Log all unmapped/unmatched tags/releases to the console"))));
};

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});
function DialogBody() {
  const classes = useStyles();
  const { stats } = useGetStats();
  const { project } = useProjectContext();
  if (stats.error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Unexpected error: ", stats.error.message);
  }
  if (stats.loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (!stats.value) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Couldn't find any stats :(");
  }
  const { allReleases, allTags } = stats.value;
  const { mappedReleases } = getMappedReleases({ allReleases, project });
  const { releaseStats } = getReleaseStats({
    mappedReleases,
    allTags,
    project
  });
  return /* @__PURE__ */ React.createElement(ReleaseStatsContext.Provider, {
    value: { releaseStats }
  }, /* @__PURE__ */ React.createElement(Info$1, null), /* @__PURE__ */ React.createElement(TableContainer, null, /* @__PURE__ */ React.createElement(Table, {
    className: classes.table,
    size: "small"
  }, /* @__PURE__ */ React.createElement(TableHead, null, /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null), /* @__PURE__ */ React.createElement(TableCell, null, "Release"), /* @__PURE__ */ React.createElement(TableCell, null, "Created at"), /* @__PURE__ */ React.createElement(TableCell, null, "# candidate patches"), /* @__PURE__ */ React.createElement(TableCell, null, "# release patches"))), /* @__PURE__ */ React.createElement(TableBody, null, Object.entries(releaseStats.releases).map(([baseVersion, releaseStat], index) => {
    return /* @__PURE__ */ React.createElement(Row, {
      key: `row-${index}`,
      baseVersion,
      releaseStat
    });
  }))), (releaseStats.unmappableTags.length > 0 || releaseStats.unmatchedTags.length > 0 || releaseStats.unmatchedReleases.length > 0) && /* @__PURE__ */ React.createElement(Warn, null)));
}

const styles = (theme) => createStyles({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, setShowStats, ...other } = props;
  return /* @__PURE__ */ React.createElement(MuiDialogTitle, {
    disableTypography: true,
    className: classes.root,
    ...other
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6"
  }, children), /* @__PURE__ */ React.createElement(IconButton, {
    "aria-label": "close",
    className: classes.closeButton,
    onClick: () => setShowStats(false)
  }, /* @__PURE__ */ React.createElement(CloseIcon, null)));
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);
const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);
function Stats({ setShowStats }) {
  return /* @__PURE__ */ React.createElement(Dialog, {
    open: true,
    maxWidth: "md",
    fullWidth: true,
    TransitionComponent: Transition
  }, /* @__PURE__ */ React.createElement(DialogTitle, {
    setShowStats
  }, "Stats"), /* @__PURE__ */ React.createElement(DialogContent, null, /* @__PURE__ */ React.createElement(DialogBody, null)), /* @__PURE__ */ React.createElement(DialogActions, null, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => setShowStats(false),
    variant: "contained",
    size: "large",
    color: "primary",
    startIcon: /* @__PURE__ */ React.createElement(CloseIcon, null)
  }, "Close")));
}

const Info = ({
  releaseBranch,
  latestRelease,
  statsEnabled
}) => {
  const { project } = useProjectContext();
  const [showStats, setShowStats] = useState(false);
  return /* @__PURE__ */ React.createElement(InfoCardPlus, null, /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 1,
    "data-testid": TEST_IDS.info.info
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6"
  }, "Terminology"), /* @__PURE__ */ React.createElement(Typography, null, /* @__PURE__ */ React.createElement("strong", null, "Git"), ": The source control system where releases reside in a practical sense. Read more about", " ", /* @__PURE__ */ React.createElement(Link, {
    to: "https://docs.github.com/en/github/administering-a-repository/managing-releases-in-a-repository",
    target: "_blank"
  }, "Git releases"), "."), /* @__PURE__ */ React.createElement(Typography, null, /* @__PURE__ */ React.createElement("strong", null, "Release Candidate"), ": A Git ", /* @__PURE__ */ React.createElement("i", null, "prerelease"), " intended primarily for internal testing"), /* @__PURE__ */ React.createElement(Typography, null, /* @__PURE__ */ React.createElement("strong", null, "Release Version"), ": A Git release intended for end users")), /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 1
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6"
  }, "Flow"), /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 2
  }, /* @__PURE__ */ React.createElement(Typography, null, "Git Release Manager is built with a specific flow in mind. For example, it assumes your project is configured to react to tags prefixed with ", /* @__PURE__ */ React.createElement("b", null, "rc"), " or ", /* @__PURE__ */ React.createElement("b", null, "version"), ".")), /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 2
  }, /* @__PURE__ */ React.createElement(Typography, null, "Here's an overview of the flow:")), /* @__PURE__ */ React.createElement("img", {
    alt: "flow",
    src: flowImage,
    style: { width: "100%" }
  })), /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 1
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6"
  }, "Details"), /* @__PURE__ */ React.createElement(Typography, null, "Repository:", " ", /* @__PURE__ */ React.createElement(Differ, {
    icon: "github",
    next: `${project.owner}/${project.repo}`
  })), /* @__PURE__ */ React.createElement(Typography, null, "Versioning strategy:", " ", /* @__PURE__ */ React.createElement(Differ, {
    icon: "versioning",
    next: project.versioningStrategy
  })), /* @__PURE__ */ React.createElement(Typography, null, "Latest release branch:", " ", /* @__PURE__ */ React.createElement(Differ, {
    icon: "branch",
    next: releaseBranch == null ? void 0 : releaseBranch.name
  })), /* @__PURE__ */ React.createElement(Typography, null, "Latest release: ", /* @__PURE__ */ React.createElement(Differ, {
    icon: "tag",
    next: latestRelease == null ? void 0 : latestRelease.tagName
  }))), statsEnabled && /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "secondary",
    onClick: () => setShowStats(true),
    startIcon: /* @__PURE__ */ React.createElement(BarChartIcon, null),
    size: "small"
  }, "Show stats"), showStats && /* @__PURE__ */ React.createElement(Stats, {
    setShowStats
  })));
};

const getPatchCommitSuffix = ({ commitSha }) => {
  return `[Backstage patch ${commitSha}]`;
};

const PatchDryRunMessage = ({ message }) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("strong", null, "[Patch dry run]"), " ", message);
function usePatchDryRun({
  bumpedTag,
  releaseBranchName,
  project,
  tagParts
}) {
  var _a;
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { responseSteps, addStepToResponseSteps, asyncCatcher, abortIfError } = useResponseSteps();
  const tempPatchBranchName = `${releaseBranchName}-backstage-grm-patch-dry-run`;
  const [latestCommitOnReleaseBranchRes, run] = useAsyncFn(async (selectedPatchCommit) => {
    try {
      await pluginApiClient.deleteRef({
        owner: project.owner,
        repo: project.repo,
        ref: `heads/${tempPatchBranchName}`
      });
    } catch (error) {
      if (error.message !== "Reference does not exist") {
        throw error;
      }
    }
    const { commit: latestCommit } = await pluginApiClient.getCommit({
      owner: project.owner,
      repo: project.repo,
      ref: releaseBranchName
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: /* @__PURE__ */ React.createElement(PatchDryRunMessage, {
        message: `Fetched latest commit from "${releaseBranchName}"`
      })
    });
    return {
      latestCommit,
      selectedPatchCommit
    };
  });
  const createTempPatchBranchRes = useAsync(async () => {
    abortIfError(latestCommitOnReleaseBranchRes.error);
    if (!latestCommitOnReleaseBranchRes.value)
      return void 0;
    const { reference: createdReleaseBranch } = await pluginApiClient.createRef({
      owner: project.owner,
      repo: project.repo,
      sha: latestCommitOnReleaseBranchRes.value.latestCommit.sha,
      ref: `refs/heads/${tempPatchBranchName}`
    }).catch((error) => {
      var _a2;
      if (((_a2 = error == null ? void 0 : error.body) == null ? void 0 : _a2.message) === "Reference already exists") {
        throw new GitReleaseManagerError(`Branch "${tempPatchBranchName}" already exists: .../tree/${tempPatchBranchName}`);
      }
      throw error;
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: /* @__PURE__ */ React.createElement(PatchDryRunMessage, {
        message: `Created temporary patch dry run branch "${tempPatchBranchName}"`
      })
    });
    return {
      ...createdReleaseBranch,
      selectedPatchCommit: latestCommitOnReleaseBranchRes.value.selectedPatchCommit
    };
  }, [
    latestCommitOnReleaseBranchRes.value,
    latestCommitOnReleaseBranchRes.error
  ]);
  const tempPatchBranchRes = useAsync(async () => {
    abortIfError(createTempPatchBranchRes.error);
    if (!createTempPatchBranchRes.value)
      return void 0;
    const { branch: releaseBranch } = await pluginApiClient.getBranch({
      owner: project.owner,
      repo: project.repo,
      branch: tempPatchBranchName
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: /* @__PURE__ */ React.createElement(PatchDryRunMessage, {
        message: `Fetched release branch "${releaseBranch.name}"`
      })
    });
    return {
      releaseBranch,
      selectedPatchCommit: createTempPatchBranchRes.value.selectedPatchCommit
    };
  }, [createTempPatchBranchRes.value, createTempPatchBranchRes.error]);
  const tempCommitRes = useAsync(async () => {
    var _a2;
    abortIfError(tempPatchBranchRes.error);
    if (!tempPatchBranchRes.value)
      return void 0;
    const { commit: tempCommit } = await pluginApiClient.createCommit({
      owner: project.owner,
      repo: project.repo,
      message: `Temporary commit for patch ${tagParts.patch}`,
      parents: [
        (_a2 = tempPatchBranchRes.value.selectedPatchCommit.firstParentSha) != null ? _a2 : ""
      ],
      tree: tempPatchBranchRes.value.releaseBranch.commit.commit.tree.sha
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: /* @__PURE__ */ React.createElement(PatchDryRunMessage, {
        message: "Created temporary commit"
      })
    });
    return {
      ...tempCommit
    };
  }, [tempPatchBranchRes.value, tempPatchBranchRes.error]);
  const forceBranchRes = useAsync(async () => {
    abortIfError(tempCommitRes.error);
    if (!tempCommitRes.value)
      return void 0;
    await pluginApiClient.updateRef({
      owner: project.owner,
      repo: project.repo,
      sha: tempCommitRes.value.sha,
      ref: `heads/${tempPatchBranchName}`,
      force: true
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: /* @__PURE__ */ React.createElement(PatchDryRunMessage, {
        message: `Forced branch "${tempPatchBranchName}" to temporary commit "${tempCommitRes.value.sha}"`
      })
    });
    return {
      trigger: "next step \u{1F680} "
    };
  }, [tempCommitRes.value, tempCommitRes.error]);
  const mergeRes = useAsync(async () => {
    abortIfError(forceBranchRes.error);
    if (!forceBranchRes.value || !tempPatchBranchRes.value)
      return void 0;
    const { merge } = await pluginApiClient.merge({
      owner: project.owner,
      repo: project.repo,
      base: tempPatchBranchName,
      head: tempPatchBranchRes.value.selectedPatchCommit.sha
    }).catch(async (error) => {
      if ((error == null ? void 0 : error.message) === "Merge conflict") {
        try {
          await pluginApiClient.deleteRef({
            owner: project.owner,
            repo: project.repo,
            ref: `heads/${tempPatchBranchName}`
          });
        } catch (_error) {
        }
        throw new GitReleaseManagerError("Patching failed due to merge conflict. Will attempt to delete temporary patch dry run branch. Manual patching is recommended.");
      }
      throw error;
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: /* @__PURE__ */ React.createElement(PatchDryRunMessage, {
        message: `Merged temporary commit into "${tempPatchBranchName}"`
      })
    });
    return {
      ...merge
    };
  }, [forceBranchRes.value, forceBranchRes.error]);
  const cherryPickRes = useAsync(async () => {
    abortIfError(mergeRes.error);
    if (!mergeRes.value || !tempPatchBranchRes.value)
      return void 0;
    const releaseBranchSha = tempPatchBranchRes.value.releaseBranch.commit.sha;
    const {
      commit: { message },
      sha: commitSha
    } = tempPatchBranchRes.value.selectedPatchCommit;
    const { commit: cherryPickCommit } = await pluginApiClient.createCommit({
      owner: project.owner,
      repo: project.repo,
      message: `[patch (dry run) ${bumpedTag}] ${message}

      ${getPatchCommitSuffix({ commitSha })}`,
      parents: [releaseBranchSha],
      tree: mergeRes.value.commit.tree.sha
    });
    addStepToResponseSteps({
      message: /* @__PURE__ */ React.createElement(PatchDryRunMessage, {
        message: `Cherry-picked patch commit to "${releaseBranchSha}"`
      })
    });
    return {
      ...cherryPickCommit
    };
  }, [mergeRes.value, mergeRes.error]);
  const updatedRefRes = useAsync(async () => {
    abortIfError(cherryPickRes.error);
    if (!cherryPickRes.value)
      return void 0;
    const { reference: updatedReference } = await pluginApiClient.updateRef({
      owner: project.owner,
      repo: project.repo,
      ref: `heads/${tempPatchBranchName}`,
      sha: cherryPickRes.value.sha,
      force: true
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: /* @__PURE__ */ React.createElement(PatchDryRunMessage, {
        message: `Updated reference "${updatedReference.ref}"`
      })
    });
    return {
      ...updatedReference
    };
  }, [cherryPickRes.value, cherryPickRes.error]);
  const deleteTempPatchBranchRes = useAsync(async () => {
    abortIfError(updatedRefRes.error);
    if (!updatedRefRes.value)
      return void 0;
    const { success: deletedReferenceSuccess } = await pluginApiClient.deleteRef({
      owner: project.owner,
      repo: project.repo,
      ref: `heads/${tempPatchBranchName}`
    });
    addStepToResponseSteps({
      message: /* @__PURE__ */ React.createElement(PatchDryRunMessage, {
        message: `Deleted temporary patch prep branch "${tempPatchBranchName}"`
      })
    });
    return {
      deletedReferenceSuccess
    };
  }, [updatedRefRes.value, updatedRefRes.error]);
  const TOTAL_PATCH_PREP_STEPS = 9;
  return {
    TOTAL_PATCH_PREP_STEPS,
    run,
    runInvoked: Boolean(deleteTempPatchBranchRes.loading || deleteTempPatchBranchRes.value || deleteTempPatchBranchRes.error),
    lastCallRes: deleteTempPatchBranchRes,
    responseSteps,
    addStepToResponseSteps,
    asyncCatcher,
    abortIfError,
    selectedPatchCommit: (_a = latestCommitOnReleaseBranchRes.value) == null ? void 0 : _a.selectedPatchCommit
  };
}

function usePatch({
  bumpedTag,
  latestRelease,
  project,
  tagParts,
  onSuccess
}) {
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { user } = useUserContext();
  const releaseBranchName = latestRelease.targetCommitish;
  const {
    run,
    runInvoked,
    lastCallRes,
    abortIfError,
    addStepToResponseSteps,
    asyncCatcher,
    responseSteps,
    TOTAL_PATCH_PREP_STEPS,
    selectedPatchCommit
  } = usePatchDryRun({
    bumpedTag,
    releaseBranchName,
    project,
    tagParts
  });
  const releaseBranchRes = useAsync(async () => {
    abortIfError(lastCallRes.error);
    if (!lastCallRes.value)
      return void 0;
    const { branch: releaseBranch } = await pluginApiClient.getBranch({
      owner: project.owner,
      repo: project.repo,
      branch: releaseBranchName
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: `Fetched release branch "${releaseBranch.name}"`,
      link: releaseBranch.links.html
    });
    return {
      releaseBranch
    };
  }, [lastCallRes.value, lastCallRes.error]);
  const tempCommitRes = useAsync(async () => {
    var _a;
    abortIfError(releaseBranchRes.error);
    if (!releaseBranchRes.value)
      return void 0;
    const { commit: tempCommit } = await pluginApiClient.createCommit({
      owner: project.owner,
      repo: project.repo,
      message: `Temporary commit for patch ${tagParts.patch}`,
      parents: [(_a = selectedPatchCommit.firstParentSha) != null ? _a : ""],
      tree: releaseBranchRes.value.releaseBranch.commit.commit.tree.sha
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: "Created temporary commit",
      secondaryMessage: `with message "${tempCommit.message}"`
    });
    return {
      ...tempCommit
    };
  }, [releaseBranchRes.value, releaseBranchRes.error]);
  const forceBranchRes = useAsync(async () => {
    abortIfError(tempCommitRes.error);
    if (!tempCommitRes.value)
      return void 0;
    await pluginApiClient.updateRef({
      owner: project.owner,
      repo: project.repo,
      sha: tempCommitRes.value.sha,
      ref: `heads/${releaseBranchName}`,
      force: true
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: `Forced branch "${releaseBranchName}" to temporary commit "${tempCommitRes.value.sha}"`
    });
    return {
      trigger: "next step \u{1F680} "
    };
  }, [tempCommitRes.value, tempCommitRes.error]);
  const mergeRes = useAsync(async () => {
    abortIfError(forceBranchRes.error);
    if (!forceBranchRes.value || !releaseBranchRes.value)
      return void 0;
    const { merge } = await pluginApiClient.merge({
      owner: project.owner,
      repo: project.repo,
      base: releaseBranchName,
      head: selectedPatchCommit.sha
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: `Merged temporary commit into "${releaseBranchName}"`,
      secondaryMessage: `with message "${merge.commit.message}"`,
      link: merge.htmlUrl
    });
    return {
      ...merge
    };
  }, [forceBranchRes.value, forceBranchRes.error]);
  const cherryPickRes = useAsync(async () => {
    abortIfError(mergeRes.error);
    if (!mergeRes.value || !releaseBranchRes.value)
      return void 0;
    const releaseBranchSha = releaseBranchRes.value.releaseBranch.commit.sha;
    const { commit: cherryPickCommit } = await pluginApiClient.createCommit({
      owner: project.owner,
      repo: project.repo,
      message: `[patch ${bumpedTag}] ${selectedPatchCommit.commit.message}

      ${getPatchCommitSuffix({
        commitSha: selectedPatchCommit.sha
      })}`,
      parents: [releaseBranchSha],
      tree: mergeRes.value.commit.tree.sha
    });
    addStepToResponseSteps({
      message: `Cherry-picked patch commit to "${releaseBranchSha}"`,
      secondaryMessage: `with message "${cherryPickCommit.message}"`
    });
    return {
      ...cherryPickCommit
    };
  }, [mergeRes.value, mergeRes.error]);
  const updatedRefRes = useAsync(async () => {
    abortIfError(cherryPickRes.error);
    if (!cherryPickRes.value)
      return void 0;
    const { reference: updatedReference } = await pluginApiClient.updateRef({
      owner: project.owner,
      repo: project.repo,
      ref: `heads/${releaseBranchName}`,
      sha: cherryPickRes.value.sha,
      force: true
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: `Updated reference "${updatedReference.ref}"`
    });
    return {
      ...updatedReference
    };
  }, [cherryPickRes.value, cherryPickRes.error]);
  const createdTagObjRes = useAsync(async () => {
    abortIfError(updatedRefRes.error);
    if (!updatedRefRes.value)
      return void 0;
    const { tagObject } = await pluginApiClient.createTagObject({
      owner: project.owner,
      repo: project.repo,
      tag: bumpedTag,
      object: updatedRefRes.value.object.sha,
      message: TAG_OBJECT_MESSAGE,
      taggerName: user.username,
      taggerEmail: user.email
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: "Created new tag object",
      secondaryMessage: `with name "${tagObject.tagName}"`
    });
    return {
      ...tagObject
    };
  }, [updatedRefRes.value, updatedRefRes.error]);
  const createdReferenceRes = useAsync(async () => {
    abortIfError(createdTagObjRes.error);
    if (!createdTagObjRes.value)
      return void 0;
    const { reference } = await pluginApiClient.createRef({
      owner: project.owner,
      repo: project.repo,
      ref: `refs/tags/${bumpedTag}`,
      sha: createdTagObjRes.value.tagSha
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: `Created new reference "${reference.ref}"`,
      secondaryMessage: `for tag object "${createdTagObjRes.value.tagName}"`
    });
    return {
      ...reference
    };
  }, [createdTagObjRes.value, createdTagObjRes.error]);
  const updatedReleaseRes = useAsync(async () => {
    abortIfError(createdReferenceRes.error);
    if (!createdReferenceRes.value || !releaseBranchRes.value)
      return void 0;
    const { release } = await pluginApiClient.updateRelease({
      owner: project.owner,
      repo: project.repo,
      releaseId: latestRelease.id,
      tagName: bumpedTag,
      body: `${latestRelease.body}

#### [Patch ${tagParts.patch}](${selectedPatchCommit.htmlUrl})

${selectedPatchCommit.commit.message}`
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: `Updated release "${release.name}"`,
      secondaryMessage: `with tag ${release.tagName}`,
      link: release.htmlUrl
    });
    return {
      ...release
    };
  }, [createdReferenceRes.value, createdReferenceRes.error]);
  useAsync(async () => {
    if (!onSuccess)
      return;
    abortIfError(updatedReleaseRes.error);
    if (!updatedReleaseRes.value || !releaseBranchRes.value)
      return;
    try {
      await (onSuccess == null ? void 0 : onSuccess({
        input: {
          bumpedTag,
          latestRelease,
          project,
          tagParts
        },
        patchCommitMessage: selectedPatchCommit.commit.message,
        patchCommitUrl: selectedPatchCommit.htmlUrl,
        patchedTag: updatedReleaseRes.value.tagName,
        previousTag: latestRelease.tagName,
        updatedReleaseName: updatedReleaseRes.value.name,
        updatedReleaseUrl: updatedReleaseRes.value.htmlUrl
      }));
    } catch (error) {
      asyncCatcher(error);
    }
    addStepToResponseSteps({
      message: "Success callback successfully called \u{1F680}",
      icon: "success"
    });
  }, [updatedReleaseRes.value, updatedReleaseRes.error]);
  const TOTAL_STEPS = 9 + (!!onSuccess ? 1 : 0) + TOTAL_PATCH_PREP_STEPS;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(responseSteps.length / TOTAL_STEPS * 100);
  }, [TOTAL_STEPS, responseSteps.length]);
  return {
    progress,
    responseSteps,
    run,
    runInvoked
  };
}

const PatchBody = ({
  bumpedTag,
  latestRelease,
  releaseBranch,
  onSuccess,
  tagParts,
  ctaMessage
}) => {
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { project } = useProjectContext();
  const [checkedCommitIndex, setCheckedCommitIndex] = useState(-1);
  const gitDataResponse = useAsync(async () => {
    const [
      { recentCommits: recentCommitsOnDefaultBranch },
      { recentCommits: recentCommitsOnReleaseBranch }
    ] = await Promise.all([
      pluginApiClient.getRecentCommits({
        owner: project.owner,
        repo: project.repo
      }),
      pluginApiClient.getRecentCommits({
        owner: project.owner,
        repo: project.repo,
        releaseBranchName: releaseBranch.name
      })
    ]);
    return {
      recentCommitsOnDefaultBranch,
      recentCommitsOnReleaseBranch
    };
  });
  const { progress, responseSteps, run, runInvoked } = usePatch({
    bumpedTag,
    latestRelease,
    project,
    tagParts,
    onSuccess
  });
  if (responseSteps.length > 0) {
    return /* @__PURE__ */ React.createElement(ResponseStepDialog, {
      progress,
      responseSteps,
      title: ctaMessage
    });
  }
  if (gitDataResponse.error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      "data-testid": TEST_IDS.patch.error,
      severity: "error"
    }, "Unexpected error: ", gitDataResponse.error.message);
  }
  if (gitDataResponse.loading) {
    return /* @__PURE__ */ React.createElement(Box, {
      "data-testid": TEST_IDS.patch.loading
    }, /* @__PURE__ */ React.createElement(Progress, null));
  }
  function Description() {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, !latestRelease.prerelease && /* @__PURE__ */ React.createElement(Box, {
      marginBottom: 2
    }, /* @__PURE__ */ React.createElement(Alert, {
      "data-testid": TEST_IDS.patch.notPrerelease,
      severity: "info"
    }, /* @__PURE__ */ React.createElement(AlertTitle, null, "The current Git release is a ", /* @__PURE__ */ React.createElement("b", null, "Release Version")), "It's still possible to patch it, but be extra mindful of changes")), /* @__PURE__ */ React.createElement(Box, {
      marginBottom: 2
    }, /* @__PURE__ */ React.createElement(Typography, null, "Patches the release branch, creates a new tag and updates the Git release. A dry run on a temporary branch will run prior to patching the release branch to ensure there's no merge conflicts. Manual patching is recommended should the dry run fail.")), /* @__PURE__ */ React.createElement(Box, {
      marginBottom: 2
    }, /* @__PURE__ */ React.createElement(Typography, null, /* @__PURE__ */ React.createElement(Differ, {
      icon: "tag",
      current: latestRelease.tagName,
      next: bumpedTag
    }))));
  }
  function CommitList() {
    var _a;
    if (!((_a = gitDataResponse.value) == null ? void 0 : _a.recentCommitsOnDefaultBranch)) {
      return null;
    }
    return /* @__PURE__ */ React.createElement(List, null, gitDataResponse.value.recentCommitsOnDefaultBranch.map((commit, index) => {
      var _a2;
      const commitExistsOnReleaseBranch = !!((_a2 = gitDataResponse.value) == null ? void 0 : _a2.recentCommitsOnReleaseBranch.find((releaseBranchCommit) => releaseBranchCommit.sha === commit.sha || releaseBranchCommit.commit.message.includes(getPatchCommitSuffix({ commitSha: commit.sha }))));
      const hasNoParent = !commit.firstParentSha;
      return /* @__PURE__ */ React.createElement("div", {
        style: { position: "relative" },
        key: `commit-${index}`
      }, commitExistsOnReleaseBranch && /* @__PURE__ */ React.createElement(Paper, {
        elevation: 3,
        style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate3d(-50%,-50%,0)",
          zIndex: 10,
          color: "green",
          padding: 6,
          background: "rgba(244,244,244,1)",
          borderRadius: 8
        }
      }, /* @__PURE__ */ React.createElement(FileCopyIcon, {
        fontSize: "small",
        style: { verticalAlign: "middle" }
      }), " ", "Already exists on ", /* @__PURE__ */ React.createElement("b", null, releaseBranch == null ? void 0 : releaseBranch.name)), /* @__PURE__ */ React.createElement(ListItem, {
        disabled: runInvoked || commitExistsOnReleaseBranch || hasNoParent,
        role: void 0,
        dense: true,
        button: true,
        onClick: () => {
          if (index === checkedCommitIndex) {
            setCheckedCommitIndex(-1);
          } else {
            setCheckedCommitIndex(index);
          }
        }
      }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(Checkbox, {
        edge: "start",
        checked: checkedCommitIndex === index,
        tabIndex: -1
      })), /* @__PURE__ */ React.createElement(ListItemText, {
        style: { marginRight: 15 },
        id: commit.sha,
        primary: commit.commit.message,
        secondary: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Link, {
          color: "primary",
          to: commit.htmlUrl,
          target: "_blank"
        }, commit.sha), " ", commit.author.htmlUrl && /* @__PURE__ */ React.createElement(Link, {
          color: "primary",
          to: commit.author.htmlUrl,
          target: "_blank"
        }, "@", commit.author.login))
      }), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, null, /* @__PURE__ */ React.createElement(IconButton, {
        "aria-label": "commit",
        disabled: runInvoked || commitExistsOnReleaseBranch || !releaseBranch,
        onClick: () => {
          const repoPath = pluginApiClient.getRepoPath({
            owner: project.owner,
            repo: project.repo
          });
          const host = pluginApiClient.getHost();
          const newTab = window.open(`https://${host}/${repoPath}/compare/${releaseBranch == null ? void 0 : releaseBranch.name}...${commit.sha}`, "_blank");
          newTab == null ? void 0 : newTab.focus();
        }
      }, /* @__PURE__ */ React.createElement(OpenInNewIcon, null)))));
    }));
  }
  return /* @__PURE__ */ React.createElement(Box, {
    "data-testid": TEST_IDS.patch.body
  }, /* @__PURE__ */ React.createElement(Description, null), /* @__PURE__ */ React.createElement(Box, {
    style: { maxHeight: 450, overflowY: "auto" }
  }, /* @__PURE__ */ React.createElement(CommitList, null)), /* @__PURE__ */ React.createElement(Button, {
    disabled: checkedCommitIndex === -1 || progress > 0,
    variant: "contained",
    color: "primary",
    onClick: () => {
      var _a;
      const selectedPatchCommit = (_a = gitDataResponse.value) == null ? void 0 : _a.recentCommitsOnDefaultBranch[checkedCommitIndex];
      if (!selectedPatchCommit) {
        throw new GitReleaseManagerError("Could not find selected patch commit");
      }
      run(selectedPatchCommit);
    }
  }, ctaMessage));
};

const Patch = ({
  latestRelease,
  releaseBranch,
  onSuccess
}) => {
  const ctaMessage = `Patch Release ${(latestRelease == null ? void 0 : latestRelease.prerelease) ? "Candidate" : "Version"}`;
  return /* @__PURE__ */ React.createElement(InfoCardPlus, null, /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 2
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h4"
  }, ctaMessage)), /* @__PURE__ */ React.createElement(BodyWrapper, {
    latestRelease,
    releaseBranch,
    onSuccess,
    ctaMessage
  }));
};
function BodyWrapper({
  latestRelease,
  releaseBranch,
  onSuccess,
  ctaMessage
}) {
  const { project } = useProjectContext();
  if (latestRelease === null) {
    return /* @__PURE__ */ React.createElement(NoLatestRelease, null);
  }
  if (releaseBranch === null) {
    return /* @__PURE__ */ React.createElement(NoLatestRelease, null);
  }
  const bumpedTag = getBumpedTag({
    project,
    tag: latestRelease.tagName,
    bumpLevel: "patch"
  });
  if (bumpedTag.error !== void 0) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, bumpedTag.error.title && /* @__PURE__ */ React.createElement(AlertTitle, null, bumpedTag.error.title), bumpedTag.error.subtitle);
  }
  return /* @__PURE__ */ React.createElement(PatchBody, {
    bumpedTag: bumpedTag.bumpedTag,
    latestRelease,
    releaseBranch,
    onSuccess,
    tagParts: bumpedTag.tagParts,
    ctaMessage
  });
}

function usePromoteRc({
  rcRelease,
  releaseVersion,
  onSuccess
}) {
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { user } = useUserContext();
  const { project } = useProjectContext();
  const { responseSteps, addStepToResponseSteps, asyncCatcher, abortIfError } = useResponseSteps();
  const [latestReleaseBranchCommitSha, run] = useAsyncFn(async () => {
    const { commit: latestCommit } = await pluginApiClient.getCommit({
      owner: project.owner,
      repo: project.repo,
      ref: rcRelease.targetCommitish
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: "Fetched most recent commit from release branch",
      secondaryMessage: `with sha "${latestCommit.sha}"`
    });
    return {
      ...latestCommit
    };
  });
  const tagObjectRes = useAsync(async () => {
    abortIfError(latestReleaseBranchCommitSha.error);
    if (!latestReleaseBranchCommitSha.value)
      return void 0;
    const { tagObject } = await pluginApiClient.createTagObject({
      owner: project.owner,
      repo: project.repo,
      tag: releaseVersion,
      object: latestReleaseBranchCommitSha.value.sha,
      taggerName: user.username,
      taggerEmail: user.email,
      message: TAG_OBJECT_MESSAGE
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: "Created Tag Object",
      secondaryMessage: `with sha "${tagObject.tagSha}"`
    });
    return {
      ...tagObject
    };
  }, [latestReleaseBranchCommitSha.value, latestReleaseBranchCommitSha.error]);
  const createRcRes = useAsync(async () => {
    abortIfError(tagObjectRes.error);
    if (!tagObjectRes.value)
      return void 0;
    const { reference: createdRef } = await pluginApiClient.createRef({
      owner: project.owner,
      repo: project.repo,
      ref: `refs/tags/${releaseVersion}`,
      sha: tagObjectRes.value.tagSha
    }).catch((error) => {
      var _a;
      if (((_a = error == null ? void 0 : error.body) == null ? void 0 : _a.message) === "Reference already exists") {
        throw new GitReleaseManagerError(`Tag reference "${releaseVersion}" already exists`);
      }
      throw error;
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: "Create Tag Reference",
      secondaryMessage: `with ref "${createdRef.ref}"`
    });
    return {
      ...createdRef
    };
  }, [tagObjectRes.value, tagObjectRes.error]);
  const promotedReleaseRes = useAsync(async () => {
    abortIfError(createRcRes.error);
    if (!createRcRes.value)
      return void 0;
    const { release } = await pluginApiClient.updateRelease({
      owner: project.owner,
      repo: project.repo,
      releaseId: rcRelease.id,
      tagName: releaseVersion,
      prerelease: false
    }).catch(asyncCatcher);
    addStepToResponseSteps({
      message: `Promoted "${release.name}"`,
      secondaryMessage: `from "${rcRelease.tagName}" to "${release.tagName}"`,
      link: release.htmlUrl
    });
    return {
      ...release
    };
  }, [createRcRes.value, createRcRes.error]);
  useAsync(async () => {
    if (onSuccess && !!promotedReleaseRes.value) {
      abortIfError(promotedReleaseRes.error);
      try {
        await (onSuccess == null ? void 0 : onSuccess({
          input: {
            rcRelease,
            releaseVersion
          },
          gitReleaseName: promotedReleaseRes.value.name,
          gitReleaseUrl: promotedReleaseRes.value.htmlUrl,
          previousTag: rcRelease.tagName,
          previousTagUrl: rcRelease.htmlUrl,
          updatedTag: promotedReleaseRes.value.tagName,
          updatedTagUrl: promotedReleaseRes.value.htmlUrl
        }));
      } catch (error) {
        asyncCatcher(error);
      }
      addStepToResponseSteps({
        message: "Success callback successfully called \u{1F680}",
        icon: "success"
      });
    }
  }, [promotedReleaseRes.value, promotedReleaseRes.error]);
  const TOTAL_STEPS = 4 + (!!onSuccess ? 1 : 0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(responseSteps.length / TOTAL_STEPS * 100);
  }, [TOTAL_STEPS, responseSteps.length]);
  return {
    progress,
    responseSteps,
    run,
    runInvoked: Boolean(promotedReleaseRes.loading || promotedReleaseRes.value || promotedReleaseRes.error)
  };
}

const PromoteRcBody = ({ rcRelease, onSuccess }) => {
  const releaseVersion = rcRelease.tagName.replace("rc-", "version-");
  const { progress, responseSteps, run, runInvoked } = usePromoteRc({
    rcRelease,
    releaseVersion,
    onSuccess
  });
  if (responseSteps.length > 0) {
    return /* @__PURE__ */ React.createElement(ResponseStepDialog, {
      progress,
      responseSteps,
      title: "Promote Release Candidate"
    });
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 2
  }, /* @__PURE__ */ React.createElement(Typography, null, "Promotes the current Release Candidate to a ", /* @__PURE__ */ React.createElement("b", null, "Release Version"), ".")), /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 2
  }, /* @__PURE__ */ React.createElement(Typography, null, /* @__PURE__ */ React.createElement(Differ, {
    icon: "tag",
    current: rcRelease.tagName,
    next: releaseVersion
  }))), /* @__PURE__ */ React.createElement(Button, {
    "data-testid": TEST_IDS.promoteRc.cta,
    variant: "contained",
    color: "primary",
    disabled: runInvoked,
    onClick: () => run()
  }, "Promote Release Candidate"));
};

const PromoteRc = ({ latestRelease, onSuccess }) => {
  function Body() {
    if (latestRelease === null) {
      return /* @__PURE__ */ React.createElement(NoLatestRelease, null);
    }
    if (!latestRelease.prerelease) {
      return /* @__PURE__ */ React.createElement(Box, {
        marginBottom: 2
      }, /* @__PURE__ */ React.createElement(Alert, {
        "data-testid": TEST_IDS.promoteRc.notRcWarning,
        severity: "warning"
      }, /* @__PURE__ */ React.createElement(AlertTitle, null, "Latest Git release is not a Release Candidate"), "One can only promote Release Candidates to Release Versions"));
    }
    return /* @__PURE__ */ React.createElement(PromoteRcBody, {
      rcRelease: latestRelease,
      onSuccess
    });
  }
  return /* @__PURE__ */ React.createElement(InfoCardPlus, null, /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 2
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h4"
  }, "Promote Release Candidate")), /* @__PURE__ */ React.createElement(Body, null));
};

const useGetGitBatchInfo = ({
  project,
  pluginApiClient
}) => {
  const [gitBatchInfo, fetchGitBatchInfo] = useAsyncFn(async () => {
    const [{ repository }, { latestRelease }] = await Promise.all([
      pluginApiClient.getRepository({
        owner: project.owner,
        repo: project.repo
      }),
      pluginApiClient.getLatestRelease({
        owner: project.owner,
        repo: project.repo
      })
    ]);
    if (latestRelease === null) {
      return {
        latestRelease,
        releaseBranch: null,
        repository
      };
    }
    const { branch: releaseBranch } = await pluginApiClient.getBranch({
      owner: project.owner,
      repo: project.repo,
      branch: latestRelease.targetCommitish
    });
    return {
      latestRelease,
      releaseBranch,
      repository
    };
  });
  useEffect(() => {
    fetchGitBatchInfo();
  }, [fetchGitBatchInfo, project]);
  return {
    gitBatchInfo,
    fetchGitBatchInfo
  };
};

const useVersioningStrategyMatchesRepoTags = ({
  project,
  latestReleaseTagName,
  repositoryName
}) => {
  const [versioningStrategyMatches, setVersioningStrategyMatches] = useState(false);
  useEffect(() => {
    setVersioningStrategyMatches(false);
    if (latestReleaseTagName) {
      if (project.repo === repositoryName) {
        const { error } = getTagParts({ project, tag: latestReleaseTagName });
        setVersioningStrategyMatches(error === void 0);
      }
    }
  }, [latestReleaseTagName, project, repositoryName]);
  return {
    versioningStrategyMatches
  };
};

function Features({
  features
}) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { project } = useProjectContext();
  const { gitBatchInfo, fetchGitBatchInfo } = useGetGitBatchInfo({
    pluginApiClient,
    project
  });
  const { versioningStrategyMatches } = useVersioningStrategyMatchesRepoTags({
    latestReleaseTagName: (_b = (_a = gitBatchInfo.value) == null ? void 0 : _a.latestRelease) == null ? void 0 : _b.tagName,
    project,
    repositoryName: (_c = gitBatchInfo.value) == null ? void 0 : _c.repository.name
  });
  if (gitBatchInfo.error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, 'Error occurred while fetching information for "', project.owner, "/", project.repo, '" (', gitBatchInfo.error.message, ")");
  }
  if (gitBatchInfo.loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (gitBatchInfo.value === void 0) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Failed to fetch latest Git release");
  }
  if (!gitBatchInfo.value.repository.pushPermissions) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, 'You lack push permissions for repository "', project.owner, "/", project.repo, '"');
  }
  const { tagNameError } = validateTagName({
    project,
    tagName: (_d = gitBatchInfo.value.latestRelease) == null ? void 0 : _d.tagName
  });
  if (tagNameError) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, tagNameError.title && /* @__PURE__ */ React.createElement(AlertTitle, null, tagNameError.title), tagNameError.subtitle);
  }
  let CustomFeatures = (_f = (_e = features == null ? void 0 : features.custom) == null ? void 0 : _e.factory({
    latestRelease: gitBatchInfo.value.latestRelease,
    project,
    releaseBranch: gitBatchInfo.value.releaseBranch,
    repository: gitBatchInfo.value.repository
  })) != null ? _f : null;
  if (Array.isArray(CustomFeatures)) {
    CustomFeatures = CustomFeatures.map((CustomFeature, index) => /* @__PURE__ */ React.createElement(React.Fragment, {
      key: `grm--custom-feature--${index}`
    }, CustomFeature));
  }
  return /* @__PURE__ */ React.createElement(RefetchContext.Provider, {
    value: { fetchGitBatchInfo }
  }, /* @__PURE__ */ React.createElement(ErrorBoundary, null, gitBatchInfo.value.latestRelease && !versioningStrategyMatches && /* @__PURE__ */ React.createElement(Alert, {
    severity: "warning",
    style: { marginBottom: 20 }
  }, "Versioning mismatch, expected ", project.versioningStrategy, ' version, got "', gitBatchInfo.value.latestRelease.tagName, '"'), !gitBatchInfo.value.latestRelease && /* @__PURE__ */ React.createElement(Alert, {
    severity: "info",
    style: { marginBottom: 20 }
  }, "This repository doesn't have any releases yet"), !gitBatchInfo.value.releaseBranch && /* @__PURE__ */ React.createElement(Alert, {
    severity: "info",
    style: { marginBottom: 20 }
  }, "This repository doesn't have any release branches"), !((_g = features == null ? void 0 : features.info) == null ? void 0 : _g.omit) && /* @__PURE__ */ React.createElement(Info, {
    latestRelease: gitBatchInfo.value.latestRelease,
    releaseBranch: gitBatchInfo.value.releaseBranch,
    statsEnabled: ((_h = features == null ? void 0 : features.stats) == null ? void 0 : _h.omit) !== true
  }), !((_i = features == null ? void 0 : features.createRc) == null ? void 0 : _i.omit) && /* @__PURE__ */ React.createElement(CreateReleaseCandidate, {
    latestRelease: gitBatchInfo.value.latestRelease,
    releaseBranch: gitBatchInfo.value.releaseBranch,
    defaultBranch: gitBatchInfo.value.repository.defaultBranch,
    onSuccess: (_j = features == null ? void 0 : features.createRc) == null ? void 0 : _j.onSuccess
  }), !((_k = features == null ? void 0 : features.promoteRc) == null ? void 0 : _k.omit) && /* @__PURE__ */ React.createElement(PromoteRc, {
    latestRelease: gitBatchInfo.value.latestRelease,
    onSuccess: (_l = features == null ? void 0 : features.promoteRc) == null ? void 0 : _l.onSuccess
  }), !((_m = features == null ? void 0 : features.patch) == null ? void 0 : _m.omit) && /* @__PURE__ */ React.createElement(Patch, {
    latestRelease: gitBatchInfo.value.latestRelease,
    releaseBranch: gitBatchInfo.value.releaseBranch,
    onSuccess: (_n = features == null ? void 0 : features.patch) == null ? void 0 : _n.onSuccess
  }), CustomFeatures));
}

const useFormClasses = makeStyles((theme) => createStyles({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

function useQueryHandler() {
  const location = useLocation();
  function getParsedQuery() {
    const { decodedSearch } = getDecodedSearch(location);
    const parsedQuery = qs.parse(decodedSearch);
    return {
      parsedQuery
    };
  }
  function getQueryParamsWithUpdates({
    updates
  }) {
    const { decodedSearch } = getDecodedSearch(location);
    const queryParams = qs.parse(decodedSearch);
    for (const { key, value } of updates) {
      queryParams[key] = value;
    }
    return {
      queryParams: qs.stringify(queryParams)
    };
  }
  return {
    getParsedQuery,
    getQueryParamsWithUpdates
  };
}
function getDecodedSearch(location) {
  return {
    decodedSearch: new URLSearchParams(location.search).toString()
  };
}

function Owner() {
  var _a;
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { project } = useProjectContext();
  const { user } = useUserContext();
  const formClasses = useFormClasses();
  const navigate = useNavigate();
  const { getQueryParamsWithUpdates } = useQueryHandler();
  const { loading, error, value } = useAsync(() => pluginApiClient.getOwners());
  const owners = (_a = value == null ? void 0 : value.owners) != null ? _a : [];
  const customOwnerFromUrl = !owners.concat(["", user.username]).includes(project.owner);
  return /* @__PURE__ */ React.createElement(FormControl, {
    className: formClasses.formControl,
    required: true,
    disabled: project.isProvidedViaProps,
    error: !!error
  }, loading ? /* @__PURE__ */ React.createElement(Box, {
    "data-testid": TEST_IDS.form.owner.loading
  }, /* @__PURE__ */ React.createElement(Progress, null)) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(InputLabel, {
    id: "owner-select-label"
  }, "Owners"), /* @__PURE__ */ React.createElement(Select, {
    "data-testid": TEST_IDS.form.owner.select,
    labelId: "owner-select-label",
    id: "owner-select",
    value: project.owner,
    defaultValue: "",
    onChange: (event) => {
      const { queryParams } = getQueryParamsWithUpdates({
        updates: [
          { key: "repo", value: "" },
          { key: "owner", value: event.target.value }
        ]
      });
      navigate(`?${queryParams}`, { replace: true });
    },
    className: formClasses.selectEmpty
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    value: ""
  }, /* @__PURE__ */ React.createElement("em", null, "None")), /* @__PURE__ */ React.createElement(MenuItem, {
    value: user.username
  }, /* @__PURE__ */ React.createElement("strong", null, user.username)), !error && customOwnerFromUrl && /* @__PURE__ */ React.createElement(MenuItem, {
    value: project.owner
  }, /* @__PURE__ */ React.createElement("strong", null, "From URL: ", project.owner)), owners.map((orgName, index) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: `organization-${index}`,
    value: orgName
  }, orgName))), error && /* @__PURE__ */ React.createElement(FormHelperText, {
    "data-testid": TEST_IDS.form.owner.error
  }, "Encountered an error (", error.message, ")"), !error && project.owner.length === 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormHelperText, {
    "data-testid": TEST_IDS.form.owner.empty
  }, "Select an owner (org or user)"), /* @__PURE__ */ React.createElement(FormHelperText, {
    "data-testid": TEST_IDS.form.owner.empty
  }, "Custom queries can be made via the query param", " ", /* @__PURE__ */ React.createElement("strong", null, "owner")))));
}

function Repo() {
  var _a;
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { project } = useProjectContext();
  const navigate = useNavigate();
  const formClasses = useFormClasses();
  const { getQueryParamsWithUpdates } = useQueryHandler();
  const { loading, error, value } = useAsync(async () => pluginApiClient.getRepositories({ owner: project.owner }), [project.owner]);
  if (project.owner.length === 0) {
    return null;
  }
  const repositories = (_a = value == null ? void 0 : value.repositories) != null ? _a : [];
  const customRepoFromUrl = !repositories.concat([""]).includes(project.repo);
  return /* @__PURE__ */ React.createElement(FormControl, {
    className: formClasses.formControl,
    required: true,
    disabled: project.isProvidedViaProps,
    error: !!error
  }, loading ? /* @__PURE__ */ React.createElement(Box, {
    "data-testid": TEST_IDS.form.repo.loading
  }, /* @__PURE__ */ React.createElement(Progress, null)) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(InputLabel, {
    id: "repo-select-label"
  }, "Repositories"), /* @__PURE__ */ React.createElement(Select, {
    "data-testid": TEST_IDS.form.repo.select,
    labelId: "repo-select-label",
    id: "repo-select",
    value: project.repo,
    defaultValue: "",
    onChange: (event) => {
      const { queryParams } = getQueryParamsWithUpdates({
        updates: [{ key: "repo", value: event.target.value }]
      });
      navigate(`?${queryParams}`, { replace: true });
    },
    className: formClasses.selectEmpty
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    value: ""
  }, /* @__PURE__ */ React.createElement("em", null, "None")), !error && customRepoFromUrl && /* @__PURE__ */ React.createElement(MenuItem, {
    value: project.repo
  }, /* @__PURE__ */ React.createElement("strong", null, "From URL: ", project.repo)), repositories.map((repositoryName, index) => /* @__PURE__ */ React.createElement(MenuItem, {
    key: `repository-${index}`,
    value: repositoryName
  }, repositoryName))), error && /* @__PURE__ */ React.createElement(FormHelperText, {
    "data-testid": TEST_IDS.form.repo.error
  }, "Encountered an error (", error.message, '")'), !error && project.repo.length === 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormHelperText, {
    "data-testid": TEST_IDS.form.repo.empty
  }, "Select a repository"), /* @__PURE__ */ React.createElement(FormHelperText, {
    "data-testid": TEST_IDS.form.repo.empty
  }, "Custom queries can be made via the query param", " ", /* @__PURE__ */ React.createElement("strong", null, "repo")))));
}

function VersioningStrategy() {
  const navigate = useNavigate();
  const { project } = useProjectContext();
  const { getParsedQuery, getQueryParamsWithUpdates } = useQueryHandler();
  useEffect(() => {
    const { parsedQuery } = getParsedQuery();
    if (!parsedQuery.versioningStrategy && !project.isProvidedViaProps) {
      const { queryParams } = getQueryParamsWithUpdates({
        updates: [
          { key: "versioningStrategy", value: project.versioningStrategy }
        ]
      });
      navigate(`?${queryParams}`, { replace: true });
    }
  }, []);
  return /* @__PURE__ */ React.createElement(FormControl, {
    component: "fieldset",
    required: true,
    disabled: project.isProvidedViaProps
  }, /* @__PURE__ */ React.createElement(FormLabel, {
    component: "legend"
  }, "Versioning strategy"), /* @__PURE__ */ React.createElement(RadioGroup, {
    "data-testid": TEST_IDS.form.versioningStrategy.radioGroup,
    "aria-label": "calendar-strategy",
    name: "calendar-strategy",
    value: project.versioningStrategy,
    onChange: (event) => {
      const { queryParams } = getQueryParamsWithUpdates({
        updates: [{ key: "versioningStrategy", value: event.target.value }]
      });
      navigate(`?${queryParams}`, { replace: true });
    }
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    value: VERSIONING_STRATEGIES.semver,
    control: /* @__PURE__ */ React.createElement(Radio, null),
    label: "Semantic versioning"
  }), /* @__PURE__ */ React.createElement(FormControlLabel, {
    value: VERSIONING_STRATEGIES.calver,
    control: /* @__PURE__ */ React.createElement(Radio, null),
    label: "Calendar versioning"
  })));
}

function RepoDetailsForm() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(VersioningStrategy, null), /* @__PURE__ */ React.createElement(Owner, null), /* @__PURE__ */ React.createElement(Repo, null));
}

function GitReleaseManager(props) {
  var _a, _b, _c, _d;
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { getParsedQuery } = useQueryHandler();
  const { parsedQuery } = getParsedQuery();
  const project = isProjectValid(props.project) ? {
    ...props.project,
    isProvidedViaProps: true
  } : {
    owner: (_a = parsedQuery.owner) != null ? _a : "",
    repo: (_b = parsedQuery.repo) != null ? _b : "",
    versioningStrategy: (_c = parsedQuery.versioningStrategy) != null ? _c : "semver",
    isProvidedViaProps: false
  };
  const userResponse = useAsync(() => pluginApiClient.getUser({ owner: project.owner, repo: project.repo }));
  if (userResponse.error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, userResponse.error.message);
  }
  if (userResponse.loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (!((_d = userResponse.value) == null ? void 0 : _d.user.username)) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Unable to retrieve username");
  }
  const user = userResponse.value.user;
  return /* @__PURE__ */ React.createElement(ProjectContext.Provider, {
    value: { project }
  }, /* @__PURE__ */ React.createElement(UserContext.Provider, {
    value: { user }
  }, /* @__PURE__ */ React.createElement(Box, {
    maxWidth: 999
  }, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: "Git Release Manager"
  }), /* @__PURE__ */ React.createElement(InfoCardPlus, null, /* @__PURE__ */ React.createElement(RepoDetailsForm, null)), isProjectValid(project) && /* @__PURE__ */ React.createElement(Features, {
    features: props.features
  }))));
}

export { GitReleaseManager };
//# sourceMappingURL=GitReleaseManager-b1a11869.esm.js.map
