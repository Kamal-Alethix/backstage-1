export { CATALOG_FILTER_EXISTS } from '@backstage/catalog-client';
import { createApiRef, useApi, createRouteRef, useRouteRef, identityApiRef, alertApiRef, useApp, configApiRef } from '@backstage/core-plugin-api';
import ObservableImpl from 'zen-observable';
import React, { useState, createContext, useMemo, useCallback, useContext, forwardRef, useEffect, useRef, useLayoutEffect, Fragment } from 'react';
import { Grid, useMediaQuery, useTheme, Button, Drawer, Box, Typography, Tooltip, makeStyles, FormControlLabel, Checkbox, TextField, Toolbar, FormControl, Input, InputAdornment, IconButton, withStyles, DialogContentText, ListItemText as ListItemText$1, ListSubheader as ListSubheader$1, Card, CardContent, ListItem, ListItemIcon, List, Dialog, DialogTitle, DialogContent, Tabs, Tab, DialogActions, Divider, MenuItem, ListItemSecondaryAction } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Alert, Autocomplete } from '@material-ui/lab';
import { createVersionedContext, createVersionedValueMap, useVersionedContext, getOrCreateGlobalSingleton } from '@backstage/version-bridge';
import { compact, isEqual, groupBy, chunk } from 'lodash';
import qs from 'qs';
import { useLocation, useNavigate } from 'react-router';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useDebounce from 'react-use/lib/useDebounce';
import useMountedState from 'react-use/lib/useMountedState';
import { parseEntityRef, ANNOTATION_SOURCE_LOCATION, parseLocationRef, RELATION_MEMBER_OF, getCompoundEntityRef, stringifyEntityRef, RELATION_OWNED_BY, DEFAULT_NAMESPACE, RELATION_PART_OF, ANNOTATION_LOCATION, ANNOTATION_ORIGIN_LOCATION } from '@backstage/catalog-model';
import useAsync from 'react-use/lib/useAsync';
import isEqual$1 from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import { Link, OverflowTooltip, Table, Select, Progress, ResponseErrorPanel, DependencyGraph, DependencyGraphTypes, CodeSnippet } from '@backstage/core-components';
import useObservable from 'react-use/lib/useObservable';
import { usePermission } from '@backstage/plugin-permission-react';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Clear from '@material-ui/icons/Clear';
import Search from '@material-ui/icons/Search';
import capitalize from 'lodash/capitalize';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import classNames from 'classnames';
import WorkIcon from '@material-ui/icons/Work';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import groupBy$1 from 'lodash/groupBy';
import DialogContentText$1 from '@material-ui/core/DialogContentText';
import YAML from 'yaml';
import Alert$1 from '@material-ui/lab/Alert';
import { assertError } from '@backstage/errors';
import SettingsIcon from '@material-ui/icons/Settings';

const catalogApiRef = createApiRef({
  id: "plugin.catalog.service"
});

const starredEntitiesApiRef = createApiRef({
  id: "catalog-react.starred-entities"
});

class MockStarredEntitiesApi {
  constructor() {
    this.starredEntities = /* @__PURE__ */ new Set();
    this.subscribers = /* @__PURE__ */ new Set();
    this.observable = new ObservableImpl((subscriber) => {
      subscriber.next(new Set(this.starredEntities));
      this.subscribers.add(subscriber);
      return () => {
        this.subscribers.delete(subscriber);
      };
    });
  }
  async toggleStarred(entityRef) {
    if (!this.starredEntities.delete(entityRef)) {
      this.starredEntities.add(entityRef);
    }
    for (const subscription of this.subscribers) {
      subscription.next(new Set(this.starredEntities));
    }
  }
  starredEntitie$() {
    return this.observable;
  }
}

const Filters = (props) => {
  const isMidSizeScreen = useMediaQuery((theme2) => theme2.breakpoints.down("md"));
  const theme = useTheme();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  return isMidSizeScreen ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
    style: { marginTop: theme.spacing(1), marginLeft: theme.spacing(1) },
    onClick: () => setFilterDrawerOpen(true),
    startIcon: /* @__PURE__ */ React.createElement(FilterListIcon, null)
  }, "Filters"), /* @__PURE__ */ React.createElement(Drawer, {
    open: filterDrawerOpen,
    onClose: () => setFilterDrawerOpen(false),
    anchor: "left",
    disableAutoFocus: true,
    keepMounted: true,
    variant: "temporary"
  }, /* @__PURE__ */ React.createElement(Box, {
    m: 2
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6",
    component: "h2",
    style: { marginBottom: theme.spacing(1) }
  }, "Filters"), props.children))) : /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    lg: 2
  }, props.children);
};
const Content = (props) => {
  return /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    lg: 10
  }, props.children);
};
const CatalogFilterLayout = (props) => {
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    style: { position: "relative" }
  }, props.children);
};
CatalogFilterLayout.Filters = Filters;
CatalogFilterLayout.Content = Content;

const NewEntityContext = createVersionedContext("entity-context");
const AsyncEntityProvider = ({
  children,
  entity,
  loading,
  error,
  refresh
}) => {
  const value = { entity, loading, error, refresh };
  return /* @__PURE__ */ React.createElement(NewEntityContext.Provider, {
    value: createVersionedValueMap({ 1: value })
  }, children);
};
const EntityProvider = (props) => /* @__PURE__ */ React.createElement(AsyncEntityProvider, {
  entity: props.entity,
  loading: !Boolean(props.entity),
  error: void 0,
  refresh: void 0,
  children: props.children
});
function useEntity() {
  const versionedHolder = useVersionedContext("entity-context");
  if (!versionedHolder) {
    throw new Error("Entity context is not available");
  }
  const value = versionedHolder.atVersion(1);
  if (!value) {
    throw new Error("EntityContext v1 not available");
  }
  if (!value.entity) {
    throw new Error("useEntity hook is being called outside of an EntityLayout where the entity has not been loaded. If this is intentional, please use useAsyncEntity instead.");
  }
  return { entity: value.entity };
}
function useAsyncEntity() {
  const versionedHolder = useVersionedContext("entity-context");
  if (!versionedHolder) {
    throw new Error("Entity context is not available");
  }
  const value = versionedHolder.atVersion(1);
  if (!value) {
    throw new Error("EntityContext v1 not available");
  }
  const { entity, loading, error, refresh } = value;
  return { entity, loading, error, refresh };
}

function reduceCatalogFilters(filters) {
  return filters.reduce((compoundFilter, filter) => {
    return {
      ...compoundFilter,
      ...filter.getCatalogFilters ? filter.getCatalogFilters() : {}
    };
  }, {});
}
function reduceEntityFilters(filters) {
  return (entity) => filters.every((filter) => !filter.filterEntity || filter.filterEntity(entity));
}

function getEntityRelations(entity, relationType, filter) {
  var _a;
  let entityNames = ((_a = entity == null ? void 0 : entity.relations) == null ? void 0 : _a.filter((r) => r.type === relationType).map((r) => parseEntityRef(r.targetRef))) || [];
  if (filter == null ? void 0 : filter.kind) {
    entityNames = entityNames.filter((e) => e.kind.toLocaleLowerCase("en-US") === filter.kind.toLocaleLowerCase("en-US"));
  }
  return entityNames;
}

function getEntitySourceLocation(entity, scmIntegrationsApi) {
  var _a;
  const sourceLocation = (_a = entity.metadata.annotations) == null ? void 0 : _a[ANNOTATION_SOURCE_LOCATION];
  if (!sourceLocation) {
    return void 0;
  }
  try {
    const sourceLocationRef = parseLocationRef(sourceLocation);
    const integration = scmIntegrationsApi.byUrl(sourceLocationRef.target);
    return {
      locationTargetUrl: sourceLocationRef.target,
      integrationType: integration == null ? void 0 : integration.type
    };
  } catch {
    return void 0;
  }
}

function isOwnerOf(owner, entity) {
  const possibleOwners = new Set([
    ...getEntityRelations(owner, RELATION_MEMBER_OF, { kind: "group" }),
    ...owner ? [getCompoundEntityRef(owner)] : []
  ].map(stringifyEntityRef));
  const owners = getEntityRelations(entity, RELATION_OWNED_BY).map(stringifyEntityRef);
  for (const ownerItem of owners) {
    if (possibleOwners.has(ownerItem)) {
      return true;
    }
  }
  return false;
}

