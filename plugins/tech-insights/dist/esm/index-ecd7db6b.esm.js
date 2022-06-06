import React from 'react';
import { useParams } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import { Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { S as ScorecardInfo } from './ScorecardInfo-818291de.esm.js';
import Alert from '@material-ui/lab/Alert';
import { techInsightsApiRef } from '../index.esm.js';
import '@material-ui/core';
import '@material-ui/lab';
import '@backstage/errors';
import '@material-ui/icons/CheckCircleOutline';
import '@material-ui/icons/ErrorOutline';

const ScorecardsCard = ({
  title,
  description,
  checksId
}) => {
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
  return /* @__PURE__ */ React.createElement(ScorecardInfo, {
    title,
    description,
    checks: value || []
  });
};

export { ScorecardsCard };
//# sourceMappingURL=index-ecd7db6b.esm.js.map
