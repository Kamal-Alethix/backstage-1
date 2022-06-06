import ObservableImpl from 'zen-observable';
import { stringifyEntityRef, RELATION_PART_OF, RELATION_OWNED_BY, ANNOTATION_EDIT_URL, DEFAULT_NAMESPACE, ANNOTATION_LOCATION, ANNOTATION_VIEW_URL } from '@backstage/catalog-model';
import { isArray, isString, capitalize as capitalize$1 } from 'lodash';
import { Link, HeaderIconLinkRow, OverflowTooltip, WarningPanel, CodeSnippet, Table, Page, Header, Progress, RoutedTabs, Content, HeaderLabel, ResponseErrorPanel } from '@backstage/core-components';
import { createExternalRouteRef, createRouteRef, useElementFilter, useApi, alertApiRef, useRouteRef, attachComponentData, useRouteRefParams, useApiHolder, createPlugin, createApiFactory, discoveryApiRef, fetchApiRef, storageApiRef, createRoutableExtension, createComponentExtension } from '@backstage/core-plugin-api';
import { scmIntegrationsApiRef, ScmIntegrationIcon } from '@backstage/integration-react';
import { getEntityRelations, EntityRefLinks, useEntity, catalogApiRef, getEntitySourceLocation, useEntityList, EntityKindFilter, humanizeEntityRef, EntityRefLink, useStarredEntities, useEntityPermission, entityRouteRef, useAsyncEntity, UnregisterEntityDialog, InspectEntityDialog, FavoriteEntity, CatalogFilterLayout, starredEntitiesApiRef } from '@backstage/plugin-catalog-react';
import { makeStyles, Typography, Grid, Chip, Card, CardHeader, IconButton, Divider, CardContent, createStyles, capitalize, Select, InputBase, MenuItem, ListItem, ListItemText, Box, ListItemIcon, Popover, MenuList, Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import DocsIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { HighlightedSearchResultText } from '@backstage/plugin-search-react';
import OpenInNew from '@material-ui/icons/OpenInNew';
import StarBorder from '@material-ui/icons/StarBorder';
import { withStyles, makeStyles as makeStyles$1 } from '@material-ui/core/styles';
import Star from '@material-ui/icons/Star';
import { Alert } from '@material-ui/lab';
import { useLocation, useNavigate } from 'react-router';
import CancelIcon from '@material-ui/icons/Cancel';
import BugReportIcon from '@material-ui/icons/BugReport';
import MoreVert from '@material-ui/icons/MoreVert';
import { catalogEntityDeletePermission } from '@backstage/plugin-catalog-common';
import { assertError } from '@backstage/errors';
import { ENTITY_STATUS_CATALOG_PROCESSING_TYPE, CatalogClient } from '@backstage/catalog-client';

async function performMigrationToTheNewBucket({
  storageApi
}) {
  var _a;
  const source = storageApi.forBucket("settings");
  const target = storageApi.forBucket("starredEntities");
  const oldStarredEntities = source.snapshot("starredEntities").value;
  if (!isArray(oldStarredEntities)) {
    return;
  }
  const targetEntities = new Set((_a = target.snapshot("entityRefs").value) != null ? _a : []);
  oldStarredEntities.filter(isString).map((old) => old.split(":")).filter((split) => split.length === 4 && split[0] === "entity").map(([_, kind, namespace, name]) => stringifyEntityRef({ kind, namespace, name })).forEach((e) => targetEntities.add(e));
  await target.set("entityRefs", Array.from(targetEntities));
  await source.remove("starredEntities");
}

class DefaultStarredEntitiesApi {
  constructor(opts) {
    this.subscribers = /* @__PURE__ */ new Set();
    this.observable = new ObservableImpl((subscriber) => {
      subscriber.next(new Set(this.starredEntities));
      this.subscribers.add(subscriber);
      return () => {
        this.subscribers.delete(subscriber);
      };
    });
    var _a;
    performMigrationToTheNewBucket(opts).then();
    this.settingsStore = opts.storageApi.forBucket("starredEntities");
    this.starredEntities = new Set((_a = this.settingsStore.snapshot("entityRefs").value) != null ? _a : []);
    this.settingsStore.observe$("entityRefs").subscribe({
      next: (next) => {
        var _a2;
        this.starredEntities = new Set((_a2 = next.value) != null ? _a2 : []);
        this.notifyChanges();
      }
    });
  }
  async toggleStarred(entityRef) {
    if (this.starredEntities.has(entityRef)) {
      this.starredEntities.delete(entityRef);
    } else {
      this.starredEntities.add(entityRef);
    }
    await this.settingsStore.set("entityRefs", Array.from(this.starredEntities));
  }
  starredEntitie$() {
    return this.observable;
  }
  notifyChanges() {
    for (const subscription of this.subscribers) {
      subscription.next(new Set(this.starredEntities));
    }
  }
}

const createComponentRouteRef = createExternalRouteRef({
  id: "create-component",
  optional: true
});
const viewTechDocRouteRef = createExternalRouteRef({
  id: "view-techdoc",
  optional: true,
  params: ["namespace", "kind", "name"]
});
const rootRouteRef = createRouteRef({
  id: "catalog"
});

const useStyles$5 = makeStyles((theme) => ({
  value: {
    fontWeight: "bold",
    overflow: "hidden",
    lineHeight: "24px",
    wordBreak: "break-word"
  },
  label: {
    color: theme.palette.text.secondary,
    textTransform: "uppercase",
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: 0.5,
    overflow: "hidden",
    whiteSpace: "nowrap"
  }
}));
function AboutField(props) {
  const { label, value, gridSizes, children } = props;
  const classes = useStyles$5();
  const childElements = useElementFilter(children, (c) => c.getElements());
  const content = childElements.length > 0 ? childElements : /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2",
    className: classes.value
  }, value || `unknown`);
  return /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    ...gridSizes
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h2",
    className: classes.label
  }, label), content);
}