const EntityListContext = createContext(void 0);
const EntityListProvider = ({
  children
}) => {
  const isMounted = useMountedState();
  const catalogApi = useApi(catalogApiRef);
  const [requestedFilters, setRequestedFilters] = useState({});
  const location = useLocation();
  const queryParameters = useMemo(() => {
    var _a;
    return (_a = qs.parse(location.search, {
      ignoreQueryPrefix: true
    }).filters) != null ? _a : {};
  }, [location]);
  const [outputState, setOutputState] = useState(() => {
    return {
      appliedFilters: {},
      entities: [],
      backendEntities: []
    };
  });
  const [{ loading, error }, refresh] = useAsyncFn(async () => {
    var _a;
    const compacted = compact(Object.values(requestedFilters));
    const entityFilter = reduceEntityFilters(compacted);
    const backendFilter = reduceCatalogFilters(compacted);
    const previousBackendFilter = reduceCatalogFilters(compact(Object.values(outputState.appliedFilters)));
    const queryParams = Object.keys(requestedFilters).reduce((params, key) => {
      const filter = requestedFilters[key];
      if (filter == null ? void 0 : filter.toQueryValue) {
        params[key] = filter.toQueryValue();
      }
      return params;
    }, {});
    if (!isEqual(previousBackendFilter, backendFilter)) {
      const response = await catalogApi.getEntities({
        filter: backendFilter
      });
      setOutputState({
        appliedFilters: requestedFilters,
        backendEntities: response.items,
        entities: response.items.filter(entityFilter)
      });
    } else {
      setOutputState({
        appliedFilters: requestedFilters,
        backendEntities: outputState.backendEntities,
        entities: outputState.backendEntities.filter(entityFilter)
      });
    }
    if (isMounted()) {
      const oldParams = qs.parse(location.search, {
        ignoreQueryPrefix: true
      });
      const newParams = qs.stringify({ ...oldParams, filters: queryParams }, { addQueryPrefix: true, arrayFormat: "repeat" });
      const newUrl = `${window.location.pathname}${newParams}`;
      (_a = window.history) == null ? void 0 : _a.replaceState(null, document.title, newUrl);
    }
  }, [catalogApi, queryParameters, requestedFilters, outputState], { loading: true });
  useDebounce(refresh, 10, [requestedFilters]);
  const updateFilters = useCallback((update) => {
    setRequestedFilters((prevFilters) => {
      const newFilters = typeof update === "function" ? update(prevFilters) : update;
      return { ...prevFilters, ...newFilters };
    });
  }, []);
  const value = useMemo(() => ({
    filters: outputState.appliedFilters,
    entities: outputState.entities,
    backendEntities: outputState.backendEntities,
    updateFilters,
    queryParameters,
    loading,
    error
  }), [outputState, updateFilters, queryParameters, loading, error]);
  return /* @__PURE__ */ React.createElement(EntityListContext.Provider, {
    value
  }, children);
};
function useEntityList() {
  const context = useContext(EntityListContext);
  if (!context)
    throw new Error("useEntityList must be used within EntityListProvider");
  return context;
}

const entityRouteRef = getOrCreateGlobalSingleton("catalog:entity-route-ref", () => createRouteRef({
  id: "catalog:entity",
  params: ["namespace", "kind", "name"]
}));
function entityRouteParams(entity) {
  var _a, _b;
  return {
    kind: entity.kind.toLocaleLowerCase("en-US"),
    namespace: (_b = (_a = entity.metadata.namespace) == null ? void 0 : _a.toLocaleLowerCase("en-US")) != null ? _b : DEFAULT_NAMESPACE,
    name: entity.metadata.name
  };
}

function humanizeEntityRef(entityRef, opts) {
  const defaultKind = opts == null ? void 0 : opts.defaultKind;
  let kind;
  let namespace;
  let name;
  if ("metadata" in entityRef) {
    kind = entityRef.kind;
    namespace = entityRef.metadata.namespace;
    name = entityRef.metadata.name;
  } else {
    kind = entityRef.kind;
    namespace = entityRef.namespace;
    name = entityRef.name;
  }
  if (namespace === DEFAULT_NAMESPACE) {
    namespace = void 0;
  }
  kind = kind.toLocaleLowerCase("en-US");
  kind = defaultKind && defaultKind.toLocaleLowerCase("en-US") === kind ? void 0 : kind;
  return `${kind ? `${kind}:` : ""}${namespace ? `${namespace}/` : ""}${name}`;
}

const EntityRefLink = forwardRef((props, ref) => {
  var _a;
  const { entityRef, defaultKind, title, children, ...linkProps } = props;
  const entityRoute = useRouteRef(entityRouteRef);
  let kind;
  let namespace;
  let name;
  if (typeof entityRef === "string") {
    const parsed = parseEntityRef(entityRef);
    kind = parsed.kind;
    namespace = parsed.namespace;
    name = parsed.name;
  } else if ("metadata" in entityRef) {
    kind = entityRef.kind;
    namespace = entityRef.metadata.namespace;
    name = entityRef.metadata.name;
  } else {
    kind = entityRef.kind;
    namespace = entityRef.namespace;
    name = entityRef.name;
  }
  kind = kind.toLocaleLowerCase("en-US");
  namespace = (_a = namespace == null ? void 0 : namespace.toLocaleLowerCase("en-US")) != null ? _a : DEFAULT_NAMESPACE;
  const routeParams = { kind, namespace, name };
  const formattedEntityRefTitle = humanizeEntityRef({ kind, namespace, name }, { defaultKind });
  const link = /* @__PURE__ */ React.createElement(Link, {
    ...linkProps,
    ref,
    to: entityRoute(routeParams)
  }, children, !children && (title != null ? title : formattedEntityRefTitle));
  return title ? /* @__PURE__ */ React.createElement(Tooltip, {
    title: formattedEntityRefTitle
  }, link) : link;
});

function EntityRefLinks(props) {
  const { entityRefs, defaultKind, ...linkProps } = props;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, entityRefs.map((r, i) => /* @__PURE__ */ React.createElement(React.Fragment, {
    key: i
  }, i > 0 && ", ", /* @__PURE__ */ React.createElement(EntityRefLink, {
    ...linkProps,
    entityRef: r,
    defaultKind
  }))));
}

class EntityKindFilter {
  constructor(value) {
    this.value = value;
  }
  getCatalogFilters() {
    return { kind: this.value };
  }
  toQueryValue() {
    return this.value;
  }
}
class EntityTypeFilter {
  constructor(value) {
    this.value = value;
  }
  getTypes() {
    return Array.isArray(this.value) ? this.value : [this.value];
  }
  getCatalogFilters() {
    return { "spec.type": this.getTypes() };
  }
  toQueryValue() {
    return this.getTypes();
  }
}
class EntityTagFilter {
  constructor(values) {
    this.values = values;
  }
  filterEntity(entity) {
    return this.values.every((v) => {
      var _a;
      return ((_a = entity.metadata.tags) != null ? _a : []).includes(v);
    });
  }
  toQueryValue() {
    return this.values;
  }
}
class EntityTextFilter {
  constructor(value) {
    this.value = value;
  }
  filterEntity(entity) {
    var _a;
    const upperCaseValue = this.value.toLocaleUpperCase("en-US");
    return entity.metadata.name.toLocaleUpperCase("en-US").includes(upperCaseValue) || `${entity.metadata.title}`.toLocaleUpperCase("en-US").includes(upperCaseValue) || ((_a = entity.metadata.tags) == null ? void 0 : _a.join("").toLocaleUpperCase("en-US").indexOf(upperCaseValue)) !== -1;
  }
}
class EntityOwnerFilter {
  constructor(values) {
    this.values = values;
  }
  filterEntity(entity) {
    return this.values.some((v) => getEntityRelations(entity, RELATION_OWNED_BY).some((o) => humanizeEntityRef(o, { defaultKind: "group" }) === v));
  }
  toQueryValue() {
    return this.values;
  }
}
class EntityLifecycleFilter {
  constructor(values) {
    this.values = values;
  }
  filterEntity(entity) {
    return this.values.some((v) => {
      var _a;
      return ((_a = entity.spec) == null ? void 0 : _a.lifecycle) === v;
    });
  }
  toQueryValue() {
    return this.values;
  }
}
class UserListFilter {
  constructor(value, isOwnedEntity, isStarredEntity) {
    this.value = value;
    this.isOwnedEntity = isOwnedEntity;
    this.isStarredEntity = isStarredEntity;
  }
  filterEntity(entity) {
    switch (this.value) {
      case "owned":
        return this.isOwnedEntity(entity);
      case "starred":
        return this.isStarredEntity(entity);
      default:
        return true;
    }
  }
  toQueryValue() {
    return this.value;
  }
}

