import React from 'react';
import { useParams } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import { Progress, Page, Content } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { S as ScorecardInfo } from './ScorecardInfo-818291de.esm.js';
import Alert from '@material-ui/lab/Alert';
import { techInsightsApiRef } from '../index.esm.js';
import { makeStyles } from '@material-ui/core';
import '@material-ui/lab';
import '@backstage/errors';
import '@material-ui/icons/CheckCircleOutline';
import '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles(() => ({
  contentScorecards: {
    paddingLeft: 0,
    paddingRight: 0
  }
}));
const ScorecardsContent = ({
  title,
  description,
  checksId
}) => {
  const classes = useStyles();
  const api = useApi(techInsightsApiRef);
  const { namespace, kind, name } = useParams();
  const { value, loading, error } = useAsync(async () => await api.runChecks({ namespace, kind, name }, checksId));
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "home"
  }, /* @__PURE__ */ React.createElement(Content, {
    className: classes.contentScorecards
  }, /* @__PURE__ */ React.createElement(ScorecardInfo, {
    title,
    description,
    checks: value || []
  })));
};

export { ScorecardsContent };
//# sourceMappingURL=index-14cfaa0b.esm.js.map
