import React from 'react';
import { makeStyles, Grid, Typography } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import { InfoCard } from '@backstage/core-components';
import { techInsightsApiRef } from '../index.esm.js';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  subheader: {
    fontWeight: "bold",
    paddingLeft: theme.spacing(0.5)
  }
}));
const infoCard = (title, description, className, element) => /* @__PURE__ */ React.createElement(Grid, {
  item: true,
  xs: 12
}, /* @__PURE__ */ React.createElement(InfoCard, {
  title
}, /* @__PURE__ */ React.createElement(Typography, {
  className,
  variant: "body1",
  gutterBottom: true
}, description), /* @__PURE__ */ React.createElement(Grid, {
  item: true,
  xs: 12
}, element)));
const ScorecardInfo = ({ checks, title, description }) => {
  const classes = useStyles();
  const api = useApi(techInsightsApiRef);
  if (!checks.length) {
    return infoCard(title, description, classes.subheader, /* @__PURE__ */ React.createElement(Alert, {
      severity: "warning"
    }, "No checks have any data yet."));
  }
  const checkRenderType = api.getScorecardsDefinition(checks[0].check.type, checks, title, description);
  if (checkRenderType) {
    return infoCard(checkRenderType.title, checkRenderType.description, classes.subheader, checkRenderType.component);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null);
};

export { ScorecardInfo as S };
//# sourceMappingURL=ScorecardInfo-818291de.esm.js.map
