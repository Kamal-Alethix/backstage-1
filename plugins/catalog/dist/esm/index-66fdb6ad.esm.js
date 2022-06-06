import { RELATION_DEPENDS_ON } from '@backstage/catalog-model';
import React from 'react';
import { R as RelatedEntitiesCard, c as componentEntityColumns, d as componentEntityHelpLink, e as asComponentEntities } from './presets-13b889b9.esm.js';
import '@material-ui/core';
import '@backstage/plugin-catalog-react';
import '@backstage/core-components';

function DependsOnComponentsCard(props) {
  const { variant = "gridItem", title = "Depends on components" } = props;
  return /* @__PURE__ */ React.createElement(RelatedEntitiesCard, {
    variant,
    title,
    entityKind: "Component",
    relationType: RELATION_DEPENDS_ON,
    columns: componentEntityColumns,
    emptyMessage: "No component is a dependency of this component",
    emptyHelpLink: componentEntityHelpLink,
    asRenderableEntities: asComponentEntities
  });
}

export { DependsOnComponentsCard };
//# sourceMappingURL=index-66fdb6ad.esm.js.map
