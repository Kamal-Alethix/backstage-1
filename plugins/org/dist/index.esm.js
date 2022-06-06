import { createExternalRouteRef, createPlugin, createComponentExtension, useApi, alertApiRef, useRouteRef, identityApiRef } from '@backstage/core-plugin-api';
import { stringifyEntityRef, DEFAULT_NAMESPACE, RELATION_PARENT_OF, RELATION_CHILD_OF, ANNOTATION_LOCATION, ANNOTATION_EDIT_URL, RELATION_MEMBER_OF, parseEntityRef, getCompoundEntityRef } from '@backstage/catalog-model';
import { useEntity, catalogApiRef, entityRouteParams, getEntityRelations, EntityRefLinks, humanizeEntityRef, entityRouteRef } from '@backstage/plugin-catalog-react';
import { makeStyles, createStyles, Grid, Box, Typography, IconButton, List, ListItem, ListItemIcon, Tooltip, ListItemText, ListItemSecondaryAction, Switch } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import React, { useCallback, useState } from 'react';
import { generatePath } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import { Progress, ResponseErrorPanel, InfoCard, Avatar, Link, SidebarItem, SidebarSubmenu, SidebarSubmenuItem } from '@backstage/core-components';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import EmailIcon from '@material-ui/icons/Email';
import GroupIcon from '@material-ui/icons/Group';
import EditIcon from '@material-ui/icons/Edit';
import CachedIcon from '@material-ui/icons/Cached';
import Alert from '@material-ui/lab/Alert';
import PersonIcon from '@material-ui/icons/Person';
import pluralize from 'pluralize';
import limiterFactory from 'p-limit';
import qs from 'qs';

const catalogIndexRouteRef = createExternalRouteRef({
  id: "catalog-index"
});

const orgPlugin = createPlugin({
  id: "org",
  externalRoutes: {
    catalogIndex: catalogIndexRouteRef
  }
});
const EntityGroupProfileCard = orgPlugin.provide(createComponentExtension({
  name: "EntityGroupProfileCard",
  component: {
    lazy: () => import('./esm/index-e5ecb1bb.esm.js').then((m) => m.GroupProfileCard)
  }
}));
const EntityMembersListCard = orgPlugin.provide(createComponentExtension({
  name: "EntityMembersListCard",
  component: {
    lazy: () => import('./esm/index-e5ecb1bb.esm.js').then((m) => m.MembersListCard)
  }
}));
const EntityOwnershipCard = orgPlugin.provide(createComponentExtension({
  name: "EntityOwnershipCard",
  component: {
    lazy: () => import('./esm/index-e5ecb1bb.esm.js').then((m) => m.OwnershipCard)
  }
}));
const EntityUserProfileCard = orgPlugin.provide(createComponentExtension({
  name: "EntityUserProfileCard",
  component: {
    lazy: () => import('./esm/index-e5ecb1bb.esm.js').then((m) => m.UserProfileCard)
  }
}));