const useStyles$4 = makeStyles({
  description: {
    wordBreak: "break-word"
  }
});
function AboutContent(props) {
  var _a, _b, _c, _d, _e, _f;
  const { entity } = props;
  const classes = useStyles$4();
  const isSystem = entity.kind.toLocaleLowerCase("en-US") === "system";
  const isResource = entity.kind.toLocaleLowerCase("en-US") === "resource";
  const isComponent = entity.kind.toLocaleLowerCase("en-US") === "component";
  const isAPI = entity.kind.toLocaleLowerCase("en-US") === "api";
  const isTemplate = entity.kind.toLocaleLowerCase("en-US") === "template";
  const isLocation = entity.kind.toLocaleLowerCase("en-US") === "location";
  const isGroup = entity.kind.toLocaleLowerCase("en-US") === "group";
  const partOfSystemRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: "system"
  });
  const partOfComponentRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: "component"
  });
  const partOfDomainRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: "domain"
  });
  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true
  }, /* @__PURE__ */ React.createElement(AboutField, {
    label: "Description",
    gridSizes: { xs: 12 }
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2",
    paragraph: true,
    className: classes.description
  }, ((_a = entity == null ? void 0 : entity.metadata) == null ? void 0 : _a.description) || "No description")), /* @__PURE__ */ React.createElement(AboutField, {
    label: "Owner",
    value: "No Owner",
    gridSizes: { xs: 12, sm: 6, lg: 4 }
  }, ownedByRelations.length > 0 && /* @__PURE__ */ React.createElement(EntityRefLinks, {
    entityRefs: ownedByRelations,
    defaultKind: "group"
  })), (isSystem || partOfDomainRelations.length > 0) && /* @__PURE__ */ React.createElement(AboutField, {
    label: "Domain",
    value: "No Domain",
    gridSizes: { xs: 12, sm: 6, lg: 4 }
  }, partOfDomainRelations.length > 0 && /* @__PURE__ */ React.createElement(EntityRefLinks, {
    entityRefs: partOfDomainRelations,
    defaultKind: "domain"
  })), (isAPI || isComponent || isResource || partOfSystemRelations.length > 0) && /* @__PURE__ */ React.createElement(AboutField, {
    label: "System",
    value: "No System",
    gridSizes: { xs: 12, sm: 6, lg: 4 }
  }, partOfSystemRelations.length > 0 && /* @__PURE__ */ React.createElement(EntityRefLinks, {
    entityRefs: partOfSystemRelations,
    defaultKind: "system"
  })), isComponent && partOfComponentRelations.length > 0 && /* @__PURE__ */ React.createElement(AboutField, {
    label: "Parent Component",
    value: "No Parent Component",
    gridSizes: { xs: 12, sm: 6, lg: 4 }
  }, /* @__PURE__ */ React.createElement(EntityRefLinks, {
    entityRefs: partOfComponentRelations,
    defaultKind: "component"
  })), (isAPI || isComponent || isResource || isTemplate || isGroup || isLocation || typeof ((_b = entity == null ? void 0 : entity.spec) == null ? void 0 : _b.type) === "string") && /* @__PURE__ */ React.createElement(AboutField, {
    label: "Type",
    value: (_c = entity == null ? void 0 : entity.spec) == null ? void 0 : _c.type,
    gridSizes: { xs: 12, sm: 6, lg: 4 }
  }), (isAPI || isComponent || typeof ((_d = entity == null ? void 0 : entity.spec) == null ? void 0 : _d.lifecycle) === "string") && /* @__PURE__ */ React.createElement(AboutField, {
    label: "Lifecycle",
    value: (_e = entity == null ? void 0 : entity.spec) == null ? void 0 : _e.lifecycle,
    gridSizes: { xs: 12, sm: 6, lg: 4 }
  }), /* @__PURE__ */ React.createElement(AboutField, {
    label: "Tags",
    value: "No Tags",
    gridSizes: { xs: 12, sm: 6, lg: 4 }
  }, (((_f = entity == null ? void 0 : entity.metadata) == null ? void 0 : _f.tags) || []).map((t) => /* @__PURE__ */ React.createElement(Chip, {
    key: t,
    size: "small",
    label: t
  }))));
}

