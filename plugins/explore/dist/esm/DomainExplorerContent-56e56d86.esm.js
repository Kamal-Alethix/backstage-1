import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Button } from '@material-ui/core';
import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { DomainCard } from '../index.esm.js';
import { Content, ContentHeader, SupportButton, Progress, WarningPanel, EmptyState, ItemCardGrid } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

const Body = () => {
  const catalogApi = useApi(catalogApiRef);
  const {
    value: entities,
    loading,
    error
  } = useAsync(async () => {
    const response = await catalogApi.getEntities({
      filter: { kind: "domain" }
    });
    return response.items;
  }, [catalogApi]);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(WarningPanel, {
      severity: "error",
      title: "Could not load domains."
    }, error.message);
  }
  if (!(entities == null ? void 0 : entities.length)) {
    return /* @__PURE__ */ React.createElement(EmptyState, {
      missing: "info",
      title: "No domains to display",
      description: "You haven't added any domains yet.",
      action: /* @__PURE__ */ React.createElement(Button, {
        variant: "contained",
        color: "primary",
        href: "https://backstage.io/docs/features/software-catalog/descriptor-format#kind-domain"
      }, "Read more")
    });
  }
  return /* @__PURE__ */ React.createElement(ItemCardGrid, null, entities.map((entity, index) => /* @__PURE__ */ React.createElement(DomainCard, {
    key: index,
    entity
  })));
};
const DomainExplorerContent = ({
  title
}) => {
  return /* @__PURE__ */ React.createElement(Content, {
    noPadding: true
  }, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: title != null ? title : "Domains"
  }, /* @__PURE__ */ React.createElement(SupportButton, null, "Discover the domains in your ecosystem.")), /* @__PURE__ */ React.createElement(Body, null));
};

export { DomainExplorerContent as D };
//# sourceMappingURL=DomainExplorerContent-56e56d86.esm.js.map
