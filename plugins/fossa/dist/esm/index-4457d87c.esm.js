import { useEntity } from '@backstage/plugin-catalog-react';
import { Grid, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DateTime } from 'luxon';
import React__default from 'react';
import useAsync from 'react-use/lib/useAsync';
import { f as fossaApiRef } from './index-5999b13b.esm.js';
import '@backstage/errors';
import 'cross-fetch';
import 'p-limit';
import { g as getProjectName, F as FOSSA_PROJECT_NAME_ANNOTATION } from './getProjectName-f8006249.esm.js';
import { ResponseErrorPanel, Progress, MissingAnnotationEmptyState, EmptyState, InfoCard } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles((theme) => ({
  numberError: {
    fontSize: "5rem",
    textAlign: "center",
    fontWeight: theme.typography.fontWeightMedium,
    margin: theme.spacing(2, 0),
    color: theme.palette.error.main
  },
  numberSuccess: {
    fontSize: "5rem",
    textAlign: "center",
    fontWeight: theme.typography.fontWeightMedium,
    margin: theme.spacing(2, 0),
    color: theme.palette.success.main
  },
  description: {
    fontSize: "1rem",
    textAlign: "center",
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.text.secondary
  },
  disabled: {
    backgroundColor: theme.palette.background.default
  },
  lastAnalyzed: {
    color: theme.palette.text.secondary,
    textAlign: "center"
  },
  branch: {
    textDecoration: "underline dotted"
  }
}));
const Card = ({
  children,
  disabled,
  projectUrl,
  variant = "gridItem"
}) => {
  const classes = useStyles();
  return /* @__PURE__ */ React__default.createElement(InfoCard, {
    title: "License Findings",
    deepLink: projectUrl ? {
      title: "View more",
      link: projectUrl
    } : void 0,
    variant,
    className: disabled ? classes.disabled : void 0
  }, children);
};
const FossaCard = ({ variant }) => {
  const { entity } = useEntity();
  const fossaApi = useApi(fossaApiRef);
  const projectTitle = getProjectName(entity);
  const { value, loading, error } = useAsync(async () => projectTitle ? fossaApi.getFindingSummary(projectTitle) : void 0, [fossaApi, projectTitle]);
  const classes = useStyles();
  if (error) {
    return /* @__PURE__ */ React__default.createElement(Card, {
      disabled: true,
      variant
    }, /* @__PURE__ */ React__default.createElement(ResponseErrorPanel, {
      error
    }));
  }
  if (loading) {
    return /* @__PURE__ */ React__default.createElement(Card, {
      disabled: true,
      variant
    }, /* @__PURE__ */ React__default.createElement(Progress, null));
  }
  if (!projectTitle) {
    return /* @__PURE__ */ React__default.createElement(Card, {
      disabled: true,
      variant
    }, /* @__PURE__ */ React__default.createElement(MissingAnnotationEmptyState, {
      annotation: FOSSA_PROJECT_NAME_ANNOTATION
    }));
  }
  if (!value) {
    return /* @__PURE__ */ React__default.createElement(Card, {
      disabled: true,
      variant
    }, /* @__PURE__ */ React__default.createElement(EmptyState, {
      missing: "info",
      title: "No information to display",
      description: `There is no Fossa project with title '${projectTitle}'.`
    }));
  }
  return /* @__PURE__ */ React__default.createElement(Card, {
    projectUrl: value.projectUrl,
    variant
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    container: true,
    direction: "column",
    justifyContent: "space-between",
    alignItems: "center",
    style: { height: "100%" },
    spacing: 0
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React__default.createElement("p", {
    className: value.issueCount > 0 || value.dependencyCount === 0 ? classes.numberError : classes.numberSuccess
  }, value.issueCount), value.dependencyCount > 0 && /* @__PURE__ */ React__default.createElement("p", {
    className: classes.description
  }, "Number of issues"), value.dependencyCount === 0 && /* @__PURE__ */ React__default.createElement("p", {
    className: classes.description
  }, "No Dependencies.", /* @__PURE__ */ React__default.createElement("br", null), "Please check your FOSSA project settings.")), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    className: classes.lastAnalyzed
  }, "Last analyzed on", " ", DateTime.fromISO(value.timestamp).toLocaleString(DateTime.DATETIME_MED)), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    className: classes.lastAnalyzed
  }, "Based on ", value.dependencyCount, " Dependencies on branch", " ", /* @__PURE__ */ React__default.createElement(Tooltip, {
    title: "The default branch can be changed by a FOSSA admin."
  }, /* @__PURE__ */ React__default.createElement("span", {
    className: classes.branch
  }, value.projectDefaultBranch)), ".")));
};

export { FossaCard };
//# sourceMappingURL=index-4457d87c.esm.js.map