const useStyles$2 = makeStyles((theme) => createStyles({
  card: {
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[2],
    borderRadius: "4px",
    overflow: "visible",
    position: "relative",
    margin: theme.spacing(4, 1, 1),
    flex: "1",
    minWidth: "0px"
  },
  email: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    display: "inline-block",
    maxWidth: "100%",
    "&:hover": {
      overflow: "visible",
      whiteSpace: "normal"
    }
  }
}));
const MemberComponent = (props) => {
  var _a;
  const classes = useStyles$2();
  const {
    metadata: { name: metaName, description },
    spec: { profile }
  } = props.member;
  const displayName = (_a = profile == null ? void 0 : profile.displayName) != null ? _a : metaName;
  return /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    container: true,
    xs: 12,
    sm: 6,
    md: 4,
    xl: 2
  }, /* @__PURE__ */ React.createElement(Box, {
    className: classes.card
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    m: 3,
    alignItems: "center",
    justifyContent: "center"
  }, /* @__PURE__ */ React.createElement(Avatar, {
    displayName,
    picture: profile == null ? void 0 : profile.picture,
    customStyles: {
      position: "absolute",
      top: "-2rem"
    }
  }), /* @__PURE__ */ React.createElement(Box, {
    pt: 2,
    sx: {
      maxWidth: "100%"
    },
    textAlign: "center"
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h5"
  }, /* @__PURE__ */ React.createElement(Link, {
    to: generatePath(`/catalog/:namespace/user/${metaName}`, entityRouteParams(props.member))
  }, displayName)), (profile == null ? void 0 : profile.email) && /* @__PURE__ */ React.createElement(Link, {
    className: classes.email,
    to: `mailto:${profile.email}`
  }, profile.email), description && /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2"
  }, description)))));
};
const MembersListCard = (props) => {
  var _a;
  const { memberDisplayTitle = "Members", pageSize = 50 } = props;
  const { entity: groupEntity } = useEntity();
  const {
    metadata: { name: groupName, namespace: grpNamespace },
    spec: { profile }
  } = groupEntity;
  const catalogApi = useApi(catalogApiRef);
  const displayName = (_a = profile == null ? void 0 : profile.displayName) != null ? _a : groupName;
  const groupNamespace = grpNamespace || DEFAULT_NAMESPACE;
  const [page, setPage] = React.useState(1);
  const pageChange = (_, pageIndex) => {
    setPage(pageIndex);
  };
  const {
    loading,
    error,
    value: members
  } = useAsync(async () => {
    const membersList = await catalogApi.getEntities({
      filter: {
        kind: "User",
        "relations.memberof": [
          stringifyEntityRef({
            kind: "group",
            namespace: groupNamespace.toLocaleLowerCase("en-US"),
            name: groupName.toLocaleLowerCase("en-US")
          })
        ]
      }
    });
    return membersList.items;
  }, [catalogApi, groupEntity]);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error
    });
  }
  const nbPages = Math.ceil(((members == null ? void 0 : members.length) || 0) / pageSize);
  const paginationLabel = nbPages < 2 ? "" : `, page ${page} of ${nbPages}`;
  const pagination = /* @__PURE__ */ React.createElement(Pagination, {
    count: nbPages,
    page,
    onChange: pageChange,
    showFirstButton: true,
    showLastButton: true
  });
  return /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(InfoCard, {
    title: `${memberDisplayTitle} (${(members == null ? void 0 : members.length) || 0}${paginationLabel})`,
    subheader: `of ${displayName}`,
    ...nbPages <= 1 ? {} : { actions: pagination }
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 3
  }, members && members.length > 0 ? members.slice(pageSize * (page - 1), pageSize * page).map((member) => /* @__PURE__ */ React.createElement(MemberComponent, {
    member,
    key: member.metadata.uid
  })) : /* @__PURE__ */ React.createElement(Box, {
    p: 2
  }, /* @__PURE__ */ React.createElement(Typography, null, "This group has no ", memberDisplayTitle.toLocaleLowerCase(), ".")))));
};

const CardTitle$1 = (props) => /* @__PURE__ */ React.createElement(Box, {
  display: "flex",
  alignItems: "center"
}, /* @__PURE__ */ React.createElement(GroupIcon, {
  fontSize: "inherit"
}), /* @__PURE__ */ React.createElement(Box, {
  ml: 1
}, props.title));
const GroupProfileCard = (props) => {
  var _a, _b;
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);
  const { entity: group } = useEntity();
  const refreshEntity = useCallback(async () => {
    await catalogApi.refreshEntity(stringifyEntityRef(group));
    alertApi.post({ message: "Refresh scheduled", severity: "info" });
  }, [catalogApi, alertApi, group]);
  if (!group) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Group not found");
  }
  const {
    metadata: { name, description, annotations },
    spec: { profile }
  } = group;
  const childRelations = getEntityRelations(group, RELATION_PARENT_OF, {
    kind: "Group"
  });
  const parentRelations = getEntityRelations(group, RELATION_CHILD_OF, {
    kind: "group"
  });
  const entityLocation = annotations == null ? void 0 : annotations[ANNOTATION_LOCATION];
  const allowRefresh = (entityLocation == null ? void 0 : entityLocation.startsWith("url:")) || (entityLocation == null ? void 0 : entityLocation.startsWith("file:"));
  const entityMetadataEditUrl = (_a = group.metadata.annotations) == null ? void 0 : _a[ANNOTATION_EDIT_URL];
  const displayName = (_b = profile == null ? void 0 : profile.displayName) != null ? _b : name;
  const emailHref = (profile == null ? void 0 : profile.email) ? `mailto:${profile.email}` : "#";
  const infoCardAction = entityMetadataEditUrl ? /* @__PURE__ */ React.createElement(IconButton, {
    "aria-label": "Edit",
    title: "Edit Metadata",
    component: Link,
    to: entityMetadataEditUrl
  }, /* @__PURE__ */ React.createElement(EditIcon, null)) : /* @__PURE__ */ React.createElement(IconButton, {
    "aria-label": "Edit",
    disabled: true,
    title: "Edit Metadata"
  }, /* @__PURE__ */ React.createElement(EditIcon, null));
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: /* @__PURE__ */ React.createElement(CardTitle$1, {
      title: displayName
    }),
    subheader: description,
    variant: props.variant,
    action: /* @__PURE__ */ React.createElement(React.Fragment, null, allowRefresh && /* @__PURE__ */ React.createElement(IconButton, {
      "aria-label": "Refresh",
      title: "Schedule entity refresh",
      onClick: refreshEntity
    }, /* @__PURE__ */ React.createElement(CachedIcon, null)), infoCardAction)
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 3
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    sm: 2,
    xl: 1
  }, /* @__PURE__ */ React.createElement(Avatar, {
    displayName,
    picture: profile == null ? void 0 : profile.picture
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 10,
    xl: 11
  }, /* @__PURE__ */ React.createElement(List, null, (profile == null ? void 0 : profile.email) && /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(Tooltip, {
    title: "Email"
  }, /* @__PURE__ */ React.createElement(EmailIcon, null))), /* @__PURE__ */ React.createElement(ListItemText, null, /* @__PURE__ */ React.createElement(Link, {
    to: emailHref
  }, profile.email))), parentRelations.length ? /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(Tooltip, {
    title: "Parent Group"
  }, /* @__PURE__ */ React.createElement(AccountTreeIcon, null))), /* @__PURE__ */ React.createElement(ListItemText, null, /* @__PURE__ */ React.createElement(EntityRefLinks, {
    entityRefs: parentRelations,
    defaultKind: "Group"
  }))) : null, childRelations.length ? /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(Tooltip, {
    title: "Child Groups"
  }, /* @__PURE__ */ React.createElement(GroupIcon, null))), /* @__PURE__ */ React.createElement(ListItemText, null, /* @__PURE__ */ React.createElement(EntityRefLinks, {
    entityRefs: childRelations,
    defaultKind: "Group"
  }))) : null))));
};