function useEntityTypeFilter() {
  var _a;
  const catalogApi = useApi(catalogApiRef);
  const {
    filters: { kind: kindFilter, type: typeFilter },
    queryParameters: { type: typeParameter },
    updateFilters
  } = useEntityList();
  const flattenedQueryTypes = useMemo(() => [typeParameter].flat().filter(Boolean), [typeParameter]);
  const [selectedTypes, setSelectedTypes] = useState(flattenedQueryTypes.length ? flattenedQueryTypes : (_a = typeFilter == null ? void 0 : typeFilter.getTypes()) != null ? _a : []);
  useEffect(() => {
    if (flattenedQueryTypes.length) {
      setSelectedTypes(flattenedQueryTypes);
    }
  }, [flattenedQueryTypes]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const kind = useMemo(() => kindFilter == null ? void 0 : kindFilter.value, [kindFilter]);
  const {
    error,
    loading,
    value: facets
  } = useAsync(async () => {
    if (kind) {
      const items = await catalogApi.getEntityFacets({
        filter: { kind },
        facets: ["spec.type"]
      }).then((response) => response.facets["spec.type"] || []);
      return items;
    }
    return [];
  }, [kind, catalogApi]);
  const facetsRef = useRef(facets);
  useEffect(() => {
    const oldFacets = facetsRef.current;
    facetsRef.current = facets;
    if (loading || !kind || oldFacets === facets || !facets) {
      return;
    }
    const newTypes = [
      ...new Set(sortBy(facets, (f) => -f.count).map((f) => f.value.toLocaleLowerCase("en-US")))
    ];
    setAvailableTypes(newTypes);
    const stillValidTypes = selectedTypes.filter((value) => newTypes.includes(value));
    if (!isEqual$1(selectedTypes, stillValidTypes)) {
      setSelectedTypes(stillValidTypes);
    }
  }, [loading, kind, selectedTypes, setSelectedTypes, facets]);
  useEffect(() => {
    updateFilters({
      type: selectedTypes.length ? new EntityTypeFilter(selectedTypes) : void 0
    });
  }, [selectedTypes, updateFilters]);
  return {
    loading,
    error,
    availableTypes,
    selectedTypes,
    setSelectedTypes
  };
}

const BATCH_SIZE = 20;
function useRelatedEntities(entity, relationFilter) {
  var _a, _b;
  const filterByTypeLower = (_a = relationFilter == null ? void 0 : relationFilter.type) == null ? void 0 : _a.toLocaleLowerCase("en-US");
  const filterByKindLower = (_b = relationFilter == null ? void 0 : relationFilter.kind) == null ? void 0 : _b.toLocaleLowerCase("en-US");
  const catalogApi = useApi(catalogApiRef);
  const {
    loading,
    value: entities,
    error
  } = useAsync(async () => {
    var _a2;
    const relations = (_a2 = entity.relations) == null ? void 0 : _a2.map((r) => ({ type: r.type, target: parseEntityRef(r.targetRef) })).filter((r) => (!filterByTypeLower || r.type.toLocaleLowerCase("en-US") === filterByTypeLower) && (!filterByKindLower || r.target.kind === filterByKindLower));
    if (!relations) {
      return [];
    }
    const relationsByKindAndNamespace = Object.values(groupBy(relations, ({ target }) => {
      return `${target.kind}:${target.namespace}`.toLocaleLowerCase("en-US");
    }));
    const batchedRelationsByKindAndNamespace = [];
    for (const rs of relationsByKindAndNamespace) {
      batchedRelationsByKindAndNamespace.push({
        kind: rs[0].target.kind,
        namespace: rs[0].target.namespace,
        nameBatches: chunk(rs.map((r) => r.target.name), BATCH_SIZE)
      });
    }
    const results = await Promise.all(batchedRelationsByKindAndNamespace.flatMap((rs) => {
      return rs.nameBatches.map((names) => {
        return catalogApi.getEntities({
          filter: {
            kind: rs.kind,
            "metadata.namespace": rs.namespace,
            "metadata.name": names
          }
        });
      });
    }));
    return results.flatMap((r) => r.items);
  }, [entity, filterByTypeLower, filterByKindLower]);
  return {
    entities,
    loading,
    error
  };
}

function getEntityRef$1(entityOrRef) {
  return typeof entityOrRef === "string" ? entityOrRef : stringifyEntityRef(entityOrRef);
}
function useStarredEntities() {
  const starredEntitiesApi = useApi(starredEntitiesApiRef);
  const starredEntities = useObservable(starredEntitiesApi.starredEntitie$(), /* @__PURE__ */ new Set());
  const isStarredEntity = useCallback((entityOrRef) => starredEntities.has(getEntityRef$1(entityOrRef)), [starredEntities]);
  const toggleStarredEntity = useCallback((entityOrRef) => starredEntitiesApi.toggleStarred(getEntityRef$1(entityOrRef)).then(), [starredEntitiesApi]);
  return {
    starredEntities,
    toggleStarredEntity,
    isStarredEntity
  };
}

function getEntityRef(entityOrRef) {
  return typeof entityOrRef === "string" ? entityOrRef : stringifyEntityRef(entityOrRef);
}
function useStarredEntity(entityOrRef) {
  const starredEntitiesApi = useApi(starredEntitiesApiRef);
  const [isStarredEntity, setIsStarredEntity] = useState(false);
  useEffect(() => {
    const subscription = starredEntitiesApi.starredEntitie$().subscribe({
      next(starredEntities) {
        setIsStarredEntity(starredEntities.has(getEntityRef(entityOrRef)));
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [entityOrRef, starredEntitiesApi]);
  const toggleStarredEntity = useCallback(() => starredEntitiesApi.toggleStarred(getEntityRef(entityOrRef)).then(), [entityOrRef, starredEntitiesApi]);
  return {
    toggleStarredEntity,
    isStarredEntity
  };
}

function useEntityOwnership() {
  const identityApi = useApi(identityApiRef);
  const { loading, value: refs } = useAsync(async () => {
    const { ownershipEntityRefs } = await identityApi.getBackstageIdentity();
    return ownershipEntityRefs;
  }, []);
  const isOwnedEntity = useMemo(() => {
    const myOwnerRefs = new Set(refs != null ? refs : []);
    return (entity) => {
      const entityOwnerRefs = getEntityRelations(entity, RELATION_OWNED_BY).map(stringifyEntityRef);
      for (const ref of entityOwnerRefs) {
        if (myOwnerRefs.has(ref)) {
          return true;
        }
      }
      return false;
    };
  }, [refs]);
  return useMemo(() => ({ loading, isOwnedEntity }), [loading, isOwnedEntity]);
}

function useEntityPermission(permission) {
  const {
    entity,
    loading: loadingEntity,
    error: entityError
  } = useAsyncEntity();
  const {
    allowed,
    loading: loadingPermission,
    error: permissionError
  } = usePermission({
    permission,
    resourceRef: entity ? stringifyEntityRef(entity) : void 0
  });
  if (loadingEntity || loadingPermission) {
    return { loading: true, allowed: false };
  }
  if (entityError) {
    return { loading: false, allowed: false, error: entityError };
  }
  return { loading: false, allowed, error: permissionError };
}

const EntityKindPicker = (props) => {
  var _a;
  const { initialFilter, hidden } = props;
  const {
    updateFilters,
    queryParameters: { kind: kindParameter }
  } = useEntityList();
  const [selectedKind] = useState((_a = [kindParameter].flat()[0]) != null ? _a : initialFilter);
  useEffect(() => {
    updateFilters({
      kind: selectedKind ? new EntityKindFilter(selectedKind) : void 0
    });
  }, [selectedKind, updateFilters]);
  if (hidden)
    return null;
  return /* @__PURE__ */ React.createElement(Alert, {
    severity: "warning"
  }, "Kind filter not yet available");
};

const useStyles$b = makeStyles({
  input: {}
}, {
  name: "CatalogReactEntityLifecyclePicker"
});
const icon$2 = /* @__PURE__ */ React.createElement(CheckBoxOutlineBlankIcon, {
  fontSize: "small"
});
const checkedIcon$2 = /* @__PURE__ */ React.createElement(CheckBoxIcon, {
  fontSize: "small"
});
const EntityLifecyclePicker = () => {
  var _a, _b;
  const classes = useStyles$b();
  const {
    updateFilters,
    backendEntities,
    filters,
    queryParameters: { lifecycles: lifecyclesParameter }
  } = useEntityList();
  const queryParamLifecycles = useMemo(() => [lifecyclesParameter].flat().filter(Boolean), [lifecyclesParameter]);
  const [selectedLifecycles, setSelectedLifecycles] = useState(queryParamLifecycles.length ? queryParamLifecycles : (_b = (_a = filters.lifecycles) == null ? void 0 : _a.values) != null ? _b : []);
  useEffect(() => {
    if (queryParamLifecycles.length) {
      setSelectedLifecycles(queryParamLifecycles);
    }
  }, [queryParamLifecycles]);
  useEffect(() => {
    updateFilters({
      lifecycles: selectedLifecycles.length ? new EntityLifecycleFilter(selectedLifecycles) : void 0
    });
  }, [selectedLifecycles, updateFilters]);
  const availableLifecycles = useMemo(() => [
    ...new Set(backendEntities.map((e) => {
      var _a2;
      return (_a2 = e.spec) == null ? void 0 : _a2.lifecycle;
    }).filter(Boolean))
  ].sort(), [backendEntities]);
  if (!availableLifecycles.length)
    return null;
  return /* @__PURE__ */ React.createElement(Box, {
    pb: 1,
    pt: 1
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "button",
    component: "label"
  }, "Lifecycle", /* @__PURE__ */ React.createElement(Autocomplete, {
    multiple: true,
    options: availableLifecycles,
    value: selectedLifecycles,
    onChange: (_, value) => setSelectedLifecycles(value),
    renderOption: (option, { selected }) => /* @__PURE__ */ React.createElement(FormControlLabel, {
      control: /* @__PURE__ */ React.createElement(Checkbox, {
        icon: icon$2,
        checkedIcon: checkedIcon$2,
        checked: selected
      }),
      label: option
    }),
    size: "small",
    popupIcon: /* @__PURE__ */ React.createElement(ExpandMoreIcon, {
      "data-testid": "lifecycle-picker-expand"
    }),
    renderInput: (params) => /* @__PURE__ */ React.createElement(TextField, {
      ...params,
      className: classes.input,
      variant: "outlined"
    })
  })));
};

const useStyles$a = makeStyles({
  input: {}
}, {
  name: "CatalogReactEntityOwnerPicker"
});
const icon$1 = /* @__PURE__ */ React.createElement(CheckBoxOutlineBlankIcon, {
  fontSize: "small"
});
const checkedIcon$1 = /* @__PURE__ */ React.createElement(CheckBoxIcon, {
  fontSize: "small"
});
const EntityOwnerPicker = () => {
  var _a, _b;
  const classes = useStyles$a();
  const {
    updateFilters,
    backendEntities,
    filters,
    queryParameters: { owners: ownersParameter }
  } = useEntityList();
  const queryParamOwners = useMemo(() => [ownersParameter].flat().filter(Boolean), [ownersParameter]);
  const [selectedOwners, setSelectedOwners] = useState(queryParamOwners.length ? queryParamOwners : (_b = (_a = filters.owners) == null ? void 0 : _a.values) != null ? _b : []);
  useEffect(() => {
    if (queryParamOwners.length) {
      setSelectedOwners(queryParamOwners);
    }
  }, [queryParamOwners]);
  useEffect(() => {
    updateFilters({
      owners: selectedOwners.length ? new EntityOwnerFilter(selectedOwners) : void 0
    });
  }, [selectedOwners, updateFilters]);
  const availableOwners = useMemo(() => [
    ...new Set(backendEntities.flatMap((e) => getEntityRelations(e, RELATION_OWNED_BY).map((o) => humanizeEntityRef(o, { defaultKind: "group" }))).filter(Boolean))
  ].sort(), [backendEntities]);
  if (!availableOwners.length)
    return null;
  return /* @__PURE__ */ React.createElement(Box, {
    pb: 1,
    pt: 1
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "button",
    component: "label"
  }, "Owner", /* @__PURE__ */ React.createElement(Autocomplete, {
    multiple: true,
    options: availableOwners,
    value: selectedOwners,
    onChange: (_, value) => setSelectedOwners(value),
    renderOption: (option, { selected }) => /* @__PURE__ */ React.createElement(FormControlLabel, {
      control: /* @__PURE__ */ React.createElement(Checkbox, {
        icon: icon$1,
        checkedIcon: checkedIcon$1,
        checked: selected
      }),
      label: option
    }),
    size: "small",
    popupIcon: /* @__PURE__ */ React.createElement(ExpandMoreIcon, {
      "data-testid": "owner-picker-expand"
    }),
    renderInput: (params) => /* @__PURE__ */ React.createElement(TextField, {
      ...params,
      className: classes.input,
      variant: "outlined"
    })
  })));
};

const useStyles$9 = makeStyles((_theme) => ({
  searchToolbar: {
    paddingLeft: 0,
    paddingRight: 0
  },
  input: {}
}), {
  name: "CatalogReactEntitySearchBar"
});
const EntitySearchBar = () => {
  var _a, _b;
  const classes = useStyles$9();
  const { filters, updateFilters } = useEntityList();
  const [search, setSearch] = useState((_b = (_a = filters.text) == null ? void 0 : _a.value) != null ? _b : "");
  useDebounce(() => {
    updateFilters({
      text: search.length ? new EntityTextFilter(search) : void 0
    });
  }, 250, [search, updateFilters]);
  return /* @__PURE__ */ React.createElement(Toolbar, {
    className: classes.searchToolbar
  }, /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, {
    "aria-label": "search",
    id: "input-with-icon-adornment",
    className: classes.input,
    placeholder: "Search",
    autoComplete: "off",
    onChange: (event) => setSearch(event.target.value),
    value: search,
    startAdornment: /* @__PURE__ */ React.createElement(InputAdornment, {
      position: "start"
    }, /* @__PURE__ */ React.createElement(Search, null)),
    endAdornment: /* @__PURE__ */ React.createElement(InputAdornment, {
      position: "end"
    }, /* @__PURE__ */ React.createElement(IconButton, {
      "aria-label": "clear search",
      onClick: () => setSearch(""),
      edge: "end",
      disabled: search.length === 0
    }, /* @__PURE__ */ React.createElement(Clear, null)))
  })));
};

const columnFactories = Object.freeze({
  createEntityRefColumn(options) {
    const { defaultKind } = options;
    function formatContent(entity) {
      var _a;
      return ((_a = entity.metadata) == null ? void 0 : _a.title) || humanizeEntityRef(entity, {
        defaultKind
      });
    }
    return {
      title: "Name",
      highlight: true,
      customFilterAndSearch(filter, entity) {
        return formatContent(entity).includes(filter);
      },
      customSort(entity1, entity2) {
        return formatContent(entity1).localeCompare(formatContent(entity2));
      },
      render: (entity) => {
        var _a;
        return /* @__PURE__ */ React.createElement(EntityRefLink, {
          entityRef: entity,
          defaultKind,
          title: (_a = entity.metadata) == null ? void 0 : _a.title
        });
      }
    };
  },
  createEntityRelationColumn({
    title,
    relation,
    defaultKind,
    filter: entityFilter
  }) {
    function getRelations(entity) {
      return getEntityRelations(entity, relation, entityFilter);
    }
    function formatContent(entity) {
      return getRelations(entity).map((r) => humanizeEntityRef(r, { defaultKind })).join(", ");
    }
    return {
      title,
      customFilterAndSearch(filter, entity) {
        return formatContent(entity).includes(filter);
      },
      customSort(entity1, entity2) {
        return formatContent(entity1).localeCompare(formatContent(entity2));
      },
      render: (entity) => {
        return /* @__PURE__ */ React.createElement(EntityRefLinks, {
          entityRefs: getRelations(entity),
          defaultKind
        });
      }
    };
  },
  createOwnerColumn() {
    return this.createEntityRelationColumn({
      title: "Owner",
      relation: RELATION_OWNED_BY,
      defaultKind: "group"
    });
  },
  createDomainColumn() {
    return this.createEntityRelationColumn({
      title: "Domain",
      relation: RELATION_PART_OF,
      defaultKind: "domain",
      filter: {
        kind: "domain"
      }
    });
  },
  createSystemColumn() {
    return this.createEntityRelationColumn({
      title: "System",
      relation: RELATION_PART_OF,
      defaultKind: "system",
      filter: {
        kind: "system"
      }
    });
  },
  createMetadataDescriptionColumn() {
    return {
      title: "Description",
      field: "metadata.description",
      render: (entity) => /* @__PURE__ */ React.createElement(OverflowTooltip, {
        text: entity.metadata.description,
        placement: "bottom-start",
        line: 2
      }),
      width: "auto"
    };
  },
  createSpecLifecycleColumn() {
    return {
      title: "Lifecycle",
      field: "spec.lifecycle"
    };
  },
  createSpecTypeColumn() {
    return {
      title: "Type",
      field: "spec.type"
    };
  }
});

const systemEntityColumns = [
  columnFactories.createEntityRefColumn({ defaultKind: "system" }),
  columnFactories.createDomainColumn(),
  columnFactories.createOwnerColumn(),
  columnFactories.createMetadataDescriptionColumn()
];
const componentEntityColumns = [
  columnFactories.createEntityRefColumn({ defaultKind: "component" }),
  columnFactories.createSystemColumn(),
  columnFactories.createOwnerColumn(),
  columnFactories.createSpecTypeColumn(),
  columnFactories.createSpecLifecycleColumn(),
  columnFactories.createMetadataDescriptionColumn()
];

const useStyles$8 = makeStyles((theme) => ({
  empty: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center"
  }
}));
const EntityTable = (props) => {
  const {
    entities,
    title,
    emptyContent,
    variant = "gridItem",
    columns
  } = props;
  const classes = useStyles$8();
  const tableStyle = {
    minWidth: "0",
    width: "100%"
  };
  if (variant === "gridItem") {
    tableStyle.height = "calc(100% - 10px)";
  }
  return /* @__PURE__ */ React.createElement(Table, {
    columns,
    title,
    style: tableStyle,
    emptyContent: emptyContent && /* @__PURE__ */ React.createElement("div", {
      className: classes.empty
    }, emptyContent),
    options: {
      search: false,
      paging: false,
      actionsColumnIndex: -1,
      padding: "dense"
    },
    data: entities
  });
};
EntityTable.columns = columnFactories;
EntityTable.systemEntityColumns = systemEntityColumns;
EntityTable.componentEntityColumns = componentEntityColumns;

