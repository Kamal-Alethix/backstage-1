import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { MissingAnnotationEmptyState, Progress, InfoCard, ErrorPanel, EmptyState } from '@backstage/core-components';
import hash from 'object-hash';
import { makeStyles } from '@material-ui/core/styles';
import { useApi } from '@backstage/core-plugin-api';
import { a as airbrakeApiRef } from './index-b87461ed.esm.js';
import useAsync from 'react-use/lib/useAsync';
import '@backstage/plugin-catalog-react';

const AIRBRAKE_PROJECT_ID_ANNOTATION = "airbrake.io/project-id";
const useProjectId = (entity) => {
  var _a, _b;
  return (_b = (_a = entity == null ? void 0 : entity.metadata.annotations) == null ? void 0 : _a[AIRBRAKE_PROJECT_ID_ANNOTATION]) != null ? _b : "";
};

const useStyles = makeStyles(() => ({
  multilineText: {
    whiteSpace: "pre-wrap"
  }
}));
const EntityAirbrakeWidget = ({ entity }) => {
  var _a;
  const classes = useStyles();
  const projectId = useProjectId(entity);
  const airbrakeApi = useApi(airbrakeApiRef);
  const { loading, value, error } = useAsync(() => {
    if (!projectId) {
      return Promise.resolve(void 0);
    }
    return airbrakeApi.fetchGroups(projectId);
  }, [airbrakeApi, projectId]);
  if (!projectId) {
    return /* @__PURE__ */ React.createElement(MissingAnnotationEmptyState, {
      annotation: AIRBRAKE_PROJECT_ID_ANNOTATION
    });
  } else if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (value) {
    return /* @__PURE__ */ React.createElement(Grid, {
      container: true,
      spacing: 3,
      direction: "column"
    }, (_a = value.groups) == null ? void 0 : _a.map((group) => {
      var _a2;
      return /* @__PURE__ */ React.createElement(Grid, {
        item: true,
        key: group.id
      }, (_a2 = group.errors) == null ? void 0 : _a2.map((groupError) => /* @__PURE__ */ React.createElement(InfoCard, {
        title: groupError.type,
        key: hash(groupError)
      }, /* @__PURE__ */ React.createElement(Typography, {
        variant: "body1",
        className: classes.multilineText
      }, groupError.message))));
    }));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, error && /* @__PURE__ */ React.createElement(ErrorPanel, {
    error
  }), /* @__PURE__ */ React.createElement(EmptyState, {
    missing: "info",
    title: "No information to display",
    description: `There is no Airbrake project with id '${projectId}' or there was an issue communicating with Airbrake.`
  }));
};

export { EntityAirbrakeWidget };
//# sourceMappingURL=index-e08215d4.esm.js.map