const useStyles$3 = makeStyles({
  gridItemCard: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100% - 10px)",
    marginBottom: "10px"
  },
  fullHeightCard: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  gridItemCardContent: {
    flex: 1
  },
  fullHeightCardContent: {
    flex: 1
  }
});
function AboutCard(props) {
  var _a, _b, _c;
  const { variant } = props;
  const classes = useStyles$3();
  const { entity } = useEntity();
  const scmIntegrationsApi = useApi(scmIntegrationsApiRef);
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);
  const viewTechdocLink = useRouteRef(viewTechDocRouteRef);
  const entitySourceLocation = getEntitySourceLocation(entity, scmIntegrationsApi);
  const entityMetadataEditUrl = (_a = entity.metadata.annotations) == null ? void 0 : _a[ANNOTATION_EDIT_URL];
  const viewInSource = {
    label: "View Source",
    disabled: !entitySourceLocation,
    icon: /* @__PURE__ */ React.createElement(ScmIntegrationIcon, {
      type: entitySourceLocation == null ? void 0 : entitySourceLocation.integrationType
    }),
    href: entitySourceLocation == null ? void 0 : entitySourceLocation.locationTargetUrl
  };
  const viewInTechDocs = {
    label: "View TechDocs",
    disabled: !((_b = entity.metadata.annotations) == null ? void 0 : _b["backstage.io/techdocs-ref"]) || !viewTechdocLink,
    icon: /* @__PURE__ */ React.createElement(DocsIcon, null),
    href: viewTechdocLink && viewTechdocLink({
      namespace: entity.metadata.namespace || DEFAULT_NAMESPACE,
      kind: entity.kind,
      name: entity.metadata.name
    })
  };
  let cardClass = "";
  if (variant === "gridItem") {
    cardClass = classes.gridItemCard;
  } else if (variant === "fullHeight") {
    cardClass = classes.fullHeightCard;
  }
  let cardContentClass = "";
  if (variant === "gridItem") {
    cardContentClass = classes.gridItemCardContent;
  } else if (variant === "fullHeight") {
    cardContentClass = classes.fullHeightCardContent;
  }
  const entityLocation = (_c = entity.metadata.annotations) == null ? void 0 : _c[ANNOTATION_LOCATION];
  const allowRefresh = (entityLocation == null ? void 0 : entityLocation.startsWith("url:")) || (entityLocation == null ? void 0 : entityLocation.startsWith("file:"));
  const refreshEntity = useCallback(async () => {
    await catalogApi.refreshEntity(stringifyEntityRef(entity));
    alertApi.post({ message: "Refresh scheduled", severity: "info" });
  }, [catalogApi, alertApi, entity]);
  return /* @__PURE__ */ React.createElement(Card, {
    className: cardClass
  }, /* @__PURE__ */ React.createElement(CardHeader, {
    title: "About",
    action: /* @__PURE__ */ React.createElement(React.Fragment, null, allowRefresh && /* @__PURE__ */ React.createElement(IconButton, {
      "aria-label": "Refresh",
      title: "Schedule entity refresh",
      onClick: refreshEntity
    }, /* @__PURE__ */ React.createElement(CachedIcon, null)), /* @__PURE__ */ React.createElement(IconButton, {
      component: Link,
      "aria-label": "Edit",
      disabled: !entityMetadataEditUrl,
      title: "Edit Metadata",
      to: entityMetadataEditUrl != null ? entityMetadataEditUrl : "#"
    }, /* @__PURE__ */ React.createElement(EditIcon, null))),
    subheader: /* @__PURE__ */ React.createElement(HeaderIconLinkRow, {
      links: [viewInSource, viewInTechDocs]
    })
  }), /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(CardContent, {
    className: cardContentClass
  }, /* @__PURE__ */ React.createElement(AboutContent, {
    entity
  })));
}

const useStyles$2 = makeStyles((theme) => createStyles({
  root: {
    ...theme.typography.h4
  }
}));
function CatalogKindHeader(props) {
  var _a;
  const { initialFilter = "component", allowedKinds } = props;
  const classes = useStyles$2();
  const catalogApi = useApi(catalogApiRef);
  const { value: allKinds } = useAsync(async () => {
    return await catalogApi.getEntityFacets({ facets: ["kind"] }).then((response) => {
      var _a2;
      return ((_a2 = response.facets.kind) == null ? void 0 : _a2.map((f) => f.value).sort()) || [];
    });
  });
  const {
    updateFilters,
    queryParameters: { kind: kindParameter }
  } = useEntityList();
  const queryParamKind = useMemo(() => {
    var _a2;
    return (_a2 = [kindParameter].flat()[0]) == null ? void 0 : _a2.toLocaleLowerCase("en-US");
  }, [kindParameter]);
  const [selectedKind, setSelectedKind] = useState(queryParamKind != null ? queryParamKind : initialFilter);
  useEffect(() => {
    updateFilters({
      kind: selectedKind ? new EntityKindFilter(selectedKind) : void 0
    });
  }, [selectedKind, updateFilters]);
  useEffect(() => {
    if (queryParamKind) {
      setSelectedKind(queryParamKind);
    }
  }, [queryParamKind]);
  const availableKinds = [capitalize(selectedKind)].concat((_a = allKinds == null ? void 0 : allKinds.filter((k) => allowedKinds ? allowedKinds.some((a) => a.toLocaleLowerCase("en-US") === k.toLocaleLowerCase("en-US")) : true)) != null ? _a : []);
  const options = availableKinds.sort().reduce((acc, kind) => {
    acc[kind.toLocaleLowerCase("en-US")] = kind;
    return acc;
  }, {});
  return /* @__PURE__ */ React.createElement(Select, {
    input: /* @__PURE__ */ React.createElement(InputBase, {
      value: selectedKind
    }),
    value: selectedKind,
    onChange: (e) => setSelectedKind(e.target.value),
    classes
  }, Object.keys(options).map((kind) => /* @__PURE__ */ React.createElement(MenuItem, {
    value: kind,
    key: kind
  }, `${options[kind]}s`)));
}

