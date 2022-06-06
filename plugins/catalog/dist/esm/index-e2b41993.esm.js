import React from 'react';
import { useOutlet } from 'react-router';
import { PageWithHeader, Content, ContentHeader, CreateButton, SupportButton } from '@backstage/core-components';
import { useApi, configApiRef, useRouteRef } from '@backstage/core-plugin-api';
import { EntityListProvider, CatalogFilterLayout, EntityTypePicker, UserListPicker, EntityOwnerPicker, EntityLifecyclePicker, EntityTagPicker } from '@backstage/plugin-catalog-react';
import { c as createComponentRouteRef, C as CatalogKindHeader, a as CatalogTable } from './index-7bccb118.esm.js';
import 'zen-observable';
import '@backstage/catalog-model';
import 'lodash';
import '@backstage/integration-react';
import '@material-ui/core';
import '@material-ui/icons/Cached';
import '@material-ui/icons/Description';
import '@material-ui/icons/Edit';
import 'react-use/lib/useAsync';
import '@backstage/plugin-search-react';
import '@material-ui/icons/OpenInNew';
import '@material-ui/icons/StarBorder';
import '@material-ui/core/styles';
import '@material-ui/icons/Star';
import '@material-ui/lab';
import '@material-ui/icons/Cancel';
import '@material-ui/icons/BugReport';
import '@material-ui/icons/MoreVert';
import '@backstage/plugin-catalog-common';
import '@backstage/errors';
import '@backstage/catalog-client';

function DefaultCatalogPage(props) {
  var _a;
  const {
    columns,
    actions,
    initiallySelectedFilter = "owned",
    initialKind = "component",
    tableOptions = {}
  } = props;
  const orgName = (_a = useApi(configApiRef).getOptionalString("organization.name")) != null ? _a : "Backstage";
  const createComponentLink = useRouteRef(createComponentRouteRef);
  return /* @__PURE__ */ React.createElement(PageWithHeader, {
    title: `${orgName} Catalog`,
    themeId: "home"
  }, /* @__PURE__ */ React.createElement(EntityListProvider, null, /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(ContentHeader, {
    titleComponent: /* @__PURE__ */ React.createElement(CatalogKindHeader, {
      initialFilter: initialKind
    })
  }, /* @__PURE__ */ React.createElement(CreateButton, {
    title: "Create Component",
    to: createComponentLink && createComponentLink()
  }), /* @__PURE__ */ React.createElement(SupportButton, null, "All your software catalog entities")), /* @__PURE__ */ React.createElement(CatalogFilterLayout, null, /* @__PURE__ */ React.createElement(CatalogFilterLayout.Filters, null, /* @__PURE__ */ React.createElement(EntityTypePicker, null), /* @__PURE__ */ React.createElement(UserListPicker, {
    initialFilter: initiallySelectedFilter
  }), /* @__PURE__ */ React.createElement(EntityOwnerPicker, null), /* @__PURE__ */ React.createElement(EntityLifecyclePicker, null), /* @__PURE__ */ React.createElement(EntityTagPicker, null)), /* @__PURE__ */ React.createElement(CatalogFilterLayout.Content, null, /* @__PURE__ */ React.createElement(CatalogTable, {
    columns,
    actions,
    tableOptions
  }))))));
}

function CatalogPage(props) {
  const outlet = useOutlet();
  return outlet || /* @__PURE__ */ React.createElement(DefaultCatalogPage, {
    ...props
  });
}

export { CatalogPage, DefaultCatalogPage };
//# sourceMappingURL=index-e2b41993.esm.js.map