const useStyles$7 = makeStyles({
  input: {}
}, {
  name: "CatalogReactEntityTagPicker"
});
const icon = /* @__PURE__ */ React.createElement(CheckBoxOutlineBlankIcon, {
  fontSize: "small"
});
const checkedIcon = /* @__PURE__ */ React.createElement(CheckBoxIcon, {
  fontSize: "small"
});
const EntityTagPicker = () => {
  var _a, _b;
  const classes = useStyles$7();
  const {
    updateFilters,
    filters,
    queryParameters: { tags: tagsParameter }
  } = useEntityList();
  const catalogApi = useApi(catalogApiRef);
  const { value: availableTags } = useAsync(async () => {
    var _a2;
    const facet = "metadata.tags";
    const { facets } = await catalogApi.getEntityFacets({
      facets: [facet],
      filter: (_a2 = filters.kind) == null ? void 0 : _a2.getCatalogFilters()
    });
    return facets[facet].map(({ value }) => value);
  }, [filters.kind]);
  const queryParamTags = useMemo(() => [tagsParameter].flat().filter(Boolean), [tagsParameter]);
  const [selectedTags, setSelectedTags] = useState(queryParamTags.length ? queryParamTags : (_b = (_a = filters.tags) == null ? void 0 : _a.values) != null ? _b : []);
  useEffect(() => {
    if (queryParamTags.length) {
      setSelectedTags(queryParamTags);
    }
  }, [queryParamTags]);
  useEffect(() => {
    updateFilters({
      tags: selectedTags.length ? new EntityTagFilter(selectedTags) : void 0
    });
  }, [selectedTags, updateFilters]);
  if (!(availableTags == null ? void 0 : availableTags.length))
    return null;
  return /* @__PURE__ */ React.createElement(Box, {
    pb: 1,
    pt: 1
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "button",
    component: "label"
  }, "Tags", /* @__PURE__ */ React.createElement(Autocomplete, {
    multiple: true,
    options: availableTags,
    value: selectedTags,
    onChange: (_, value) => setSelectedTags(value),
    renderOption: (option, { selected }) => /* @__PURE__ */ React.createElement(FormControlLabel, {
      control: /* @__PURE__ */ React.createElement(Checkbox, {
        icon,
        checkedIcon,
        checked: selected
      }),
      label: option
    }),
    size: "small",
    popupIcon: /* @__PURE__ */ React.createElement(ExpandMoreIcon, {
      "data-testid": "tag-picker-expand"
    }),
    renderInput: (params) => /* @__PURE__ */ React.createElement(TextField, {
      ...params,
      className: classes.input,
      variant: "outlined"
    })
  })));
};