const CardTitle = (props) => props.title ? /* @__PURE__ */ React.createElement(Box, {
  display: "flex",
  alignItems: "center"
}, /* @__PURE__ */ React.createElement(PersonIcon, {
  fontSize: "inherit"
}), /* @__PURE__ */ React.createElement(Box, {
  ml: 1
}, props.title)) : null;
const UserProfileCard = (props) => {
  var _a;
  const { entity: user } = useEntity();
  if (!user) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "User not found");
  }
  const {
    metadata: { name: metaName, description },
    spec: { profile }
  } = user;
  const displayName = (_a = profile == null ? void 0 : profile.displayName) != null ? _a : metaName;
  const emailHref = (profile == null ? void 0 : profile.email) ? `mailto:${profile.email}` : void 0;
  const memberOfRelations = getEntityRelations(user, RELATION_MEMBER_OF, {
    kind: "Group"
  });
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: /* @__PURE__ */ React.createElement(CardTitle, {
      title: displayName
    }),
    subheader: description,
    variant: props.variant
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 3,
    alignItems: "flex-start"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    sm: 2,
    xl: 1
  }, /* @__PURE__ */ React.createElement(Avatar, {
    displayName,
    picture: profile == null ? void 0 : profile.picture
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 10,
    xl: 11
  }, /* @__PURE__ */ React.createElement(List, null, (profile == null ? void 0 : profile.email) && /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(Tooltip, {
    title: "Email"
  }, /* @__PURE__ */ React.createElement(EmailIcon, null))), /* @__PURE__ */ React.createElement(ListItemText, null, /* @__PURE__ */ React.createElement(Link, {
    to: emailHref != null ? emailHref : ""
  }, profile.email))), /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(Tooltip, {
    title: "Member of"
  }, /* @__PURE__ */ React.createElement(GroupIcon, null))), /* @__PURE__ */ React.createElement(ListItemText, null, /* @__PURE__ */ React.createElement(EntityRefLinks, {
    entityRefs: memberOfRelations,
    defaultKind: "Group"
  })))))));
};

