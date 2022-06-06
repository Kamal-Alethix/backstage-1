import React from 'react';
import { stringifyEntityRef, RELATION_CHILD_OF, parseEntityRef } from '@backstage/catalog-model';
import { Progress, ResponseErrorPanel, DependencyGraph, DependencyGraphTypes, Link, Content, ContentHeader, SupportButton } from '@backstage/core-components';
import { useApi, configApiRef, useRouteRef } from '@backstage/core-plugin-api';
import { catalogApiRef, humanizeEntityRef, getEntityRelations, entityRouteRef } from '@backstage/plugin-catalog-react';
import { makeStyles, Typography, useTheme } from '@material-ui/core';
import ZoomOutMap from '@material-ui/icons/ZoomOutMap';
import classNames from 'classnames';
import useAsync from 'react-use/lib/useAsync';
import { makeStyles as makeStyles$1 } from '@material-ui/core/styles';

const useStyles$1 = makeStyles((theme) => ({
  graph: {
    flex: 1,
    minHeight: 0
  },
  organizationNode: {
    fill: theme.palette.secondary.light,
    stroke: theme.palette.secondary.light
  },
  groupNode: {
    fill: theme.palette.primary.light,
    stroke: theme.palette.primary.light
  },
  centeredContent: {
    padding: theme.spacing(1),
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "black"
  },
  textOrganization: {
    color: theme.palette.secondary.contrastText
  },
  textGroup: {
    color: theme.palette.primary.contrastText
  },
  textWrapper: {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "20px"
  }
}));
function RenderNode(props) {
  const nodeWidth = 180;
  const nodeHeight = 60;
  const theme = useTheme();
  const classes = useStyles$1();
  const catalogEntityRoute = useRouteRef(entityRouteRef);
  if (props.node.id === "root") {
    return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("rect", {
      width: nodeWidth,
      height: nodeHeight,
      rx: theme.shape.borderRadius,
      className: classes.organizationNode
    }), /* @__PURE__ */ React.createElement("title", null, props.node.name), /* @__PURE__ */ React.createElement("foreignObject", {
      width: nodeWidth,
      height: nodeHeight
    }, /* @__PURE__ */ React.createElement("div", {
      className: classes.centeredContent
    }, /* @__PURE__ */ React.createElement("div", {
      className: classNames(classes.textWrapper, classes.textOrganization)
    }, props.node.name))));
  }
  const ref = parseEntityRef(props.node.id);
  return /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("rect", {
    width: nodeWidth,
    height: nodeHeight,
    rx: theme.shape.borderRadius,
    className: classes.groupNode
  }), /* @__PURE__ */ React.createElement("title", null, props.node.name), /* @__PURE__ */ React.createElement(Link, {
    to: catalogEntityRoute({
      kind: ref.kind,
      namespace: ref.namespace,
      name: ref.name
    })
  }, /* @__PURE__ */ React.createElement("foreignObject", {
    width: nodeWidth,
    height: nodeHeight
  }, /* @__PURE__ */ React.createElement("div", {
    className: classes.centeredContent
  }, /* @__PURE__ */ React.createElement("div", {
    className: classNames(classes.textWrapper, classes.textGroup)
  }, props.node.name)))));
}
function GroupsDiagram() {
  var _a, _b, _c;
  const nodes = new Array();
  const edges = new Array();
  const classes = useStyles$1();
  const configApi = useApi(configApiRef);
  const catalogApi = useApi(catalogApiRef);
  const organizationName = (_a = configApi.getOptionalString("organization.name")) != null ? _a : "Backstage";
  const {
    loading,
    error,
    value: catalogResponse
  } = useAsync(() => {
    return catalogApi.getEntities({
      filter: {
        kind: ["Group"]
      }
    });
  }, [catalogApi]);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error
    });
  }
  nodes.push({
    id: "root",
    kind: "Organization",
    name: organizationName
  });
  for (const catalogItem of (catalogResponse == null ? void 0 : catalogResponse.items) || []) {
    const currentItemId = stringifyEntityRef(catalogItem);
    nodes.push({
      id: stringifyEntityRef(catalogItem),
      kind: catalogItem.kind,
      name: ((_c = (_b = catalogItem.spec) == null ? void 0 : _b.profile) == null ? void 0 : _c.displayName) || humanizeEntityRef(catalogItem, { defaultKind: "Group" })
    });
    const catalogItemRelations_childOf = getEntityRelations(catalogItem, RELATION_CHILD_OF);
    if (catalogItemRelations_childOf.length === 0) {
      edges.push({
        from: currentItemId,
        to: "root",
        label: ""
      });
    }
    catalogItemRelations_childOf.forEach((relation) => {
      edges.push({
        from: currentItemId,
        to: stringifyEntityRef(relation),
        label: ""
      });
    });
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DependencyGraph, {
    nodes,
    edges,
    nodeMargin: 10,
    direction: DependencyGraphTypes.Direction.RIGHT_LEFT,
    renderNode: RenderNode,
    className: classes.graph
  }), /* @__PURE__ */ React.createElement(Typography, {
    variant: "caption",
    style: { display: "block", textAlign: "right" }
  }, /* @__PURE__ */ React.createElement(ZoomOutMap, {
    style: { verticalAlign: "bottom" }
  }), " Use pinch & zoom to move around the diagram."));
}

const useStyles = makeStyles$1({
  root: {
    height: "100%",
    maxHeight: "100%",
    minHeight: 0
  }
});
const GroupsExplorerContent = ({
  title
}) => {
  const classes = useStyles();
  return /* @__PURE__ */ React.createElement(Content, {
    noPadding: true,
    stretch: true,
    className: classes.root
  }, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: title != null ? title : "Groups"
  }, /* @__PURE__ */ React.createElement(SupportButton, null, "Explore your groups.")), /* @__PURE__ */ React.createElement(GroupsDiagram, null));
};

export { GroupsExplorerContent as G };
//# sourceMappingURL=GroupsExplorerContent-30bb46c1.esm.js.map