const EntityTypePicker = (props) => {
  var _a;
  const { hidden, initialFilter } = props;
  const alertApi = useApi(alertApiRef);
  const { error, availableTypes, selectedTypes, setSelectedTypes } = useEntityTypeFilter();
  useEffect(() => {
    if (error) {
      alertApi.post({
        message: `Failed to load entity types`,
        severity: "error"
      });
    }
    if (initialFilter) {
      setSelectedTypes([initialFilter]);
    }
  }, [error, alertApi, initialFilter, setSelectedTypes]);
  if (availableTypes.length === 0 || error)
    return null;
  const items = [
    { value: "all", label: "All" },
    ...availableTypes.map((type) => ({
      value: type,
      label: capitalize(type)
    }))
  ];
  return hidden ? null : /* @__PURE__ */ React.createElement(Box, {
    pb: 1,
    pt: 1
  }, /* @__PURE__ */ React.createElement(Select, {
    label: "Type",
    items,
    selected: (_a = items.length > 1 ? selectedTypes[0] : void 0) != null ? _a : "all",
    onChange: (value) => setSelectedTypes(value === "all" ? [] : [String(value)])
  }));
};

const YellowStar = withStyles({
  root: {
    color: "#f3ba37"
  }
})(Star);
const FavoriteEntity = (props) => {
  const { toggleStarredEntity, isStarredEntity } = useStarredEntity(props.entity);
  return /* @__PURE__ */ React.createElement(IconButton, {
    "aria-label": "favorite",
    color: "inherit",
    ...props,
    onClick: () => toggleStarredEntity()
  }, /* @__PURE__ */ React.createElement(Tooltip, {
    title: isStarredEntity ? "Remove from favorites" : "Add to favorites"
  }, isStarredEntity ? /* @__PURE__ */ React.createElement(YellowStar, null) : /* @__PURE__ */ React.createElement(StarBorder, null)));
};

const DEFAULT_ICON = WorkIcon;
function getKind(kind, entityRef) {
  if (kind) {
    return kind.toLocaleLowerCase("en-US");
  }
  if (entityRef) {
    try {
      return parseEntityRef(entityRef).kind.toLocaleLowerCase("en-US");
    } catch {
      return void 0;
    }
  }
  return void 0;
}
function useIcon(kind, entityRef) {
  const app = useApp();
  const actualKind = getKind(kind, entityRef);
  if (!actualKind) {
    return DEFAULT_ICON;
  }
  const icon = app.getSystemIcon(`kind:${actualKind}`);
  return icon || DEFAULT_ICON;
}
function EntityKindIcon(props) {
  const { kind, entityRef, ...otherProps } = props;
  const Icon = useIcon(kind, entityRef);
  return /* @__PURE__ */ React.createElement(Icon, {
    ...otherProps
  });
}

const useStyles$6 = makeStyles((theme) => ({
  node: {
    fill: theme.palette.grey[300],
    stroke: theme.palette.grey[300],
    "&.primary": {
      fill: theme.palette.primary.light,
      stroke: theme.palette.primary.light
    },
    "&.secondary": {
      fill: theme.palette.secondary.light,
      stroke: theme.palette.secondary.light
    }
  },
  text: {
    fill: theme.palette.getContrastText(theme.palette.grey[300]),
    "&.primary": {
      fill: theme.palette.primary.contrastText
    },
    "&.secondary": {
      fill: theme.palette.secondary.contrastText
    },
    "&.focused": {
      fontWeight: "bold"
    }
  },
  clickable: {
    cursor: "pointer"
  }
}));
function useAncestry(root) {
  const catalogClient = useApi(catalogApiRef);
  const entityRef = stringifyEntityRef(root);
  const { loading, error, value } = useAsync(async () => {
    const response = await catalogClient.getEntityAncestors({ entityRef });
    const nodes = new Array();
    const edges = new Array();
    for (const current of response.items) {
      const currentRef = stringifyEntityRef(current.entity);
      const isRootNode = currentRef === response.rootEntityRef;
      nodes.push({ id: currentRef, root: isRootNode, ...current.entity });
      for (const parentRef of current.parentEntityRefs) {
        edges.push({ from: currentRef, to: parentRef });
      }
    }
    return { nodes, edges };
  }, [entityRef]);
  return {
    loading,
    error,
    nodes: (value == null ? void 0 : value.nodes) || [],
    edges: (value == null ? void 0 : value.edges) || []
  };
}
function CustomNode({ node }) {
  const classes = useStyles$6();
  const navigate = useNavigate();
  const entityRoute = useRouteRef(entityRouteRef);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const idRef = useRef(null);
  useLayoutEffect(() => {
    if (idRef.current) {
      let { height: renderedHeight, width: renderedWidth } = idRef.current.getBBox();
      renderedHeight = Math.round(renderedHeight);
      renderedWidth = Math.round(renderedWidth);
      if (renderedHeight !== height || renderedWidth !== width) {
        setWidth(renderedWidth);
        setHeight(renderedHeight);
      }
    }
  }, [width, height]);
  const padding = 10;
  const iconSize = height;
  const paddedIconWidth = iconSize + padding;
  const paddedWidth = paddedIconWidth + width + padding * 2;
  const paddedHeight = height + padding * 2;
  const displayTitle = node.metadata.title || (node.kind && node.metadata.name && node.metadata.namespace ? humanizeEntityRef({
    kind: node.kind,
    name: node.metadata.name,
    namespace: node.metadata.namespace || ""
  }) : node.id);
  const onClick = () => {
    navigate(entityRoute({
      kind: node.kind,
      namespace: node.metadata.namespace || DEFAULT_NAMESPACE,
      name: node.metadata.name
    }));
  };
  return /* @__PURE__ */ React.createElement("g", {
    onClick,
    className: classes.clickable
  }, /* @__PURE__ */ React.createElement("rect", {
    className: classNames(classes.node, node.root ? "secondary" : "primary"),
    width: paddedWidth,
    height: paddedHeight,
    rx: 10
  }), /* @__PURE__ */ React.createElement(EntityKindIcon, {
    kind: node.kind,
    y: padding,
    x: padding,
    width: iconSize,
    height: iconSize,
    className: classNames(classes.text, node.root ? "secondary" : "primary")
  }), /* @__PURE__ */ React.createElement("text", {
    ref: idRef,
    className: classNames(classes.text, node.root ? "secondary" : "primary"),
    y: paddedHeight / 2,
    x: paddedIconWidth + (width + padding * 2) / 2,
    textAnchor: "middle",
    alignmentBaseline: "middle"
  }, displayTitle));
}
function AncestryPage(props) {
  const { loading, error, nodes, edges } = useAncestry(props.entity);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error
    });
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DialogContentText, {
    variant: "h2"
  }, "Ancestry"), /* @__PURE__ */ React.createElement(DialogContentText, {
    gutterBottom: true
  }, "This is the ancestry of entities above the current one - as in, the chain(s) of entities down to the current one, where", " ", /* @__PURE__ */ React.createElement(Link, {
    to: "https://backstage.io/docs/features/software-catalog/life-of-an-entity"
  }, "processors emitted"), " ", "child entities that ultimately led to the current one existing. Note that this is a completely different mechanism from relations."), /* @__PURE__ */ React.createElement(Box, {
    mt: 4
  }, /* @__PURE__ */ React.createElement(DependencyGraph, {
    nodes,
    edges,
    renderNode: CustomNode,
    direction: DependencyGraphTypes.Direction.BOTTOM_TOP,
    zoom: "enable-on-click"
  })));
}

const useStyles$5 = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column"
  },
  marginTop: {
    marginTop: theme.spacing(2)
  },
  helpIcon: {
    marginLeft: theme.spacing(1),
    color: theme.palette.text.disabled
  },
  monospace: {
    fontFamily: "monospace"
  }
}));
function ListItemText(props) {
  const classes = useStyles$5();
  return /* @__PURE__ */ React.createElement(ListItemText$1, {
    ...props,
    primaryTypographyProps: { className: classes.monospace },
    secondaryTypographyProps: { className: classes.monospace }
  });
}
function ListSubheader(props) {
  const classes = useStyles$5();
  return /* @__PURE__ */ React.createElement(ListSubheader$1, {
    className: classes.monospace
  }, props.children);
}
function Container(props) {
  return /* @__PURE__ */ React.createElement(Box, {
    mt: 2
  }, /* @__PURE__ */ React.createElement(Card, {
    variant: "outlined"
  }, /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6",
    gutterBottom: true
  }, props.title, props.helpLink && /* @__PURE__ */ React.createElement(HelpIcon, {
    to: props.helpLink
  })), props.children)));
}
function findLink(value) {
  if (value.match(/^url:https?:\/\//)) {
    return value.slice("url:".length);
  }
  if (value.match(/^https?:\/\//)) {
    return value;
  }
  return void 0;
}
function KeyValueListItem(props) {
  const [key, value] = props.entry;
  const link = findLink(value);
  return /* @__PURE__ */ React.createElement(ListItem, null, props.indent && /* @__PURE__ */ React.createElement(ListItemIcon, null), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: key,
    secondary: link ? /* @__PURE__ */ React.createElement(Link, {
      to: link
    }, value) : value
  }));
}
function HelpIcon(props) {
  const classes = useStyles$5();
  return /* @__PURE__ */ React.createElement(Link, {
    to: props.to,
    className: classes.helpIcon
  }, /* @__PURE__ */ React.createElement(HelpOutlineIcon, {
    fontSize: "inherit"
  }));
}