const useStyles$1 = makeStyles({
  flexContainer: {
    flexWrap: "wrap"
  },
  itemText: {
    width: "100%",
    wordBreak: "break-all",
    marginBottom: "1rem"
  }
});
function CatalogSearchResultListItem(props) {
  var _a, _b;
  const result = props.result;
  const classes = useStyles$1();
  return /* @__PURE__ */ React.createElement(Link, {
    to: result.location
  }, /* @__PURE__ */ React.createElement(ListItem, {
    alignItems: "flex-start",
    className: classes.flexContainer
  }, /* @__PURE__ */ React.createElement(ListItemText, {
    className: classes.itemText,
    primaryTypographyProps: { variant: "h6" },
    primary: ((_a = props.highlight) == null ? void 0 : _a.fields.title) ? /* @__PURE__ */ React.createElement(HighlightedSearchResultText, {
      text: props.highlight.fields.title,
      preTag: props.highlight.preTag,
      postTag: props.highlight.postTag
    }) : result.title,
    secondary: ((_b = props.highlight) == null ? void 0 : _b.fields.text) ? /* @__PURE__ */ React.createElement(HighlightedSearchResultText, {
      text: props.highlight.fields.text,
      preTag: props.highlight.preTag,
      postTag: props.highlight.postTag
    }) : result.text
  }), /* @__PURE__ */ React.createElement(Box, null, result.kind && /* @__PURE__ */ React.createElement(Chip, {
    label: `Kind: ${result.kind}`,
    size: "small"
  }), result.lifecycle && /* @__PURE__ */ React.createElement(Chip, {
    label: `Lifecycle: ${result.lifecycle}`,
    size: "small"
  }))), /* @__PURE__ */ React.createElement(Divider, {
    component: "li"
  }));
}

const columnFactories = Object.freeze({
  createNameColumn(options) {
    function formatContent(entity) {
      var _a;
      return ((_a = entity.metadata) == null ? void 0 : _a.title) || humanizeEntityRef(entity, {
        defaultKind: options == null ? void 0 : options.defaultKind
      });
    }
    return {
      title: "Name",
      field: "resolved.name",
      highlight: true,
      customSort({ entity: entity1 }, { entity: entity2 }) {
        return formatContent(entity1).localeCompare(formatContent(entity2));
      },
      render: ({ entity }) => {
        var _a;
        return /* @__PURE__ */ React.createElement(EntityRefLink, {
          entityRef: entity,
          defaultKind: (options == null ? void 0 : options.defaultKind) || "Component",
          title: (_a = entity.metadata) == null ? void 0 : _a.title
        });
      }
    };
  },
  createSystemColumn() {
    return {
      title: "System",
      field: "resolved.partOfSystemRelationTitle",
      render: ({ resolved }) => /* @__PURE__ */ React.createElement(EntityRefLinks, {
        entityRefs: resolved.partOfSystemRelations,
        defaultKind: "system"
      })
    };
  },
  createOwnerColumn() {
    return {
      title: "Owner",
      field: "resolved.ownedByRelationsTitle",
      render: ({ resolved }) => /* @__PURE__ */ React.createElement(EntityRefLinks, {
        entityRefs: resolved.ownedByRelations,
        defaultKind: "group"
      })
    };
  },
  createSpecTypeColumn() {
    return {
      title: "Type",
      field: "entity.spec.type",
      hidden: true
    };
  },
  createSpecLifecycleColumn() {
    return {
      title: "Lifecycle",
      field: "entity.spec.lifecycle"
    };
  },
  createMetadataDescriptionColumn() {
    return {
      title: "Description",
      field: "entity.metadata.description",
      render: ({ entity }) => /* @__PURE__ */ React.createElement(OverflowTooltip, {
        text: entity.metadata.description,
        placement: "bottom-start"
      }),
      width: "auto"
    };
  },
  createTagsColumn() {
    return {
      title: "Tags",
      field: "entity.metadata.tags",
      cellStyle: {
        padding: "0px 16px 0px 20px"
      },
      render: ({ entity }) => /* @__PURE__ */ React.createElement(React.Fragment, null, entity.metadata.tags && entity.metadata.tags.map((t) => /* @__PURE__ */ React.createElement(Chip, {
        key: t,
        label: t,
        size: "small",
        variant: "outlined",
        style: { marginBottom: "0px" }
      })))
    };
  }
});

