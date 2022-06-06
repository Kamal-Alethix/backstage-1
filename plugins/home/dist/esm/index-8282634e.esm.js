import { catalogApiRef, entityRouteRef, useStarredEntities, entityRouteParams } from '@backstage/plugin-catalog-react';
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { Progress, ResponseErrorPanel, Link } from '@backstage/core-components';
import { Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Tooltip, IconButton } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import React from 'react';
import useAsync from 'react-use/lib/useAsync';

const Content = () => {
  var _a;
  const catalogApi = useApi(catalogApiRef);
  const catalogEntityRoute = useRouteRef(entityRouteRef);
  const { starredEntities, toggleStarredEntity } = useStarredEntities();
  const entities = useAsync(async () => {
    if (!starredEntities.size) {
      return [];
    }
    const filter = [...starredEntities].map((ent) => parseEntityRef(ent)).map((ref) => ({
      kind: ref.kind,
      "metadata.namespace": ref.namespace,
      "metadata.name": ref.name
    }));
    return (await catalogApi.getEntities({
      filter,
      fields: [
        "kind",
        "metadata.namespace",
        "metadata.name",
        "metadata.title"
      ]
    })).items;
  }, [catalogApi, starredEntities]);
  if (starredEntities.size === 0)
    return /* @__PURE__ */ React.createElement(Typography, {
      variant: "body1"
    }, "You do not have any starred entities yet!");
  if (entities.loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  return entities.error ? /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
    error: entities.error
  }) : /* @__PURE__ */ React.createElement(List, null, (_a = entities.value) == null ? void 0 : _a.sort((a, b) => {
    var _a2, _b;
    return ((_a2 = a.metadata.title) != null ? _a2 : a.metadata.name).localeCompare((_b = b.metadata.title) != null ? _b : b.metadata.name);
  }).map((entity) => {
    var _a2;
    return /* @__PURE__ */ React.createElement(ListItem, {
      key: stringifyEntityRef(entity)
    }, /* @__PURE__ */ React.createElement(Link, {
      to: catalogEntityRoute(entityRouteParams(entity))
    }, /* @__PURE__ */ React.createElement(ListItemText, {
      primary: (_a2 = entity.metadata.title) != null ? _a2 : entity.metadata.name
    })), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, null, /* @__PURE__ */ React.createElement(Tooltip, {
      title: "Remove from starred"
    }, /* @__PURE__ */ React.createElement(IconButton, {
      edge: "end",
      "aria-label": "unstar",
      onClick: () => toggleStarredEntity(entity)
    }, /* @__PURE__ */ React.createElement(StarIcon, {
      style: { color: "#f3ba37" }
    })))));
  }));
};

export { Content };
//# sourceMappingURL=index-8282634e.esm.js.map