const useStyles$4 = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column"
  }
});
function useColocated(entity) {
  var _a, _b;
  const catalogApi = useApi(catalogApiRef);
  const currentEntityRef = stringifyEntityRef(entity);
  const location = (_a = entity.metadata.annotations) == null ? void 0 : _a[ANNOTATION_LOCATION];
  const origin = (_b = entity.metadata.annotations) == null ? void 0 : _b[ANNOTATION_ORIGIN_LOCATION];
  const { loading, error, value } = useAsync(async () => {
    if (!location && !origin) {
      return [];
    }
    const response = await catalogApi.getEntities({
      filter: [
        ...location ? [{ [`metadata.annotations.${ANNOTATION_LOCATION}`]: location }] : [],
        ...origin ? [{ [`metadata.annotations.${ANNOTATION_ORIGIN_LOCATION}`]: origin }] : []
      ]
    });
    return response.items;
  }, [location, origin]);
  return {
    loading,
    error,
    location,
    originLocation: origin,
    colocatedEntities: value == null ? void 0 : value.filter((colocated) => stringifyEntityRef(colocated) !== currentEntityRef)
  };
}
function EntityList(props) {
  return /* @__PURE__ */ React.createElement(List, {
    dense: true
  }, props.header && /* @__PURE__ */ React.createElement(KeyValueListItem, {
    key: "header",
    entry: props.header
  }), props.entities.map((entity) => /* @__PURE__ */ React.createElement(ListItem, {
    key: stringifyEntityRef(entity)
  }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(EntityKindIcon, {
    kind: entity.kind
  })), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: /* @__PURE__ */ React.createElement(EntityRefLink, {
      entityRef: entity
    })
  }))));
}
function Contents$1(props) {
  const { entity } = props;
  const { loading, error, location, originLocation, colocatedEntities } = useColocated(entity);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error
    });
  }
  if (!location && !originLocation) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "warning"
    }, "Entity had no location information.");
  } else if (!(colocatedEntities == null ? void 0 : colocatedEntities.length)) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "info"
    }, "There were no other entities on this location.");
  }
  if (location === originLocation) {
    return /* @__PURE__ */ React.createElement(EntityList, {
      entities: colocatedEntities
    });
  }
  const atLocation = colocatedEntities.filter((e) => {
    var _a;
    return ((_a = e.metadata.annotations) == null ? void 0 : _a[ANNOTATION_LOCATION]) === location;
  });
  const atOrigin = colocatedEntities.filter((e) => {
    var _a;
    return ((_a = e.metadata.annotations) == null ? void 0 : _a[ANNOTATION_ORIGIN_LOCATION]) === originLocation;
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, atLocation.length > 0 && /* @__PURE__ */ React.createElement(EntityList, {
    entities: atLocation,
    header: ["At the same location", location]
  }), atOrigin.length > 0 && /* @__PURE__ */ React.createElement(EntityList, {
    entities: atOrigin,
    header: ["At the same origin", originLocation]
  }));
}
function ColocatedPage(props) {
  const classes = useStyles$4();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DialogContentText, {
    variant: "h2"
  }, "Colocated"), /* @__PURE__ */ React.createElement(DialogContentText, null, "These are the entities that are colocated with this entity - as in, they originated from the same data source (e.g. came from the same YAML file), or from the same origin (e.g. the originally registered URL)."), /* @__PURE__ */ React.createElement("div", {
    className: classes.root
  }, /* @__PURE__ */ React.createElement(Contents$1, {
    entity: props.entity
  })));
}

function sortKeys(data) {
  return Object.fromEntries([...Object.entries(data)].sort((a, b) => a[0] < b[0] ? -1 : 1));
}

function JsonPage(props) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DialogContentText, {
    variant: "h2"
  }, "Entity as JSON"), /* @__PURE__ */ React.createElement(DialogContentText, null, "This is the raw entity data as received from the catalog, on JSON form."), /* @__PURE__ */ React.createElement(DialogContentText, null, /* @__PURE__ */ React.createElement("div", {
    style: { fontSize: "75%" },
    "data-testid": "code-snippet"
  }, /* @__PURE__ */ React.createElement(CodeSnippet, {
    text: JSON.stringify(sortKeys(props.entity), void 0, 2),
    language: "json",
    showCopyCodeButton: true
  }))));
}

const useStyles$3 = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column"
  }
});
function OverviewPage(props) {
  var _a, _b;
  const classes = useStyles$3();
  const {
    apiVersion,
    kind,
    metadata,
    spec,
    relations = [],
    status = {}
  } = props.entity;
  const groupedRelations = groupBy$1(sortBy(relations, (r) => r.targetRef), "type");
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DialogContentText, {
    variant: "h2"
  }, "Overview"), /* @__PURE__ */ React.createElement("div", {
    className: classes.root
  }, /* @__PURE__ */ React.createElement(Container, {
    title: "Identity"
  }, /* @__PURE__ */ React.createElement(List, {
    dense: true
  }, /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(ListItemText, {
    primary: "apiVersion",
    secondary: apiVersion
  })), /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(ListItemText, {
    primary: "kind",
    secondary: kind
  })), (spec == null ? void 0 : spec.type) && /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(ListItemText, {
    primary: "spec.type",
    secondary: spec.type
  })), metadata.uid && /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(ListItemText, {
    primary: "uid",
    secondary: metadata.uid
  })), metadata.etag && /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(ListItemText, {
    primary: "etag",
    secondary: metadata.etag
  })))), /* @__PURE__ */ React.createElement(Container, {
    title: "Metadata"
  }, !!Object.keys(metadata.annotations || {}).length && /* @__PURE__ */ React.createElement(List, {
    dense: true,
    subheader: /* @__PURE__ */ React.createElement(ListSubheader, null, "Annotations", /* @__PURE__ */ React.createElement(HelpIcon, {
      to: "https://backstage.io/docs/features/software-catalog/well-known-annotations"
    }))
  }, Object.entries(metadata.annotations).map((entry) => /* @__PURE__ */ React.createElement(KeyValueListItem, {
    key: entry[0],
    indent: true,
    entry
  }))), !!Object.keys(metadata.labels || {}).length && /* @__PURE__ */ React.createElement(List, {
    dense: true,
    subheader: /* @__PURE__ */ React.createElement(ListSubheader, null, "Labels")
  }, Object.entries(metadata.labels).map((entry) => /* @__PURE__ */ React.createElement(KeyValueListItem, {
    key: entry[0],
    indent: true,
    entry
  }))), !!((_a = metadata.tags) == null ? void 0 : _a.length) && /* @__PURE__ */ React.createElement(List, {
    dense: true,
    subheader: /* @__PURE__ */ React.createElement(ListSubheader, null, "Tags")
  }, metadata.tags.map((tag, index) => /* @__PURE__ */ React.createElement(ListItem, {
    key: `${tag}-${index}`
  }, /* @__PURE__ */ React.createElement(ListItemIcon, null), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: tag
  }))))), !!relations.length && /* @__PURE__ */ React.createElement(Container, {
    title: "Relations",
    helpLink: "https://backstage.io/docs/features/software-catalog/well-known-relations"
  }, Object.entries(groupedRelations).map(([type, groupRelations], index) => /* @__PURE__ */ React.createElement("div", {
    key: index
  }, /* @__PURE__ */ React.createElement(List, {
    dense: true,
    subheader: /* @__PURE__ */ React.createElement(ListSubheader, null, type)
  }, groupRelations.map((group) => /* @__PURE__ */ React.createElement(ListItem, {
    key: group.targetRef
  }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(EntityKindIcon, {
    entityRef: group.targetRef
  })), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: /* @__PURE__ */ React.createElement(EntityRefLink, {
      entityRef: group.targetRef
    })
  }))))))), !!((_b = status.items) == null ? void 0 : _b.length) && /* @__PURE__ */ React.createElement(Container, {
    title: "Status",
    helpLink: "https://backstage.io/docs/features/software-catalog/well-known-statuses"
  }, status.items.map((item, index) => /* @__PURE__ */ React.createElement("div", {
    key: index
  }, /* @__PURE__ */ React.createElement(Typography, null, item.level, ": ", item.type), /* @__PURE__ */ React.createElement(Box, {
    ml: 2
  }, item.message))))));
}

function YamlPage(props) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DialogContentText$1, {
    variant: "h2"
  }, "Entity as YAML"), /* @__PURE__ */ React.createElement(DialogContentText$1, null, "This is the raw entity data as received from the catalog, on YAML form."), /* @__PURE__ */ React.createElement(DialogContentText$1, null, /* @__PURE__ */ React.createElement("div", {
    style: { fontSize: "75%" },
    "data-testid": "code-snippet"
  }, /* @__PURE__ */ React.createElement(CodeSnippet, {
    text: YAML.stringify(sortKeys(props.entity)),
    language: "yaml",
    showCopyCodeButton: true
  }))));
}

