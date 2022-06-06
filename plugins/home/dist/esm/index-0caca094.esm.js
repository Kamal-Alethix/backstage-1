import { Typography } from '@material-ui/core';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import React from 'react';

const CompanyLogo = (props) => {
  const { logo, className } = props;
  const configApi = useApi(configApiRef);
  return /* @__PURE__ */ React.createElement("div", {
    className
  }, logo ? /* @__PURE__ */ React.createElement(React.Fragment, null, logo) : /* @__PURE__ */ React.createElement(Typography, {
    variant: "h1"
  }, configApi.getString("app.title")));
};

export { CompanyLogo };
//# sourceMappingURL=index-0caca094.esm.js.map
