import React, { createContext, useContext, useRef, useEffect, useMemo } from 'react';
import useObservable from 'react-use/lib/useObservable';
import { configSchemaApiRef } from '../index.esm.js';
import 'zen-observable';
import '@backstage/errors';
import { makeStyles, Chip, Box, Divider, Typography, Paper, Table, TableBody, TableRow, TableCell, withStyles, createStyles, alpha } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { TreeItem, TreeView } from '@material-ui/lab';
import { Page, Header, Content, Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

class ScrollTargetsForwarder {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
  }
  setScrollListener(id, listener) {
    this.listeners.set(id, listener);
    return () => {
      if (this.listeners.get(id) === listener) {
        this.listeners.delete(id);
      }
    };
  }
  scrollTo(id) {
    var _a;
    (_a = this.listeners.get(id)) == null ? void 0 : _a();
  }
}
const ScrollTargetsContext = createContext(void 0);
function ScrollTargetsProvider({ children }) {
  return /* @__PURE__ */ React.createElement(ScrollTargetsContext.Provider, {
    value: new ScrollTargetsForwarder(),
    children
  });
}
function useScrollTargets() {
  return useContext(ScrollTargetsContext);
}

function titleVariant(depth) {
  if (depth <= 1) {
    return "h2";
  } else if (depth === 2) {
    return "h3";
  } else if (depth === 3) {
    return "h4";
  } else if (depth === 4) {
    return "h5";
  }
  return "h6";
}
const useChildViewStyles = makeStyles((theme) => ({
  title: {
    marginBottom: 0
  },
  chip: {
    marginLeft: theme.spacing(1),
    marginRight: 0,
    marginBottom: 0
  }
}));
function ChildView({
  path,
  depth,
  schema,
  required,
  lastChild
}) {
  const classes = useChildViewStyles();
  const titleRef = useRef(null);
  const scroll = useScrollTargets();
  useEffect(() => {
    return scroll == null ? void 0 : scroll.setScrollListener(path, () => {
      var _a;
      (_a = titleRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    });
  }, [scroll, path]);
  const chips = new Array();
  const chipProps = { size: "small", classes: { root: classes.chip } };
  if (required) {
    chips.push(/* @__PURE__ */ React.createElement(Chip, {
      label: "required",
      color: "default",
      key: "required",
      ...chipProps
    }));
  }
  const visibility = schema == null ? void 0 : schema.visibility;
  if (visibility === "frontend") {
    chips.push(/* @__PURE__ */ React.createElement(Chip, {
      label: "frontend",
      color: "primary",
      key: "visibility",
      ...chipProps
    }));
  } else if (visibility === "secret") {
    chips.push(/* @__PURE__ */ React.createElement(Chip, {
      label: "secret",
      color: "secondary",
      key: "visibility",
      ...chipProps
    }));
  }
  return /* @__PURE__ */ React.createElement(Box, {
    paddingBottom: lastChild ? 4 : 8,
    display: "flex",
    flexDirection: "row"
  }, /* @__PURE__ */ React.createElement(Divider, {
    orientation: "vertical",
    flexItem: true
  }), /* @__PURE__ */ React.createElement(Box, {
    paddingLeft: 2,
    flex: 1
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    marginBottom: 2,
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Typography, {
    ref: titleRef,
    variant: titleVariant(depth),
    classes: { root: classes.title }
  }, path), chips.length > 0 && /* @__PURE__ */ React.createElement(Box, {
    marginLeft: 1
  }), chips), schema && /* @__PURE__ */ React.createElement(SchemaView, {
    path,
    depth,
    schema
  })));
}

