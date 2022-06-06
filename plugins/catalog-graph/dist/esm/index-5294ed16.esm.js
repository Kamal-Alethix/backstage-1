import { getCompoundEntityRef, parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { InfoCard } from '@backstage/core-components';
import { useRouteRef, useAnalytics } from '@backstage/core-plugin-api';
import { useEntity, entityRouteRef, humanizeEntityRef } from '@backstage/plugin-catalog-react';
import { makeStyles } from '@material-ui/core';
import qs from 'qs';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ALL_RELATION_PAIRS, Direction, catalogGraphRouteRef, EntityRelationsGraph } from '../index.esm.js';
import 'classnames';
import '@material-ui/core/styles/makeStyles';
import '@material-ui/core/styles';
import '@material-ui/icons/Work';
import 'react-use/lib/useDebounce';
import 'p-limit';
import 'react-use/lib/useAsyncFn';

const useStyles = makeStyles({
  card: ({ height }) => ({
    display: "flex",
    flexDirection: "column",
    maxHeight: height,
    minHeight: height
  }),
  graph: {
    flex: 1,
    minHeight: 0
  }
});
const CatalogGraphCard = (props) => {
  const {
    variant = "gridItem",
    relationPairs = ALL_RELATION_PAIRS,
    maxDepth = 1,
    unidirectional = true,
    mergeRelations = true,
    kinds,
    relations,
    direction = Direction.LEFT_RIGHT,
    height,
    title = "Relations",
    zoom = "enable-on-click"
  } = props;
  const { entity } = useEntity();
  const entityName = getCompoundEntityRef(entity);
  const catalogEntityRoute = useRouteRef(entityRouteRef);
  const catalogGraphRoute = useRouteRef(catalogGraphRouteRef);
  const navigate = useNavigate();
  const classes = useStyles({ height });
  const analytics = useAnalytics();
  const onNodeClick = useCallback((node, _) => {
    var _a;
    const nodeEntityName = parseEntityRef(node.id);
    const path = catalogEntityRoute({
      kind: nodeEntityName.kind.toLocaleLowerCase("en-US"),
      namespace: nodeEntityName.namespace.toLocaleLowerCase("en-US"),
      name: nodeEntityName.name
    });
    analytics.captureEvent("click", (_a = node.title) != null ? _a : humanizeEntityRef(nodeEntityName), { attributes: { to: path } });
    navigate(path);
  }, [catalogEntityRoute, navigate, analytics]);
  const catalogGraphParams = qs.stringify({ rootEntityRefs: [stringifyEntityRef(entity)] }, { arrayFormat: "brackets", addQueryPrefix: true });
  const catalogGraphUrl = `${catalogGraphRoute()}${catalogGraphParams}`;
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title,
    cardClassName: classes.card,
    variant,
    noPadding: true,
    deepLink: {
      title: "View graph",
      link: catalogGraphUrl
    }
  }, /* @__PURE__ */ React.createElement(EntityRelationsGraph, {
    rootEntityNames: entityName,
    maxDepth,
    unidirectional,
    mergeRelations,
    kinds,
    relations,
    direction,
    onNodeClick,
    className: classes.graph,
    relationPairs,
    zoom
  }));
};

export { CatalogGraphCard };
//# sourceMappingURL=index-5294ed16.esm.js.map