const YellowStar = withStyles({
  root: {
    color: "#f3ba37"
  }
})(Star);
const CatalogTable = (props) => {
  var _a, _b, _c;
  const { columns, actions, tableOptions } = props;
  const { isStarredEntity, toggleStarredEntity } = useStarredEntities();
  const { loading, error, entities, filters } = useEntityList();
  const defaultColumns = useMemo(() => {
    var _a2;
    return [
      columnFactories.createNameColumn({ defaultKind: (_a2 = filters.kind) == null ? void 0 : _a2.value }),
      ...createEntitySpecificColumns(),
      columnFactories.createMetadataDescriptionColumn(),
      columnFactories.createTagsColumn()
    ];
    function createEntitySpecificColumns() {
      var _a3;
      switch ((_a3 = filters.kind) == null ? void 0 : _a3.value) {
        case "user":
          return [];
        case "domain":
        case "system":
          return [columnFactories.createOwnerColumn()];
        case "group":
        case "location":
        case "template":
          return [columnFactories.createSpecTypeColumn()];
        default:
          return [
            columnFactories.createSystemColumn(),
            columnFactories.createOwnerColumn(),
            columnFactories.createSpecTypeColumn(),
            columnFactories.createSpecLifecycleColumn()
          ];
      }
    }
  }, [(_a = filters.kind) == null ? void 0 : _a.value]);
  const showTypeColumn = filters.type === void 0;
  const titlePreamble = capitalize$1((_c = (_b = filters.user) == null ? void 0 : _b.value) != null ? _c : "all");
  if (error) {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(WarningPanel, {
      severity: "error",
      title: "Could not fetch catalog entities."
    }, /* @__PURE__ */ React.createElement(CodeSnippet, {
      language: "text",
      text: error.toString()
    })));
  }
  const defaultActions = [
    ({ entity }) => {
      var _a2;
      const url = (_a2 = entity.metadata.annotations) == null ? void 0 : _a2[ANNOTATION_VIEW_URL];
      const title = "View";
      return {
        icon: () => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Typography, {
          variant: "srOnly"
        }, title), /* @__PURE__ */ React.createElement(OpenInNew, {
          fontSize: "small"
        })),
        tooltip: title,
        disabled: !url,
        onClick: () => {
          if (!url)
            return;
          window.open(url, "_blank");
        }
      };
    },
    ({ entity }) => {
      var _a2;
      const url = (_a2 = entity.metadata.annotations) == null ? void 0 : _a2[ANNOTATION_EDIT_URL];
      const title = "Edit";
      return {
        icon: () => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Typography, {
          variant: "srOnly"
        }, title), /* @__PURE__ */ React.createElement(EditIcon, {
          fontSize: "small"
        })),
        tooltip: title,
        disabled: !url,
        onClick: () => {
          if (!url)
            return;
          window.open(url, "_blank");
        }
      };
    },
    ({ entity }) => {
      const isStarred = isStarredEntity(entity);
      const title = isStarred ? "Remove from favorites" : "Add to favorites";
      return {
        cellStyle: { paddingLeft: "1em" },
        icon: () => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Typography, {
          variant: "srOnly"
        }, title), isStarred ? /* @__PURE__ */ React.createElement(YellowStar, null) : /* @__PURE__ */ React.createElement(StarBorder, null)),
        tooltip: title,
        onClick: () => toggleStarredEntity(entity)
      };
    }
  ];
  const rows = entities.map((entity) => {
    const partOfSystemRelations = getEntityRelations(entity, RELATION_PART_OF, {
      kind: "system"
    });
    const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);
    return {
      entity,
      resolved: {
        name: humanizeEntityRef(entity, {
          defaultKind: "Component"
        }),
        ownedByRelationsTitle: ownedByRelations.map((r) => humanizeEntityRef(r, { defaultKind: "group" })).join(", "),
        ownedByRelations,
        partOfSystemRelationTitle: partOfSystemRelations.map((r) => humanizeEntityRef(r, {
          defaultKind: "system"
        })).join(", "),
        partOfSystemRelations
      }
    };
  });
  const typeColumn = (columns || defaultColumns).find((c) => c.title === "Type");
  if (typeColumn) {
    typeColumn.hidden = !showTypeColumn;
  }
  const showPagination = rows.length > 20;
  return /* @__PURE__ */ React.createElement(Table, {
    isLoading: loading,
    columns: columns || defaultColumns,
    options: {
      paging: showPagination,
      pageSize: 20,
      actionsColumnIndex: -1,
      loadingType: "linear",
      showEmptyDataSourceMessage: !loading,
      padding: "dense",
      pageSizeOptions: [20, 50, 100],
      ...tableOptions
    },
    title: `${titlePreamble} (${entities.length})`,
    data: rows,
    actions: actions || defaultActions
  });
};
CatalogTable.columns = columnFactories;

const useStyles = makeStyles$1({
  button: {
    color: "white"
  }
});
function EntityContextMenu(props) {
  var _a;
  const {
    UNSTABLE_extraContextMenuItems,
    UNSTABLE_contextMenuOptions,
    onUnregisterEntity,
    onInspectEntity
  } = props;
  const [anchorEl, setAnchorEl] = useState();
  const classes = useStyles();
  const unregisterPermission = useEntityPermission(catalogEntityDeletePermission);
  const onOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const onClose = () => {
    setAnchorEl(void 0);
  };
  const extraItems = UNSTABLE_extraContextMenuItems && [
    ...UNSTABLE_extraContextMenuItems.map((item) => /* @__PURE__ */ React.createElement(MenuItem, {
      key: item.title,
      onClick: () => {
        onClose();
        item.onClick();
      }
    }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(item.Icon, {
      fontSize: "small"
    })), /* @__PURE__ */ React.createElement(ListItemText, {
      primary: item.title
    }))),
    /* @__PURE__ */ React.createElement(Divider, {
      key: "the divider is here!"
    })
  ];
  const disableUnregister = (_a = !unregisterPermission.allowed || (UNSTABLE_contextMenuOptions == null ? void 0 : UNSTABLE_contextMenuOptions.disableUnregister)) != null ? _a : false;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IconButton, {
    "aria-label": "more",
    "aria-controls": "long-menu",
    "aria-haspopup": "true",
    "aria-expanded": !!anchorEl,
    role: "button",
    onClick: onOpen,
    "data-testid": "menu-button",
    className: classes.button,
    id: "long-menu"
  }, /* @__PURE__ */ React.createElement(MoreVert, null)), /* @__PURE__ */ React.createElement(Popover, {
    open: Boolean(anchorEl),
    onClose,
    anchorEl,
    anchorOrigin: { vertical: "bottom", horizontal: "right" },
    transformOrigin: { vertical: "top", horizontal: "right" },
    "aria-labelledby": "long-menu"
  }, /* @__PURE__ */ React.createElement(MenuList, null, extraItems, /* @__PURE__ */ React.createElement(MenuItem, {
    onClick: () => {
      onClose();
      onUnregisterEntity();
    },
    disabled: disableUnregister
  }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(CancelIcon, {
    fontSize: "small"
  })), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: "Unregister entity"
  })), /* @__PURE__ */ React.createElement(MenuItem, {
    onClick: () => {
      onClose();
      onInspectEntity();
    }
  }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(BugReportIcon, {
    fontSize: "small"
  })), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: "Inspect entity"
  })))));
}