function MetadataViewRow({ label, text, data }) {
  if (text === void 0 && data === void 0) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, {
    style: { width: 160 }
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1",
    noWrap: true,
    style: { fontWeight: 900 }
  }, label)), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1"
  }, data ? JSON.stringify(data) : text)));
}
function MetadataView({ schema }) {
  return /* @__PURE__ */ React.createElement(Paper, {
    variant: "outlined",
    square: true,
    style: { width: "100%" }
  }, /* @__PURE__ */ React.createElement(Table, {
    size: "small"
  }, /* @__PURE__ */ React.createElement(TableBody, null, /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Type",
    data: schema.type
  }), /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Allowed values",
    data: schema.enum
  }), schema.additionalProperties === true && /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Additional Properties",
    text: "true"
  }), schema.additionalItems === true && /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Additional Items",
    text: "true"
  }), /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Format",
    text: schema.format
  }), /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Pattern",
    text: schema.pattern && String(schema.pattern)
  }), /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Minimum",
    data: schema.minimum
  }), /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Maximum",
    data: schema.maximum
  }), /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Exclusive minimum",
    data: schema.exclusiveMinimum
  }), /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Exclusive maximum",
    data: schema.exclusiveMaximum
  }), /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Multiple of",
    data: schema.multipleOf
  }), /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Maximum number of items",
    data: schema.maxItems
  }), /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Minimum number of items",
    data: schema.minItems
  }), /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Maximum number of properties",
    data: schema.maxProperties
  }), /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Minimum number of properties",
    data: schema.minProperties
  }), /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Maximum Length",
    data: schema.maxLength
  }), /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Minimum Length",
    data: schema.minLength
  }), /* @__PURE__ */ React.createElement(MetadataViewRow, {
    label: "Items must be unique",
    data: schema.uniqueItems
  }))));
}

function ArrayView({ path, depth, schema }) {
  const itemDepth = depth + 1;
  const itemPath = path ? `${path}[]` : "[]";
  const itemSchema = schema.items;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 4
  }, schema.description && /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 4
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1"
  }, schema.description)), /* @__PURE__ */ React.createElement(MetadataView, {
    schema
  })), /* @__PURE__ */ React.createElement(Typography, {
    variant: "overline"
  }, "Items"), /* @__PURE__ */ React.createElement(ChildView, {
    lastChild: true,
    path: itemPath,
    depth: itemDepth,
    schema: itemSchema
  }), schema.additionalItems && schema.additionalItems !== true && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "overline"
  }, "Additional Items"), /* @__PURE__ */ React.createElement(ChildView, {
    path: itemPath,
    depth: itemDepth,
    schema: schema.additionalItems,
    lastChild: true
  })));
}

function MatchView({
  path,
  depth,
  schema,
  label
}) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "overline"
  }, label), schema.map((optionSchema, index) => /* @__PURE__ */ React.createElement(ChildView, {
    key: index,
    path: `${path}/${index + 1}`,
    depth: depth + 1,
    schema: optionSchema,
    lastChild: index === schema.length - 1
  })));
}

function isRequired(name, required) {
  if (required === true) {
    return true;
  }
  if (Array.isArray(required)) {
    return required.includes(name);
  }
  return false;
}
function ObjectView({ path, depth, schema }) {
  var _a, _b;
  const properties = Object.entries((_a = schema.properties) != null ? _a : {});
  const patternProperties = Object.entries((_b = schema.patternProperties) != null ? _b : {});
  return /* @__PURE__ */ React.createElement(React.Fragment, null, depth > 0 && /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 4
  }, schema.description && /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 4
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1"
  }, schema.description)), /* @__PURE__ */ React.createElement(MetadataView, {
    schema
  })), properties.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, depth > 0 && /* @__PURE__ */ React.createElement(Typography, {
    variant: "overline"
  }, "Properties"), properties.map(([name, propSchema], index) => /* @__PURE__ */ React.createElement(ChildView, {
    key: name,
    path: path ? `${path}.${name}` : name,
    depth: depth + 1,
    schema: propSchema,
    lastChild: index === properties.length - 1,
    required: isRequired(name, schema.required)
  }))), patternProperties.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, depth > 0 && /* @__PURE__ */ React.createElement(Typography, {
    variant: "overline"
  }, "Pattern Properties"), patternProperties.map(([name, propSchema], index) => /* @__PURE__ */ React.createElement(ChildView, {
    key: name,
    path: path ? `${path}.<${name}>` : name,
    depth: depth + 1,
    schema: propSchema,
    lastChild: index === patternProperties.length - 1,
    required: isRequired(name, schema.required)
  }))), schema.additionalProperties && schema.additionalProperties !== true && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "overline"
  }, "Additional Properties"), /* @__PURE__ */ React.createElement(ChildView, {
    path: `${path}.*`,
    depth: depth + 1,
    schema: schema.additionalProperties,
    lastChild: true
  })));
}

