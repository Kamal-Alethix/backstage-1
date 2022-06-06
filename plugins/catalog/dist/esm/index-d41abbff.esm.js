import { RELATION_DEPENDS_ON } from '@backstage/catalog-model';
import React from 'react';
import { R as RelatedEntitiesCard, r as resourceEntityColumns, d as componentEntityHelpLink, f as asResourceEntities } from './presets-13b889b9.esm.js';
import '@material-ui/core';
import '@backstage/plugin-catalog-react';
import '@backstage/core-components';

function DependsOnResourcesCard(props) {
  const { variant = "gridItem" } = props;
  return /* @__PURE__ */ React.createElement(RelatedEntitiesCard, {
    variant,
    title: "Depends on resources",
    entityKind: "Resource",
    relationType: RELATION_DEPENDS_ON,
    columns: resourceEntityColumns,
    emptyMessage: "No resource is a dependency of this component",
    emptyHelpLink: componentEntityHelpLink,
    asRenderableEntities: asResourceEntities
  });
}

export { DependsOnResourcesCard };
//# sourceMappingURL=index-d41abbff.esm.js.map