const dataKey = "plugin.catalog.entityLayoutRoute";
const Route = () => null;
attachComponentData(Route, dataKey, true);
attachComponentData(Route, "core.gatherMountPoints", true);
function EntityLayoutTitle(props) {
  const { entity, title } = props;
  return /* @__PURE__ */ React.createElement(Box, {
    display: "inline-flex",
    alignItems: "center",
    height: "1em",
    maxWidth: "100%"
  }, /* @__PURE__ */ React.createElement(Box, {
    component: "span",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden"
  }, title), entity && /* @__PURE__ */ React.createElement(FavoriteEntity, {
    entity
  }));
}
function headerProps(paramKind, paramNamespace, paramName, entity) {
  var _a, _b, _c, _d, _e;
  const kind = (_a = paramKind != null ? paramKind : entity == null ? void 0 : entity.kind) != null ? _a : "";
  const namespace = (_b = paramNamespace != null ? paramNamespace : entity == null ? void 0 : entity.metadata.namespace) != null ? _b : "";
  const name = (_e = (_d = (_c = entity == null ? void 0 : entity.metadata.title) != null ? _c : paramName) != null ? _d : entity == null ? void 0 : entity.metadata.name) != null ? _e : "";
  return {
    headerTitle: `${name}${namespace && namespace !== DEFAULT_NAMESPACE ? ` in ${namespace}` : ""}`,
    headerType: (() => {
      let t = kind.toLocaleLowerCase("en-US");
      if (entity && entity.spec && "type" in entity.spec) {
        t += " \u2014 ";
        t += entity.spec.type.toLocaleLowerCase("en-US");
      }
      return t;
    })()
  };
}
function EntityLabels(props) {
  var _a;
  const { entity } = props;
  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, ownedByRelations.length > 0 && /* @__PURE__ */ React.createElement(HeaderLabel, {
    label: "Owner",
    value: /* @__PURE__ */ React.createElement(EntityRefLinks, {
      entityRefs: ownedByRelations,
      defaultKind: "Group",
      color: "inherit"
    })
  }), ((_a = entity.spec) == null ? void 0 : _a.lifecycle) && /* @__PURE__ */ React.createElement(HeaderLabel, {
    label: "Lifecycle",
    value: entity.spec.lifecycle
  }));
}
const EntityLayout = (props) => {
  var _a, _b, _c;
  const {
    UNSTABLE_extraContextMenuItems,
    UNSTABLE_contextMenuOptions,
    children,
    NotFoundComponent
  } = props;
  const { kind, namespace, name } = useRouteRefParams(entityRouteRef);
  const { entity, loading, error } = useAsyncEntity();
  const location = useLocation();
  const routes = useElementFilter(children, (elements) => elements.selectByComponentData({
    key: dataKey,
    withStrictError: "Child of EntityLayout must be an EntityLayout.Route"
  }).getElements().flatMap(({ props: elementProps }) => {
    if (!entity) {
      return [];
    } else if (elementProps.if && !elementProps.if(entity)) {
      return [];
    }
    return [
      {
        path: elementProps.path,
        title: elementProps.title,
        children: elementProps.children,
        tabProps: elementProps.tabProps
      }
    ];
  }), [entity]);
  const { headerTitle, headerType } = headerProps(kind, namespace, name, entity);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false);
  const navigate = useNavigate();
  const cleanUpAfterRemoval = async () => {
    setConfirmationDialogOpen(false);
    setInspectionDialogOpen(false);
    navigate("/");
  };
  useEffect(() => {
    setConfirmationDialogOpen(false);
    setInspectionDialogOpen(false);
  }, [location.pathname]);
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: (_c = (_b = (_a = entity == null ? void 0 : entity.spec) == null ? void 0 : _a.type) == null ? void 0 : _b.toString()) != null ? _c : "home"
  }, /* @__PURE__ */ React.createElement(Header, {
    title: /* @__PURE__ */ React.createElement(EntityLayoutTitle, {
      title: headerTitle,
      entity
    }),
    pageTitleOverride: headerTitle,
    type: headerType
  }, entity && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(EntityLabels, {
    entity
  }), /* @__PURE__ */ React.createElement(EntityContextMenu, {
    UNSTABLE_extraContextMenuItems,
    UNSTABLE_contextMenuOptions,
    onUnregisterEntity: () => setConfirmationDialogOpen(true),
    onInspectEntity: () => setInspectionDialogOpen(true)
  }))), loading && /* @__PURE__ */ React.createElement(Progress, null), entity && /* @__PURE__ */ React.createElement(RoutedTabs, {
    routes
  }), error && /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(Alert, {
    severity: "error"
  }, error.toString())), !loading && !error && !entity && /* @__PURE__ */ React.createElement(Content, null, NotFoundComponent ? NotFoundComponent : /* @__PURE__ */ React.createElement(WarningPanel, {
    title: "Entity not found"
  }, "There is no ", kind, " with the requested", " ", /* @__PURE__ */ React.createElement(Link, {
    to: "https://backstage.io/docs/features/software-catalog/references"
  }, "kind, namespace, and name"), ".")), /* @__PURE__ */ React.createElement(UnregisterEntityDialog, {
    open: confirmationDialogOpen,
    entity,
    onConfirm: cleanUpAfterRemoval,
    onClose: () => setConfirmationDialogOpen(false)
  }), /* @__PURE__ */ React.createElement(InspectEntityDialog, {
    open: inspectionDialogOpen,
    entity,
    onClose: () => setInspectionDialogOpen(false)
  }));
};
EntityLayout.Route = Route;

function DeleteEntityDialog(props) {
  const { open, onClose, onConfirm, entity } = props;
  const [busy, setBusy] = useState(false);
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);
  const onDelete = async () => {
    setBusy(true);
    try {
      const uid = entity.metadata.uid;
      await catalogApi.removeEntityByUid(uid);
      onConfirm();
    } catch (err) {
      assertError(err);
      alertApi.post({ message: err.message });
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ React.createElement(Dialog, {
    open,
    onClose
  }, /* @__PURE__ */ React.createElement(DialogTitle, {
    id: "responsive-dialog-title"
  }, "Are you sure you want to delete this entity?"), /* @__PURE__ */ React.createElement(DialogActions, null, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "secondary",
    disabled: busy,
    onClick: onDelete
  }, "Delete"), /* @__PURE__ */ React.createElement(Button, {
    onClick: onClose,
    color: "primary"
  }, "Cancel")));
}

