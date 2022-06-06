import { RELATION_HAS_PART } from '@backstage/catalog-model';
import React from 'react';
import { R as RelatedEntitiesCard, r as resourceEntityColumns, f as asResourceEntities, g as resourceEntityHelpLink } from './presets-13b889b9.esm.js';
import '@material-ui/core';
import '@backstage/plugin-catalog-react';
import '@backstage/core-components';

function HasResourcesCard(props) {
  const { variant = "gridItem" } = props;
  return /* @__PURE__ */ React.createElement(RelatedEntitiesCard, {
    variant,
    title: "Has resources",
    entityKind: "Resource",
    relationType: RELATION_HAS_PART,
    columns: resourceEntityColumns,
    asRenderableEntities: asResourceEntities,
    emptyMessage: "No resource is part of this system",
    emptyHelpLink: resourceEntityHelpLink
  });
}

export { HasResourcesCard };
//# sourceMappingURL=index-b3ad464b.esm.js.map
