import React from 'react';
import { useOutlet } from 'react-router';
import { D as DomainExplorerContent } from './DomainExplorerContent-56e56d86.esm.js';
import { ExploreLayout } from '../index.esm.js';
import { G as GroupsExplorerContent } from './GroupsExplorerContent-30bb46c1.esm.js';
import { T as ToolExplorerContent } from './ToolExplorerContent-8de53a9f.esm.js';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import '@backstage/plugin-catalog-react';
import '@material-ui/core';
import 'react-use/lib/useAsync';
import '@backstage/core-components';
import '@backstage/catalog-model';
import '@backstage/plugin-explore-react';
import '@material-ui/icons/ZoomOutMap';
import 'classnames';
import '@material-ui/core/styles';

const DefaultExplorePage = () => {
  var _a;
  const configApi = useApi(configApiRef);
  const organizationName = (_a = configApi.getOptionalString("organization.name")) != null ? _a : "Backstage";
  return /* @__PURE__ */ React.createElement(ExploreLayout, {
    title: `Explore the ${organizationName} ecosystem`,
    subtitle: "Discover solutions available in your ecosystem"
  }, /* @__PURE__ */ React.createElement(ExploreLayout.Route, {
    path: "domains",
    title: "Domains"
  }, /* @__PURE__ */ React.createElement(DomainExplorerContent, null)), /* @__PURE__ */ React.createElement(ExploreLayout.Route, {
    path: "groups",
    title: "Groups"
  }, /* @__PURE__ */ React.createElement(GroupsExplorerContent, null)), /* @__PURE__ */ React.createElement(ExploreLayout.Route, {
    path: "tools",
    title: "Tools"
  }, /* @__PURE__ */ React.createElement(ToolExplorerContent, null)));
};

const ExplorePage = () => {
  const outlet = useOutlet();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, outlet || /* @__PURE__ */ React.createElement(DefaultExplorePage, null));
};

export { ExplorePage };
//# sourceMappingURL=index-f9f0fffe.esm.js.map
