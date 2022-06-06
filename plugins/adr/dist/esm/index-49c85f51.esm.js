import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Content, ContentHeader, SupportButton, MissingAnnotationEmptyState, Progress, WarningPanel } from '@backstage/core-components';
import { useRouteRef, useApi } from '@backstage/core-plugin-api';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import { isAdrAvailable, getAdrLocationUrl, madrFilePathFilter, ANNOTATION_ADR_LOCATION } from '@backstage/plugin-adr-common';
import { useEntity } from '@backstage/plugin-catalog-react';
import { makeStyles, Grid, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { r as rootRouteRef, u as useOctokitRequest, A as AdrReader } from './index-28df527c.esm.js';
import 'git-url-parse';
import 'react-use/lib/useAsync';
import 'octokit';
import '@backstage/plugin-search-react';

const useStyles = makeStyles((theme) => ({
  adrMenu: {
    backgroundColor: theme.palette.background.paper
  }
}));
const EntityAdrContent = ({
  contentDecorators,
  filePathFilterFn
}) => {
  var _a;
  const classes = useStyles();
  const { entity } = useEntity();
  const rootLink = useRouteRef(rootRouteRef);
  const [adrList, setAdrList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const scmIntegrations = useApi(scmIntegrationsApiRef);
  const entityHasAdrs = isAdrAvailable(entity);
  const { value, loading, error } = useOctokitRequest(getAdrLocationUrl(entity, scmIntegrations));
  const selectedAdr = (_a = adrList.find((adr) => adr === searchParams.get("record"))) != null ? _a : "";
  useEffect(() => {
    if (adrList.length && !selectedAdr) {
      searchParams.set("record", adrList[0]);
      setSearchParams(searchParams, { replace: true });
    }
  });
  useEffect(() => {
    if (!(value == null ? void 0 : value.data)) {
      return;
    }
    const adrs = value.data.filter((item) => item.type === "file" && (filePathFilterFn ? filePathFilterFn(item.name) : madrFilePathFilter(item.name))).map(({ name }) => name);
    setAdrList(adrs);
  }, [filePathFilterFn, value]);
  return /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: "Architecture Decision Records"
  }, /* @__PURE__ */ React.createElement(SupportButton, null)), !entityHasAdrs && /* @__PURE__ */ React.createElement(MissingAnnotationEmptyState, {
    annotation: ANNOTATION_ADR_LOCATION
  }), loading && /* @__PURE__ */ React.createElement(Progress, null), entityHasAdrs && !loading && error && /* @__PURE__ */ React.createElement(WarningPanel, {
    title: "Failed to fetch ADRs",
    message: error == null ? void 0 : error.message
  }), entityHasAdrs && !loading && !error && (adrList.length ? /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    direction: "row"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(List, {
    className: classes.adrMenu,
    dense: true
  }, adrList.map((adr, idx) => /* @__PURE__ */ React.createElement(ListItem, {
    key: idx,
    button: true,
    component: Link,
    to: `${rootLink()}?record=${adr}`,
    selected: selectedAdr === adr
  }, /* @__PURE__ */ React.createElement(ListItemText, {
    secondaryTypographyProps: { noWrap: true },
    secondary: adr.replace(/\.md$/, "")
  }))))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 9
  }, /* @__PURE__ */ React.createElement(AdrReader, {
    adr: selectedAdr,
    decorators: contentDecorators
  }))) : /* @__PURE__ */ React.createElement(Typography, null, "No ADRs found")));
};

export { EntityAdrContent };
//# sourceMappingURL=index-49c85f51.esm.js.map