const useStyles$2 = makeStyles((theme) => ({
  fullHeightDialog: {
    height: "calc(100% - 64px)"
  },
  root: {
    display: "flex",
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    flexShrink: 0
  },
  tabContents: {
    flexGrow: 1,
    overflowX: "auto"
  }
}));
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles$2();
  return /* @__PURE__ */ React.createElement("div", {
    role: "tabpanel",
    hidden: value !== index,
    id: `vertical-tabpanel-${index}`,
    "aria-labelledby": `vertical-tab-${index}`,
    className: classes.tabContents,
    ...other
  }, value === index && /* @__PURE__ */ React.createElement(Box, {
    pl: 3,
    pr: 3
  }, children));
}
function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}
function InspectEntityDialog(props) {
  const classes = useStyles$2();
  const [activeTab, setActiveTab] = React.useState(0);
  useEffect(() => {
    setActiveTab(0);
  }, [props.open]);
  if (!props.entity) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(Dialog, {
    fullWidth: true,
    maxWidth: "xl",
    open: props.open,
    onClose: props.onClose,
    "aria-labelledby": "entity-inspector-dialog-title",
    PaperProps: { className: classes.fullHeightDialog }
  }, /* @__PURE__ */ React.createElement(DialogTitle, {
    id: "entity-inspector-dialog-title"
  }, "Entity Inspector"), /* @__PURE__ */ React.createElement(DialogContent, {
    dividers: true
  }, /* @__PURE__ */ React.createElement("div", {
    className: classes.root
  }, /* @__PURE__ */ React.createElement(Tabs, {
    orientation: "vertical",
    variant: "scrollable",
    value: activeTab,
    onChange: (_, newValue) => setActiveTab(newValue),
    "aria-label": "Inspector options",
    className: classes.tabs
  }, /* @__PURE__ */ React.createElement(Tab, {
    label: "Overview",
    ...a11yProps(0)
  }), /* @__PURE__ */ React.createElement(Tab, {
    label: "Ancestry",
    ...a11yProps(1)
  }), /* @__PURE__ */ React.createElement(Tab, {
    label: "Colocated",
    ...a11yProps(2)
  }), /* @__PURE__ */ React.createElement(Tab, {
    label: "Raw JSON",
    ...a11yProps(3)
  }), /* @__PURE__ */ React.createElement(Tab, {
    label: "Raw YAML",
    ...a11yProps(4)
  })), /* @__PURE__ */ React.createElement(TabPanel, {
    value: activeTab,
    index: 0
  }, /* @__PURE__ */ React.createElement(OverviewPage, {
    entity: props.entity
  })), /* @__PURE__ */ React.createElement(TabPanel, {
    value: activeTab,
    index: 1
  }, /* @__PURE__ */ React.createElement(AncestryPage, {
    entity: props.entity
  })), /* @__PURE__ */ React.createElement(TabPanel, {
    value: activeTab,
    index: 2
  }, /* @__PURE__ */ React.createElement(ColocatedPage, {
    entity: props.entity
  })), /* @__PURE__ */ React.createElement(TabPanel, {
    value: activeTab,
    index: 3
  }, /* @__PURE__ */ React.createElement(JsonPage, {
    entity: props.entity
  })), /* @__PURE__ */ React.createElement(TabPanel, {
    value: activeTab,
    index: 4
  }, /* @__PURE__ */ React.createElement(YamlPage, {
    entity: props.entity
  })))), /* @__PURE__ */ React.createElement(DialogActions, null, /* @__PURE__ */ React.createElement(Button, {
    onClick: props.onClose,
    color: "primary"
  }, "Close")));
}

function useUnregisterEntityDialogState(entity) {
  var _a;
  const catalogApi = useApi(catalogApiRef);
  const locationRef = (_a = entity.metadata.annotations) == null ? void 0 : _a[ANNOTATION_ORIGIN_LOCATION];
  const uid = entity.metadata.uid;
  const isBootstrap = locationRef === "bootstrap:bootstrap";
  const prerequisites = useAsync(async () => {
    const locationPromise = catalogApi.getLocationByRef(locationRef);
    let colocatedEntitiesPromise;
    if (!locationRef) {
      colocatedEntitiesPromise = Promise.resolve([]);
    } else {
      const locationAnnotationFilter = `metadata.annotations.${ANNOTATION_ORIGIN_LOCATION}`;
      colocatedEntitiesPromise = catalogApi.getEntities({
        filter: { [locationAnnotationFilter]: locationRef },
        fields: [
          "kind",
          "metadata.uid",
          "metadata.name",
          "metadata.namespace"
        ]
      }).then((response) => response.items);
    }
    return Promise.all([locationPromise, colocatedEntitiesPromise]).then(([location2, colocatedEntities2]) => ({
      location: location2,
      colocatedEntities: colocatedEntities2
    }));
  }, [catalogApi, entity]);
  const unregisterLocation = useCallback(async function unregisterLocationFn() {
    const { location: location2 } = prerequisites.value;
    await catalogApi.removeLocationById(location2.id);
  }, [catalogApi, prerequisites]);
  const deleteEntity = useCallback(async function deleteEntityFn() {
    await catalogApi.removeEntityByUid(uid);
  }, [catalogApi, uid]);
  if (isBootstrap) {
    return { type: "bootstrap", location: locationRef, deleteEntity };
  }
  const { loading, error, value } = prerequisites;
  if (loading) {
    return { type: "loading" };
  } else if (error) {
    return { type: "error", error };
  }
  const { location, colocatedEntities } = value;
  if (!location) {
    return { type: "only-delete", deleteEntity };
  }
  return {
    type: "unregister",
    location: locationRef,
    colocatedEntities: colocatedEntities.map(getCompoundEntityRef),
    unregisterLocation,
    deleteEntity
  };
}