function ScalarView({ schema }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, schema.description && /* @__PURE__ */ React.createElement(Box, {
    marginBottom: 4
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1"
  }, schema.description)), /* @__PURE__ */ React.createElement(MetadataView, {
    schema
  }));
}

function SchemaView(props) {
  const { schema } = props;
  if (schema.anyOf) {
    return /* @__PURE__ */ React.createElement(MatchView, {
      ...props,
      schema: schema.anyOf,
      label: "Any of the following"
    });
  }
  if (schema.oneOf) {
    return /* @__PURE__ */ React.createElement(MatchView, {
      ...props,
      schema: schema.oneOf,
      label: "One of the following"
    });
  }
  if (schema.allOf) {
    return /* @__PURE__ */ React.createElement(MatchView, {
      ...props,
      schema: schema.allOf,
      label: "All of the following"
    });
  }
  switch (schema.type) {
    case "array":
      return /* @__PURE__ */ React.createElement(ArrayView, {
        ...props
      });
    case "object":
    case void 0:
      return /* @__PURE__ */ React.createElement(ObjectView, {
        ...props
      });
    default:
      return /* @__PURE__ */ React.createElement(ScalarView, {
        ...props
      });
  }
}

const StyledTreeItem = withStyles((theme) => createStyles({
  label: {
    userSelect: "none"
  },
  group: {
    marginLeft: 7,
    paddingLeft: theme.spacing(1),
    borderLeft: `1px solid ${alpha(theme.palette.text.primary, 0.15)}`
  }
}))((props) => /* @__PURE__ */ React.createElement(TreeItem, {
  ...props
}));
function createSchemaBrowserItems(expanded, schema, path = "", depth = 0) {
  let matchArr;
  if (schema.anyOf) {
    matchArr = schema.anyOf;
  } else if (schema.oneOf) {
    matchArr = schema.oneOf;
  } else if (schema.allOf) {
    matchArr = schema.allOf;
  }
  if (matchArr) {
    return matchArr.map((childSchema, index) => {
      const childPath = `${path}/${index + 1}`;
      if (depth > 0)
        expanded.push(childPath);
      return /* @__PURE__ */ React.createElement(StyledTreeItem, {
        key: childPath,
        nodeId: childPath,
        label: `<Option ${index + 1}>`
      }, createSchemaBrowserItems(expanded, childSchema, childPath, depth + 1));
    });
  }
  switch (schema.type) {
    case "array": {
      const childPath = `${path}[]`;
      if (depth > 0)
        expanded.push(childPath);
      return /* @__PURE__ */ React.createElement(StyledTreeItem, {
        nodeId: childPath,
        label: "[]"
      }, schema.items && createSchemaBrowserItems(expanded, schema.items, childPath, depth + 1));
    }
    case "object":
    case void 0: {
      const children = [];
      if (schema.properties) {
        children.push(...Object.entries(schema.properties).map(([name, childSchema]) => {
          const childPath = path ? `${path}.${name}` : name;
          if (depth > 0)
            expanded.push(childPath);
          return /* @__PURE__ */ React.createElement(StyledTreeItem, {
            key: childPath,
            nodeId: childPath,
            label: name
          }, createSchemaBrowserItems(expanded, childSchema, childPath, depth + 1));
        }));
      }
      if (schema.patternProperties) {
        children.push(...Object.entries(schema.patternProperties).map(([name, childSchema]) => {
          const childPath = `${path}.<${name}>`;
          if (depth > 0)
            expanded.push(childPath);
          return /* @__PURE__ */ React.createElement(StyledTreeItem, {
            key: childPath,
            nodeId: childPath,
            label: `<${name}>`
          }, createSchemaBrowserItems(expanded, childSchema, childPath, depth + 1));
        }));
      }
      if (schema.additionalProperties && schema.additionalProperties !== true) {
        const childPath = `${path}.*`;
        if (depth > 0)
          expanded.push(childPath);
        children.push(/* @__PURE__ */ React.createElement(StyledTreeItem, {
          key: childPath,
          nodeId: childPath,
          label: "*"
        }, createSchemaBrowserItems(expanded, schema.additionalProperties, childPath, depth + 1)));
      }
      return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
    }
    default:
      return null;
  }
}
function SchemaBrowser({ schema }) {
  const scroll = useScrollTargets();
  const expandedRef = useRef([]);
  const data = useMemo(() => {
    const expanded = new Array();
    const items = createSchemaBrowserItems(expanded, schema);
    return { items, expanded };
  }, [schema]);
  if (!scroll) {
    throw new Error("No scroll handler available");
  }
  const handleToggle = (_event, expanded) => {
    expandedRef.current = expanded;
  };
  const handleSelect = (_event, nodeId) => {
    if (expandedRef.current.includes(nodeId)) {
      scroll.scrollTo(nodeId);
    }
  };
  return /* @__PURE__ */ React.createElement(TreeView, {
    defaultExpanded: data.expanded,
    defaultCollapseIcon: /* @__PURE__ */ React.createElement(ExpandMoreIcon, null),
    defaultExpandIcon: /* @__PURE__ */ React.createElement(ChevronRightIcon, null),
    onNodeToggle: handleToggle,
    onNodeSelect: handleSelect
  }, data.items);
}

