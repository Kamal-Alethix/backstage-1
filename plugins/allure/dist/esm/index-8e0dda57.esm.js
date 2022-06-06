import React from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { i as isAllureReportAvailable, A as ALLURE_PROJECT_ID_ANNOTATION, a as allureApiRef, g as getAllureProjectId } from './index-cc7d96cc.esm.js';
import { useEntity } from '@backstage/plugin-catalog-react';
import { MissingAnnotationEmptyState, Progress } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';

const AllureReport = (props) => {
  const allureApi = useApi(allureApiRef);
  const allureProjectId = getAllureProjectId(props.entity);
  const { value, loading } = useAsync(async () => {
    const url = await allureApi.getReportUrl(allureProjectId);
    return url;
  });
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  return /* @__PURE__ */ React.createElement("iframe", {
    style: {
      display: "table",
      width: "100%",
      height: "100%"
    },
    title: "Allure Report",
    src: value
  });
};
const AllureReportComponent = () => {
  const { entity } = useEntity();
  const isReportAvailable = entity && isAllureReportAvailable(entity);
  if (isReportAvailable)
    return /* @__PURE__ */ React.createElement(AllureReport, {
      entity
    });
  return /* @__PURE__ */ React.createElement(MissingAnnotationEmptyState, {
    annotation: ALLURE_PROJECT_ID_ANNOTATION
  });
};

export { AllureReportComponent };
//# sourceMappingURL=index-8e0dda57.esm.js.map