const limiter = limiterFactory(10);
const getQueryParams = (ownersEntityRef, selectedEntity) => {
  const { kind, type } = selectedEntity;
  const owners = ownersEntityRef.map((owner) => humanizeEntityRef(parseEntityRef(owner), { defaultKind: "group" }));
  const filters = {
    kind,
    type,
    owners,
    user: "all"
  };
  return qs.stringify({ filters }, { arrayFormat: "repeat" });
};
const getOwnersEntityRef = (owner) => {
  let owners = [stringifyEntityRef(owner)];
  if (owner.kind === "User") {
    const ownerGroups = getEntityRelations(owner, RELATION_MEMBER_OF, {
      kind: "Group"
    });
    const ownerGroupsName = ownerGroups.map((ownerGroup) => stringifyEntityRef({
      kind: ownerGroup.kind,
      namespace: ownerGroup.namespace,
      name: ownerGroup.name
    }));
    owners = [...owners, ...ownerGroupsName];
  }
  return owners;
};
const getAggregatedOwnersEntityRef = async (parentGroup, catalogApi) => {
  const requestedEntities = [];
  const outstandingEntities = /* @__PURE__ */ new Map();
  const processedEntities = /* @__PURE__ */ new Set();
  requestedEntities.push(parentGroup);
  let currentEntity = parentGroup;
  while (requestedEntities.length > 0) {
    const childRelations = getEntityRelations(currentEntity, RELATION_PARENT_OF, {
      kind: "Group"
    });
    await Promise.all(childRelations.map((childGroup) => limiter(async () => {
      const promise = catalogApi.getEntityByRef(childGroup);
      outstandingEntities.set(childGroup.name, promise);
      try {
        const processedEntity = await promise;
        if (processedEntity) {
          requestedEntities.push(processedEntity);
        }
      } finally {
        outstandingEntities.delete(childGroup.name);
      }
    })));
    requestedEntities.shift();
    processedEntities.add(stringifyEntityRef({
      kind: currentEntity.kind,
      namespace: currentEntity.metadata.namespace,
      name: currentEntity.metadata.name
    }));
    currentEntity = requestedEntities[0];
  }
  return Array.from(processedEntities);
};
function useGetEntities(entity, relationsType, isGroup, entityFilterKind) {
  const catalogApi = useApi(catalogApiRef);
  const kinds = entityFilterKind != null ? entityFilterKind : ["Component", "API", "System"];
  const {
    loading,
    error,
    value: componentsWithCounters
  } = useAsync(async () => {
    const owners = relationsType === "aggregated" && isGroup ? await getAggregatedOwnersEntityRef(entity, catalogApi) : getOwnersEntityRef(entity);
    const ownedEntitiesList = await catalogApi.getEntities({
      filter: [
        {
          kind: kinds,
          "relations.ownedBy": owners
        }
      ],
      fields: [
        "kind",
        "metadata.name",
        "metadata.namespace",
        "spec.type",
        "relations"
      ]
    });
    const counts = ownedEntitiesList.items.reduce((acc, ownedEntity) => {
      var _a, _b, _c;
      const match = acc.find((x) => {
        var _a2, _b2;
        return x.kind === ownedEntity.kind && x.type === ((_b2 = (_a2 = ownedEntity.spec) == null ? void 0 : _a2.type) != null ? _b2 : ownedEntity.kind);
      });
      if (match) {
        match.count += 1;
      } else {
        acc.push({
          kind: ownedEntity.kind,
          type: (_c = (_b = (_a = ownedEntity.spec) == null ? void 0 : _a.type) == null ? void 0 : _b.toString()) != null ? _c : ownedEntity.kind,
          count: 1
        });
      }
      return acc;
    }, []);
    const topN = counts.sort((a, b) => b.count - a.count).slice(0, 6);
    return topN.map((topOwnedEntity) => ({
      counter: topOwnedEntity.count,
      type: topOwnedEntity.type,
      name: topOwnedEntity.type.toLocaleUpperCase("en-US"),
      queryParams: getQueryParams(owners, topOwnedEntity)
    }));
  }, [catalogApi, entity, relationsType]);
  return {
    componentsWithCounters,
    loading,
    error
  };
}