function isOrphan(entity) {
  var _a, _b;
  return ((_b = (_a = entity == null ? void 0 : entity.metadata) == null ? void 0 : _a.annotations) == null ? void 0 : _b["backstage.io/orphan"]) === "true";
}
function EntityOrphanWarning() {
  const navigate = useNavigate();
  const catalogLink = useRouteRef(rootRouteRef);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const { entity } = useEntity();
  const cleanUpAfterRemoval = async () => {
    setConfirmationDialogOpen(false);
    navigate(catalogLink());
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Alert, {
    severity: "warning",
    onClick: () => setConfirmationDialogOpen(true)
  }, "This entity is not referenced by any location and is therefore not receiving updates. Click here to delete."), /* @__PURE__ */ React.createElement(DeleteEntityDialog, {
    open: confirmationDialogOpen,
    entity,
    onConfirm: cleanUpAfterRemoval,
    onClose: () => setConfirmationDialogOpen(false)
  }));
}

const errorFilter = (i) => i.error && i.level === "error" && i.type === ENTITY_STATUS_CATALOG_PROCESSING_TYPE;
async function getOwnAndAncestorsErrors(entityRef, catalogApi) {
  const ancestors = await catalogApi.getEntityAncestors({ entityRef });
  const items = ancestors.items.map((item) => {
    var _a, _b;
    const statuses = (_b = (_a = item.entity.status) == null ? void 0 : _a.items) != null ? _b : [];
    const errors = statuses.filter(errorFilter).map((e) => e.error).filter((e) => Boolean(e));
    return { errors, entity: item.entity };
  }).filter((item) => item.errors.length > 0);
  return { items };
}
async function hasCatalogProcessingErrors(entity, context) {
  const catalogApi = context.apis.get(catalogApiRef);
  if (!catalogApi) {
    throw new Error(`No implementation available for ${catalogApiRef}`);
  }
  const errors = await getOwnAndAncestorsErrors(stringifyEntityRef(entity), catalogApi);
  return errors.items.length > 0;
}
function EntityProcessingErrorsPanel() {
  const { entity } = useEntity();
  const entityRef = stringifyEntityRef(entity);
  const catalogApi = useApi(catalogApiRef);
  const { loading, error, value } = useAsync(async () => {
    return getOwnAndAncestorsErrors(entityRef, catalogApi);
  }, [entityRef, catalogApi]);
  if (error) {
    return /* @__PURE__ */ React.createElement(Box, {
      mb: 1
    }, /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error
    }));
  }
  if (loading || !value) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, value.items.map((ancestorError, index) => /* @__PURE__ */ React.createElement(Box, {
    key: index,
    mb: 1
  }, stringifyEntityRef(entity) !== stringifyEntityRef(ancestorError.entity) && /* @__PURE__ */ React.createElement(Box, {
    p: 1
  }, "The error below originates from", " ", /* @__PURE__ */ React.createElement(EntityRefLink, {
    entityRef: ancestorError.entity
  })), ancestorError.errors.map((e, i) => /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
    key: i,
    error: e
  })))));
}

const ENTITY_SWITCH_KEY = "core.backstage.entitySwitch";
const EntitySwitchCaseComponent = (_props) => null;
attachComponentData(EntitySwitchCaseComponent, ENTITY_SWITCH_KEY, true);
const EntitySwitch = (props) => {
  var _a, _b;
  const { entity, loading } = useAsyncEntity();
  const apis = useApiHolder();
  const results = useElementFilter(props.children, (collection) => collection.selectByComponentData({
    key: ENTITY_SWITCH_KEY,
    withStrictError: "Child of EntitySwitch is not an EntitySwitch.Case"
  }).getElements().flatMap((element) => {
    var _a2;
    if (loading) {
      return [];
    }
    const { if: condition, children: elementsChildren } = element.props;
    if (!entity) {
      return [
        {
          if: condition === void 0,
          children: elementsChildren
        }
      ];
    }
    return [
      {
        if: (_a2 = condition == null ? void 0 : condition(entity, { apis })) != null ? _a2 : true,
        children: elementsChildren
      }
    ];
  }), [apis, entity, loading]);
  const hasAsyncCases = results.some((r) => typeof r.if === "object" && "then" in r.if);
  if (hasAsyncCases) {
    return /* @__PURE__ */ React.createElement(AsyncEntitySwitch, {
      results
    });
  }
  return (_b = (_a = results.find((r) => r.if)) == null ? void 0 : _a.children) != null ? _b : null;
};
function AsyncEntitySwitch({ results }) {
  const { loading, value } = useAsync(async () => {
    var _a;
    const promises = results.map(async ({ if: condition, children: output }) => {
      try {
        if (await condition) {
          return output;
        }
      } catch {
      }
      return null;
    });
    return (_a = (await Promise.all(promises)).find(Boolean)) != null ? _a : null;
  }, [results]);
  if (loading || !value) {
    return null;
  }
  return value;
}
EntitySwitch.Case = EntitySwitchCaseComponent;