const SchemaViewer = ({ schema }) => {
  return /* @__PURE__ */ React.createElement(Box, {
    flex: "1",
    position: "relative"
  }, /* @__PURE__ */ React.createElement(Box, {
    clone: true,
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    maxHeight: "100%"
  }, /* @__PURE__ */ React.createElement(Paper, {
    elevation: 3
  }, /* @__PURE__ */ React.createElement(ScrollTargetsProvider, null, /* @__PURE__ */ React.createElement(Box, {
    padding: 1,
    overflow: "auto",
    width: 300
  }, /* @__PURE__ */ React.createElement(SchemaBrowser, {
    schema
  })), /* @__PURE__ */ React.createElement(Box, {
    flex: "1",
    overflow: "auto"
  }, /* @__PURE__ */ React.createElement(SchemaView, {
    schema,
    path: "",
    depth: 0
  }))))));
};

const ConfigSchemaPage = () => {
  const configSchemaApi = useApi(configSchemaApiRef);
  const schemaResult = useObservable(useMemo(() => configSchemaApi.schema$(), [configSchemaApi]));
  let content;
  if (schemaResult) {
    if (schemaResult.schema) {
      content = /* @__PURE__ */ React.createElement(SchemaViewer, {
        schema: schemaResult.schema
      });
    } else {
      content = /* @__PURE__ */ React.createElement(Typography, {
        variant: "h4"
      }, "No configuration schema available");
    }
  } else {
    content = /* @__PURE__ */ React.createElement(Progress, null);
  }
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "tool"
  }, /* @__PURE__ */ React.createElement(Header, {
    title: "Configuration Reference"
  }), /* @__PURE__ */ React.createElement(Content, {
    stretch: true
  }, content));
};

export { ConfigSchemaPage };
//# sourceMappingURL=index-f3b4f759.esm.js.map