const useStyles$1 = makeStyles((theme) => createStyles({
  card: {
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[2],
    borderRadius: "4px",
    padding: theme.spacing(2),
    color: "#fff",
    transition: `${theme.transitions.duration.standard}ms`,
    "&:hover": {
      boxShadow: theme.shadows[4]
    }
  },
  bold: {
    fontWeight: theme.typography.fontWeightBold
  },
  entityTypeBox: {
    background: (props) => theme.getPageTheme({ themeId: props.type }).backgroundImage
  }
}));
const EntityCountTile = ({
  counter,
  type,
  name,
  url
}) => {
  const classes = useStyles$1({ type });
  return /* @__PURE__ */ React.createElement(Link, {
    to: url,
    variant: "body2"
  }, /* @__PURE__ */ React.createElement(Box, {
    className: `${classes.card} ${classes.entityTypeBox}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Typography, {
    className: classes.bold,
    variant: "h6"
  }, counter), /* @__PURE__ */ React.createElement(Typography, {
    className: classes.bold,
    variant: "h6"
  }, pluralize(name, counter))));
};
const ComponentsGrid = ({
  entity,
  relationsType,
  isGroup,
  entityFilterKind
}) => {
  const catalogLink = useRouteRef(catalogIndexRouteRef);
  const { componentsWithCounters, loading, error } = useGetEntities(entity, relationsType, isGroup, entityFilterKind);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error
    });
  }
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true
  }, componentsWithCounters == null ? void 0 : componentsWithCounters.map((c) => /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 6,
    md: 6,
    lg: 4,
    key: c.name
  }, /* @__PURE__ */ React.createElement(EntityCountTile, {
    counter: c.counter,
    type: c.type,
    name: c.name,
    url: `${catalogLink()}/?${c.queryParams}`
  }))));
};

const useStyles = makeStyles((theme) => ({
  list: {
    [theme.breakpoints.down("xs")]: {
      padding: `0 0 12px`
    }
  },
  listItemText: {
    [theme.breakpoints.down("xs")]: {
      paddingRight: 0,
      paddingLeft: 0
    }
  },
  listItemSecondaryAction: {
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      top: "auto",
      right: "auto",
      position: "relative",
      transform: "unset"
    }
  }
}));
const OwnershipCard = (props) => {
  const { variant, entityFilterKind, hideRelationsToggle, relationsType } = props;
  const relationsToggle = hideRelationsToggle === void 0 ? false : hideRelationsToggle;
  const classes = useStyles();
  const { entity } = useEntity();
  const isGroup = entity.kind === "Group";
  const [getRelationsType, setRelationsType] = useState(relationsType || "direct");
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: "Ownership",
    variant
  }, !relationsToggle && /* @__PURE__ */ React.createElement(List, {
    dense: true
  }, /* @__PURE__ */ React.createElement(ListItem, {
    className: classes.list
  }, /* @__PURE__ */ React.createElement(ListItemText, {
    className: classes.listItemText
  }), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, {
    className: classes.listItemSecondaryAction
  }, "Direct Relations", /* @__PURE__ */ React.createElement(Tooltip, {
    placement: "top",
    arrow: true,
    title: `${getRelationsType === "direct" ? "Direct" : "Aggregated"} Relations`
  }, /* @__PURE__ */ React.createElement(Switch, {
    color: "primary",
    checked: getRelationsType !== "direct",
    onChange: () => getRelationsType === "direct" ? setRelationsType("aggregated") : setRelationsType("direct"),
    name: "pin",
    inputProps: { "aria-label": "Ownership Type Switch" },
    disabled: !isGroup
  })), "Aggregated Relations"))), /* @__PURE__ */ React.createElement(ComponentsGrid, {
    entity,
    relationsType: getRelationsType,
    isGroup,
    entityFilterKind
  }));
};

const MyGroupsSidebarItem = (props) => {
  const { singularTitle, pluralTitle, icon, filter } = props;
  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);
  const catalogEntityRoute = useRouteRef(entityRouteRef);
  const { value: groups } = useAsync(async () => {
    const profile = await identityApi.getBackstageIdentity();
    const response = await catalogApi.getEntities({
      filter: [
        {
          kind: "group",
          "relations.hasMember": profile.userEntityRef,
          ...filter != null ? filter : {}
        }
      ],
      fields: ["metadata", "kind"]
    });
    return response.items;
  }, []);
  if (!(groups == null ? void 0 : groups.length)) {
    return null;
  }
  if (groups.length === 1) {
    const group = groups[0];
    return /* @__PURE__ */ React.createElement(SidebarItem, {
      text: singularTitle,
      to: catalogEntityRoute(getCompoundEntityRef(group)),
      icon
    });
  }
  return /* @__PURE__ */ React.createElement(SidebarItem, {
    icon,
    text: pluralTitle
  }, /* @__PURE__ */ React.createElement(SidebarSubmenu, {
    title: pluralTitle
  }, groups == null ? void 0 : groups.map(function groupsMap(group) {
    return /* @__PURE__ */ React.createElement(SidebarSubmenuItem, {
      title: group.metadata.title || humanizeEntityRef(group, { defaultKind: "group" }),
      to: catalogEntityRoute(getCompoundEntityRef(group)),
      icon,
      key: stringifyEntityRef(group)
    });
  })));
};

export { EntityGroupProfileCard, EntityMembersListCard, EntityOwnershipCard, EntityUserProfileCard, GroupProfileCard, MembersListCard, MyGroupsSidebarItem, OwnershipCard, UserProfileCard, orgPlugin, orgPlugin as plugin };
//# sourceMappingURL=index.esm.js.map