function strCmp(a, b) {
  return Boolean(a && (a == null ? void 0 : a.toLocaleLowerCase("en-US")) === (b == null ? void 0 : b.toLocaleLowerCase("en-US")));
}
function strCmpAll(value, cmpValues) {
  return typeof cmpValues === "string" ? strCmp(value, cmpValues) : cmpValues.some((cmpVal) => strCmp(value, cmpVal));
}
function isKind(kinds) {
  return (entity) => strCmpAll(entity.kind, kinds);
}
function isComponentType(types) {
  return (entity) => {
    if (!strCmp(entity.kind, "component")) {
      return false;
    }
    const componentEntity = entity;
    return strCmpAll(componentEntity.spec.type, types);
  };
}
function isNamespace(namespaces) {
  return (entity) => {
    var _a;
    return strCmpAll((_a = entity.metadata) == null ? void 0 : _a.namespace, namespaces);
  };
}

const FilteredEntityLayout = CatalogFilterLayout;
const FilterContainer = CatalogFilterLayout.Filters;
const EntityListContainer = CatalogFilterLayout.Content;

const catalogPlugin = createPlugin({
  id: "catalog",
  apis: [
    createApiFactory({
      api: catalogApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef
      },
      factory: ({ discoveryApi, fetchApi }) => new CatalogClient({ discoveryApi, fetchApi })
    }),
    createApiFactory({
      api: starredEntitiesApiRef,
      deps: { storageApi: storageApiRef },
      factory: ({ storageApi }) => new DefaultStarredEntitiesApi({ storageApi })
    })
  ],
  routes: {
    catalogIndex: rootRouteRef,
    catalogEntity: entityRouteRef
  },
  externalRoutes: {
    createComponent: createComponentRouteRef,
    viewTechDoc: viewTechDocRouteRef
  }
});
const CatalogIndexPage = catalogPlugin.provide(createRoutableExtension({
  name: "CatalogIndexPage",
  component: () => import('./index-e2b41993.esm.js').then((m) => m.CatalogPage),
  mountPoint: rootRouteRef
}));
const CatalogEntityPage = catalogPlugin.provide(createRoutableExtension({
  name: "CatalogEntityPage",
  component: () => import('./index-4e6adb42.esm.js').then((m) => m.CatalogEntityPage),
  mountPoint: entityRouteRef
}));
const EntityAboutCard = catalogPlugin.provide(createComponentExtension({
  name: "EntityAboutCard",
  component: {
    lazy: () => import('./index-a021f72d.esm.js').then((m) => m.AboutCard)
  }
}));
const EntityLinksCard = catalogPlugin.provide(createComponentExtension({
  name: "EntityLinksCard",
  component: {
    lazy: () => import('./index-896aeac9.esm.js').then((m) => m.EntityLinksCard)
  }
}));
const EntityHasSystemsCard = catalogPlugin.provide(createComponentExtension({
  name: "EntityHasSystemsCard",
  component: {
    lazy: () => import('./index-3763491b.esm.js').then((m) => m.HasSystemsCard)
  }
}));
const EntityHasComponentsCard = catalogPlugin.provide(createComponentExtension({
  name: "EntityHasComponentsCard",
  component: {
    lazy: () => import('./index-acb3cf04.esm.js').then((m) => m.HasComponentsCard)
  }
}));
const EntityHasSubcomponentsCard = catalogPlugin.provide(createComponentExtension({
  name: "EntityHasSubcomponentsCard",
  component: {
    lazy: () => import('./index-41ab53b6.esm.js').then((m) => m.HasSubcomponentsCard)
  }
}));
const EntityHasResourcesCard = catalogPlugin.provide(createComponentExtension({
  name: "EntityHasResourcesCard",
  component: {
    lazy: () => import('./index-b3ad464b.esm.js').then((m) => m.HasResourcesCard)
  }
}));
const EntityDependsOnComponentsCard = catalogPlugin.provide(createComponentExtension({
  name: "EntityDependsOnComponentsCard",
  component: {
    lazy: () => import('./index-66fdb6ad.esm.js').then((m) => m.DependsOnComponentsCard)
  }
}));
const EntityDependencyOfComponentsCard = catalogPlugin.provide(createComponentExtension({
  name: "EntityDependencyOfComponentsCard",
  component: {
    lazy: () => import('./index-390fab14.esm.js').then((m) => m.DependencyOfComponentsCard)
  }
}));
const EntityDependsOnResourcesCard = catalogPlugin.provide(createComponentExtension({
  name: "EntityDependsOnResourcesCard",
  component: {
    lazy: () => import('./index-d41abbff.esm.js').then((m) => m.DependsOnResourcesCard)
  }
}));
const RelatedEntitiesCard = catalogPlugin.provide(createComponentExtension({
  name: "RelatedEntitiesCard",
  component: {
    lazy: () => import('./index-c2914273.esm.js').then((m) => m.RelatedEntitiesCard)
  }
}));

export { AboutCard as A, EntityListContainer as B, CatalogKindHeader as C, DefaultStarredEntitiesApi as D, EntityAboutCard as E, FilteredEntityLayout as F, RelatedEntitiesCard as R, CatalogTable as a, AboutContent as b, createComponentRouteRef as c, AboutField as d, CatalogEntityPage as e, CatalogIndexPage as f, catalogPlugin as g, EntityDependencyOfComponentsCard as h, EntityDependsOnComponentsCard as i, EntityDependsOnResourcesCard as j, EntityHasComponentsCard as k, EntityHasResourcesCard as l, EntityHasSubcomponentsCard as m, EntityHasSystemsCard as n, EntityLinksCard as o, CatalogSearchResultListItem as p, EntityLayout as q, EntityOrphanWarning as r, isOrphan as s, EntityProcessingErrorsPanel as t, hasCatalogProcessingErrors as u, EntitySwitch as v, isKind as w, isNamespace as x, isComponentType as y, FilterContainer as z };
//# sourceMappingURL=index-7bccb118.esm.js.map