const useStyles$1 = makeStyles({
  advancedButton: {
    fontSize: "0.7em"
  }
});
const Contents = ({
  entity,
  onConfirm
}) => {
  var _a;
  const alertApi = useApi(alertApiRef);
  const configApi = useApi(configApiRef);
  const classes = useStyles$1();
  const state = useUnregisterEntityDialogState(entity);
  const [showDelete, setShowDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const appTitle = (_a = configApi.getOptionalString("app.title")) != null ? _a : "Backstage";
  const onUnregister = useCallback(async function onUnregisterFn() {
    if ("unregisterLocation" in state) {
      setBusy(true);
      try {
        await state.unregisterLocation();
        onConfirm();
      } catch (err) {
        assertError(err);
        alertApi.post({ message: err.message });
      } finally {
        setBusy(false);
      }
    }
  }, [alertApi, onConfirm, state]);
  const onDelete = useCallback(async function onDeleteFn() {
    if ("deleteEntity" in state) {
      setBusy(true);
      try {
        await state.deleteEntity();
        onConfirm();
      } catch (err) {
        assertError(err);
        alertApi.post({ message: err.message });
      } finally {
        setBusy(false);
      }
    }
  }, [alertApi, onConfirm, state]);
  if (state.type === "loading") {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (state.type === "error") {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error: state.error
    });
  }
  if (state.type === "bootstrap") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Alert$1, {
      severity: "info"
    }, 'You cannot unregister this entity, since it originates from a protected Backstage configuration (location "', state.location, '"). If you believe this is in error, please contact the ', appTitle, " ", "integrator."), /* @__PURE__ */ React.createElement(Box, {
      marginTop: 2
    }, !showDelete && /* @__PURE__ */ React.createElement(Button, {
      variant: "text",
      size: "small",
      color: "primary",
      className: classes.advancedButton,
      onClick: () => setShowDelete(true)
    }, "Advanced Options"), showDelete && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DialogContentText, null, "You have the option to delete the entity itself from the catalog. Note that this should only be done if you know that the catalog file has been deleted at, or moved from, its origin location. If that is not the case, the entity will reappear shortly as the next refresh round is performed by the catalog."), /* @__PURE__ */ React.createElement(Button, {
      variant: "contained",
      color: "secondary",
      disabled: busy,
      onClick: onDelete
    }, "Delete Entity"))));
  }
  if (state.type === "only-delete") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DialogContentText, null, "This entity does not seem to originate from a registered location. You therefore only have the option to delete it outright from the catalog."), /* @__PURE__ */ React.createElement(Button, {
      variant: "contained",
      color: "secondary",
      disabled: busy,
      onClick: onDelete
    }, "Delete Entity"));
  }
  if (state.type === "unregister") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DialogContentText, null, "This action will unregister the following entities:"), /* @__PURE__ */ React.createElement(DialogContentText, {
      component: "ul"
    }, state.colocatedEntities.map((e) => /* @__PURE__ */ React.createElement("li", {
      key: `${e.kind}:${e.namespace}/${e.name}`
    }, /* @__PURE__ */ React.createElement(EntityRefLink, {
      entityRef: e
    })))), /* @__PURE__ */ React.createElement(DialogContentText, null, "Located at the following location:"), /* @__PURE__ */ React.createElement(DialogContentText, {
      component: "ul"
    }, /* @__PURE__ */ React.createElement("li", null, state.location)), /* @__PURE__ */ React.createElement(DialogContentText, null, "To undo, just re-register the entity in ", appTitle, "."), /* @__PURE__ */ React.createElement(Box, {
      marginTop: 2
    }, /* @__PURE__ */ React.createElement(Button, {
      variant: "contained",
      color: "secondary",
      disabled: busy,
      onClick: onUnregister
    }, "Unregister Location"), !showDelete && /* @__PURE__ */ React.createElement(Box, {
      component: "span",
      marginLeft: 2
    }, /* @__PURE__ */ React.createElement(Button, {
      variant: "text",
      size: "small",
      color: "primary",
      className: classes.advancedButton,
      onClick: () => setShowDelete(true)
    }, "Advanced Options"))), showDelete && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Box, {
      paddingTop: 4,
      paddingBottom: 4
    }, /* @__PURE__ */ React.createElement(Divider, null)), /* @__PURE__ */ React.createElement(DialogContentText, null, "You also have the option to delete the entity itself from the catalog. Note that this should only be done if you know that the catalog file has been deleted at, or moved from, its origin location. If that is not the case, the entity will reappear shortly as the next refresh round is performed by the catalog."), /* @__PURE__ */ React.createElement(Button, {
      variant: "contained",
      color: "secondary",
      disabled: busy,
      onClick: onDelete
    }, "Delete Entity")));
  }
  return /* @__PURE__ */ React.createElement(Alert$1, {
    severity: "error"
  }, "Internal error: Unknown state");
};
const UnregisterEntityDialog = (props) => {
  const { open, onConfirm, onClose, entity } = props;
  return /* @__PURE__ */ React.createElement(Dialog, {
    open,
    onClose
  }, /* @__PURE__ */ React.createElement(DialogTitle, {
    id: "responsive-dialog-title"
  }, "Are you sure you want to unregister this entity?"), /* @__PURE__ */ React.createElement(DialogContent, null, /* @__PURE__ */ React.createElement(Contents, {
    entity,
    onConfirm
  })), /* @__PURE__ */ React.createElement(DialogActions, null, /* @__PURE__ */ React.createElement(Button, {
    onClick: onClose,
    color: "primary"
  }, "Cancel")));
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "rgba(0, 0, 0, .11)",
    boxShadow: "none",
    margin: theme.spacing(1, 0, 1, 0)
  },
  title: {
    margin: theme.spacing(1, 0, 0, 1),
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "bold"
  },
  listIcon: {
    minWidth: 30,
    color: theme.palette.text.primary
  },
  menuItem: {
    minHeight: theme.spacing(6)
  },
  groupWrapper: {
    margin: theme.spacing(1, 1, 2, 1)
  }
}), {
  name: "CatalogReactUserListPicker"
});
function getFilterGroups(orgName) {
  return [
    {
      name: "Personal",
      items: [
        {
          id: "owned",
          label: "Owned",
          icon: SettingsIcon
        },
        {
          id: "starred",
          label: "Starred",
          icon: Star
        }
      ]
    },
    {
      name: orgName != null ? orgName : "Company",
      items: [
        {
          id: "all",
          label: "All"
        }
      ]
    }
  ];
}
const UserListPicker = (props) => {
  var _a;
  const { initialFilter, availableFilters } = props;
  const classes = useStyles();
  const configApi = useApi(configApiRef);
  const orgName = (_a = configApi.getOptionalString("organization.name")) != null ? _a : "Company";
  const {
    filters,
    updateFilters,
    backendEntities,
    queryParameters: { kind: kindParameter, user: userParameter },
    loading: loadingBackendEntities
  } = useEntityList();
  const userAndGroupFilterIds = ["starred", "all"];
  const filterGroups = getFilterGroups(orgName).map((filterGroup) => ({
    ...filterGroup,
    items: filterGroup.items.filter(({ id }) => ["group", "user"].some((kind) => kind === kindParameter) ? userAndGroupFilterIds.includes(id) : !availableFilters || availableFilters.includes(id))
  })).filter(({ items }) => !!items.length);
  const { isStarredEntity } = useStarredEntities();
  const { isOwnedEntity, loading: loadingEntityOwnership } = useEntityOwnership();
  const loading = loadingBackendEntities || loadingEntityOwnership;
  const ownedFilter = useMemo(() => new UserListFilter("owned", isOwnedEntity, isStarredEntity), [isOwnedEntity, isStarredEntity]);
  const starredFilter = useMemo(() => new UserListFilter("starred", isOwnedEntity, isStarredEntity), [isOwnedEntity, isStarredEntity]);
  const queryParamUserFilter = useMemo(() => [userParameter].flat()[0], [userParameter]);
  const [selectedUserFilter, setSelectedUserFilter] = useState(queryParamUserFilter != null ? queryParamUserFilter : initialFilter);
  const entitiesWithoutUserFilter = useMemo(() => backendEntities.filter(reduceEntityFilters(compact(Object.values({ ...filters, user: void 0 })))), [filters, backendEntities]);
  const filterCounts = useMemo(() => ({
    all: entitiesWithoutUserFilter.length,
    starred: entitiesWithoutUserFilter.filter((entity) => starredFilter.filterEntity(entity)).length,
    owned: entitiesWithoutUserFilter.filter((entity) => ownedFilter.filterEntity(entity)).length
  }), [entitiesWithoutUserFilter, starredFilter, ownedFilter]);
  useEffect(() => {
    if (queryParamUserFilter) {
      setSelectedUserFilter(queryParamUserFilter);
    }
  }, [queryParamUserFilter]);
  useEffect(() => {
    if (!loading && !!selectedUserFilter && selectedUserFilter !== "all" && filterCounts[selectedUserFilter] === 0) {
      setSelectedUserFilter("all");
    }
  }, [loading, filterCounts, selectedUserFilter, setSelectedUserFilter]);
  useEffect(() => {
    updateFilters({
      user: selectedUserFilter ? new UserListFilter(selectedUserFilter, isOwnedEntity, isStarredEntity) : void 0
    });
  }, [selectedUserFilter, isOwnedEntity, isStarredEntity, updateFilters]);
  return /* @__PURE__ */ React.createElement(Card, {
    className: classes.root
  }, filterGroups.map((group) => /* @__PURE__ */ React.createElement(Fragment, {
    key: group.name
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2",
    component: "span",
    className: classes.title
  }, group.name), /* @__PURE__ */ React.createElement(Card, {
    className: classes.groupWrapper
  }, /* @__PURE__ */ React.createElement(List, {
    disablePadding: true,
    dense: true,
    role: "menu",
    "aria-label": group.name
  }, group.items.map((item) => {
    var _a2, _b;
    return /* @__PURE__ */ React.createElement(MenuItem, {
      role: "none presentation",
      key: item.id,
      button: true,
      divider: true,
      onClick: () => setSelectedUserFilter(item.id),
      selected: item.id === ((_a2 = filters.user) == null ? void 0 : _a2.value),
      className: classes.menuItem,
      disabled: filterCounts[item.id] === 0,
      "data-testid": `user-picker-${item.id}`,
      tabIndex: 0,
      ContainerProps: { role: "menuitem" }
    }, item.icon && /* @__PURE__ */ React.createElement(ListItemIcon, {
      className: classes.listIcon
    }, /* @__PURE__ */ React.createElement(item.icon, {
      fontSize: "small"
    })), /* @__PURE__ */ React.createElement(ListItemText$1, null, /* @__PURE__ */ React.createElement(Typography, {
      variant: "body1"
    }, item.label, " ")), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, null, (_b = filterCounts[item.id]) != null ? _b : "-"));
  }))))));
};

const MockEntityListContextProvider = ({
  children,
  value
}) => {
  var _a;
  const [filters, setFilters] = useState((_a = value == null ? void 0 : value.filters) != null ? _a : {});
  const updateFilters = useCallback((update) => {
    setFilters((prevFilters) => {
      const newFilters = typeof update === "function" ? update(prevFilters) : update;
      return { ...prevFilters, ...newFilters };
    });
  }, []);
  const defaultValues = useMemo(() => ({
    entities: [],
    backendEntities: [],
    queryParameters: {}
  }), []);
  const resolvedValue = useMemo(() => {
    var _a2, _b, _c, _d, _e;
    return {
      entities: (_a2 = value == null ? void 0 : value.entities) != null ? _a2 : defaultValues.entities,
      backendEntities: (_b = value == null ? void 0 : value.backendEntities) != null ? _b : defaultValues.backendEntities,
      updateFilters: (_c = value == null ? void 0 : value.updateFilters) != null ? _c : updateFilters,
      filters,
      loading: (_d = value == null ? void 0 : value.loading) != null ? _d : false,
      queryParameters: (_e = value == null ? void 0 : value.queryParameters) != null ? _e : defaultValues.queryParameters,
      error: value == null ? void 0 : value.error
    };
  }, [value, defaultValues, filters, updateFilters]);
  return /* @__PURE__ */ React.createElement(EntityListContext.Provider, {
    value: resolvedValue
  }, children);
};

export { AsyncEntityProvider, CatalogFilterLayout, EntityKindFilter, EntityKindPicker, EntityLifecycleFilter, EntityLifecyclePicker, EntityListContext, EntityListProvider, EntityOwnerFilter, EntityOwnerPicker, EntityProvider, EntityRefLink, EntityRefLinks, EntitySearchBar, EntityTable, EntityTagFilter, EntityTagPicker, EntityTextFilter, EntityTypeFilter, EntityTypePicker, FavoriteEntity, InspectEntityDialog, MockEntityListContextProvider, MockStarredEntitiesApi, UnregisterEntityDialog, UserListFilter, UserListPicker, catalogApiRef, columnFactories, entityRouteParams, entityRouteRef, getEntityRelations, getEntitySourceLocation, humanizeEntityRef, isOwnerOf, starredEntitiesApiRef, useAsyncEntity, useEntity, useEntityList, useEntityOwnership, useEntityPermission, useEntityTypeFilter, useRelatedEntities, useStarredEntities, useStarredEntity };
//# sourceMappingURL=index.esm.js.map
