import React, { Suspense } from 'react';
import { useOutlet } from 'react-router';
import { PageWithHeader, Content, ContentHeader, CreateButton, SupportButton, CodeSnippet, TabbedCard, CardTab, Progress, InfoCard, WarningPanel, Link } from '@backstage/core-components';
import { createRouteRef, createExternalRouteRef, useApi, configApiRef, useRouteRef, createApiRef, createPlugin, createApiFactory, createRoutableExtension, createComponentExtension } from '@backstage/core-plugin-api';
import { CatalogTable } from '@backstage/plugin-catalog';
import { EntityListProvider, CatalogFilterLayout, EntityKindPicker, EntityTypePicker, UserListPicker, EntityOwnerPicker, EntityLifecyclePicker, EntityTagPicker, useEntity, EntityTable, useRelatedEntities } from '@backstage/plugin-catalog-react';
import { Alert } from '@material-ui/lab';
import { useTheme } from '@material-ui/core/styles';
import { RELATION_CONSUMES_API, RELATION_HAS_PART, RELATION_PROVIDES_API, RELATION_API_CONSUMED_BY, RELATION_API_PROVIDED_BY } from '@backstage/catalog-model';
import { Typography } from '@material-ui/core';

const rootRoute = createRouteRef({
  id: "api-docs"
});
const registerComponentRouteRef = createExternalRouteRef({
  id: "register-component",
  optional: true
});

const defaultColumns = [
  CatalogTable.columns.createNameColumn({ defaultKind: "API" }),
  CatalogTable.columns.createSystemColumn(),
  CatalogTable.columns.createOwnerColumn(),
  CatalogTable.columns.createSpecTypeColumn(),
  CatalogTable.columns.createSpecLifecycleColumn(),
  CatalogTable.columns.createMetadataDescriptionColumn(),
  CatalogTable.columns.createTagsColumn()
];
const DefaultApiExplorerPage = ({
  initiallySelectedFilter = "all",
  columns,
  actions
}) => {
  var _a;
  const configApi = useApi(configApiRef);
  const generatedSubtitle = `${(_a = configApi.getOptionalString("organization.name")) != null ? _a : "Backstage"} API Explorer`;
  const registerComponentLink = useRouteRef(registerComponentRouteRef);
  return /* @__PURE__ */ React.createElement(PageWithHeader, {
    themeId: "apis",
    title: "APIs",
    subtitle: generatedSubtitle,
    pageTitleOverride: "APIs"
  }, /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: ""
  }, /* @__PURE__ */ React.createElement(CreateButton, {
    title: "Register Existing API",
    to: registerComponentLink == null ? void 0 : registerComponentLink()
  }), /* @__PURE__ */ React.createElement(SupportButton, null, "All your APIs")), /* @__PURE__ */ React.createElement(EntityListProvider, null, /* @__PURE__ */ React.createElement(CatalogFilterLayout, null, /* @__PURE__ */ React.createElement(CatalogFilterLayout.Filters, null, /* @__PURE__ */ React.createElement(EntityKindPicker, {
    initialFilter: "api",
    hidden: true
  }), /* @__PURE__ */ React.createElement(EntityTypePicker, null), /* @__PURE__ */ React.createElement(UserListPicker, {
    initialFilter: initiallySelectedFilter
  }), /* @__PURE__ */ React.createElement(EntityOwnerPicker, null), /* @__PURE__ */ React.createElement(EntityLifecyclePicker, null), /* @__PURE__ */ React.createElement(EntityTagPicker, null)), /* @__PURE__ */ React.createElement(CatalogFilterLayout.Content, null, /* @__PURE__ */ React.createElement(CatalogTable, {
    columns: columns || defaultColumns,
    actions
  }))))));
};

const ApiExplorerPage$1 = (props) => {
  const outlet = useOutlet();
  return outlet || /* @__PURE__ */ React.createElement(DefaultApiExplorerPage, {
    ...props
  });
};

const apiDocsConfigRef = createApiRef({
  id: "plugin.api-docs.config"
});

const PlainApiDefinitionWidget = (props) => {
  return /* @__PURE__ */ React.createElement(CodeSnippet, {
    text: props.definition,
    language: props.language,
    showCopyCodeButton: true
  });
};

const ApiDefinitionCard = () => {
  var _a;
  const { entity } = useEntity();
  const config = useApi(apiDocsConfigRef);
  const { getApiDefinitionWidget } = config;
  if (!entity) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Could not fetch the API");
  }
  const definitionWidget = getApiDefinitionWidget(entity);
  const entityTitle = (_a = entity.metadata.title) != null ? _a : entity.metadata.name;
  if (definitionWidget) {
    return /* @__PURE__ */ React.createElement(TabbedCard, {
      title: entityTitle
    }, /* @__PURE__ */ React.createElement(CardTab, {
      label: definitionWidget.title,
      key: "widget"
    }, definitionWidget.component(entity.spec.definition)), /* @__PURE__ */ React.createElement(CardTab, {
      label: "Raw",
      key: "raw"
    }, /* @__PURE__ */ React.createElement(PlainApiDefinitionWidget, {
      definition: entity.spec.definition,
      language: definitionWidget.rawLanguage || entity.spec.type
    })));
  }
  return /* @__PURE__ */ React.createElement(TabbedCard, {
    title: entityTitle,
    children: [
      /* @__PURE__ */ React.createElement(CardTab, {
        label: entity.spec.type,
        key: "raw"
      }, /* @__PURE__ */ React.createElement(PlainApiDefinitionWidget, {
        definition: entity.spec.definition,
        language: entity.spec.type
      }))
    ]
  });
};

const LazyAsyncApiDefinition = React.lazy(() => import('./esm/AsyncApiDefinition-2cfdacde.esm.js').then((m) => ({
  default: m.AsyncApiDefinition
})));
const AsyncApiDefinitionWidget = (props) => {
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement(Progress, null)
  }, /* @__PURE__ */ React.createElement(LazyAsyncApiDefinition, {
    ...props
  }));
};

const LazyGraphQlDefinition = React.lazy(() => import('./esm/GraphQlDefinition-b8afc092.esm.js').then((m) => ({
  default: m.GraphQlDefinition
})));
const GraphQlDefinitionWidget = (props) => {
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement(Progress, null)
  }, /* @__PURE__ */ React.createElement(LazyGraphQlDefinition, {
    ...props
  }));
};

const LazyOpenApiDefinition = React.lazy(() => import('./esm/OpenApiDefinition-ecf6e13e.esm.js').then((m) => ({
  default: m.OpenApiDefinition
})));
const OpenApiDefinitionWidget = (props) => {
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement(Progress, null)
  }, /* @__PURE__ */ React.createElement(LazyOpenApiDefinition, {
    ...props
  }));
};

const GrpcApiDefinitionWidget = (props) => {
  const theme = useTheme();
  return /* @__PURE__ */ React.createElement(CodeSnippet, {
    customStyle: { backgroundColor: theme.palette.background.default },
    text: props.definition,
    language: "protobuf",
    showCopyCodeButton: true
  });
};

function defaultDefinitionWidgets() {
  return [
    {
      type: "openapi",
      title: "OpenAPI",
      rawLanguage: "yaml",
      component: (definition) => /* @__PURE__ */ React.createElement(OpenApiDefinitionWidget, {
        definition
      })
    },
    {
      type: "asyncapi",
      title: "AsyncAPI",
      rawLanguage: "yaml",
      component: (definition) => /* @__PURE__ */ React.createElement(AsyncApiDefinitionWidget, {
        definition
      })
    },
    {
      type: "graphql",
      title: "GraphQL",
      rawLanguage: "graphql",
      component: (definition) => /* @__PURE__ */ React.createElement(GraphQlDefinitionWidget, {
        definition
      })
    },
    {
      type: "grpc",
      title: "gRPC",
      component: (definition) => /* @__PURE__ */ React.createElement(GrpcApiDefinitionWidget, {
        definition
      })
    }
  ];
}

const ApiTypeTitle = ({ apiEntity }) => {
  const config = useApi(apiDocsConfigRef);
  const definition = config.getApiDefinitionWidget(apiEntity);
  const type = definition ? definition.title : apiEntity.spec.type;
  return /* @__PURE__ */ React.createElement("span", null, type);
};

function createSpecApiTypeColumn() {
  return {
    title: "Type",
    field: "spec.type",
    render: (entity) => /* @__PURE__ */ React.createElement(ApiTypeTitle, {
      apiEntity: entity
    })
  };
}
const apiEntityColumns = [
  EntityTable.columns.createEntityRefColumn({ defaultKind: "API" }),
  EntityTable.columns.createSystemColumn(),
  EntityTable.columns.createOwnerColumn(),
  createSpecApiTypeColumn(),
  EntityTable.columns.createSpecLifecycleColumn(),
  EntityTable.columns.createMetadataDescriptionColumn()
];

const ConsumedApisCard = ({ variant = "gridItem" }) => {
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: RELATION_CONSUMES_API
  });
  if (loading) {
    return /* @__PURE__ */ React.createElement(InfoCard, {
      variant,
      title: "Consumed APIs"
    }, /* @__PURE__ */ React.createElement(Progress, null));
  }
  if (error || !entities) {
    return /* @__PURE__ */ React.createElement(InfoCard, {
      variant,
      title: "Consumed APIs"
    }, /* @__PURE__ */ React.createElement(WarningPanel, {
      severity: "error",
      title: "Could not load APIs",
      message: /* @__PURE__ */ React.createElement(CodeSnippet, {
        text: `${error}`,
        language: "text"
      })
    }));
  }
  return /* @__PURE__ */ React.createElement(EntityTable, {
    title: "Consumed APIs",
    variant,
    emptyContent: /* @__PURE__ */ React.createElement("div", {
      style: { textAlign: "center" }
    }, /* @__PURE__ */ React.createElement(Typography, {
      variant: "body1"
    }, "This ", entity.kind.toLocaleLowerCase("en-US"), " does not consume any APIs."), /* @__PURE__ */ React.createElement(Typography, {
      variant: "body2"
    }, /* @__PURE__ */ React.createElement(Link, {
      to: "https://backstage.io/docs/features/software-catalog/descriptor-format#specconsumesapis-optional"
    }, "Learn how to change this."))),
    columns: apiEntityColumns,
    entities
  });
};

const columns = [
  EntityTable.columns.createEntityRefColumn({ defaultKind: "API" }),
  EntityTable.columns.createOwnerColumn(),
  createSpecApiTypeColumn(),
  EntityTable.columns.createSpecLifecycleColumn(),
  EntityTable.columns.createMetadataDescriptionColumn()
];
const HasApisCard = ({ variant = "gridItem" }) => {
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: RELATION_HAS_PART,
    kind: "API"
  });
  if (loading) {
    return /* @__PURE__ */ React.createElement(InfoCard, {
      variant,
      title: "APIs"
    }, /* @__PURE__ */ React.createElement(Progress, null));
  }
  if (error || !entities) {
    return /* @__PURE__ */ React.createElement(InfoCard, {
      variant,
      title: "APIs"
    }, /* @__PURE__ */ React.createElement(WarningPanel, {
      severity: "error",
      title: "Could not load APIs",
      message: /* @__PURE__ */ React.createElement(CodeSnippet, {
        text: `${error}`,
        language: "text"
      })
    }));
  }
  return /* @__PURE__ */ React.createElement(EntityTable, {
    title: "APIs",
    variant,
    emptyContent: /* @__PURE__ */ React.createElement("div", {
      style: { textAlign: "center" }
    }, /* @__PURE__ */ React.createElement(Typography, {
      variant: "body1"
    }, "This ", entity.kind.toLocaleLowerCase("en-US"), " does not contain any APIs."), /* @__PURE__ */ React.createElement(Typography, {
      variant: "body2"
    }, /* @__PURE__ */ React.createElement(Link, {
      to: "https://backstage.io/docs/features/software-catalog/descriptor-format#kind-api"
    }, "Learn how to change this."))),
    columns,
    entities
  });
};

const ProvidedApisCard = ({ variant = "gridItem" }) => {
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: RELATION_PROVIDES_API
  });
  if (loading) {
    return /* @__PURE__ */ React.createElement(InfoCard, {
      variant,
      title: "Provided APIs"
    }, /* @__PURE__ */ React.createElement(Progress, null));
  }
  if (error || !entities) {
    return /* @__PURE__ */ React.createElement(InfoCard, {
      variant,
      title: "Provided APIs"
    }, /* @__PURE__ */ React.createElement(WarningPanel, {
      severity: "error",
      title: "Could not load APIs",
      message: /* @__PURE__ */ React.createElement(CodeSnippet, {
        text: `${error}`,
        language: "text"
      })
    }));
  }
  return /* @__PURE__ */ React.createElement(EntityTable, {
    title: "Provided APIs",
    variant,
    emptyContent: /* @__PURE__ */ React.createElement("div", {
      style: { textAlign: "center" }
    }, /* @__PURE__ */ React.createElement(Typography, {
      variant: "body1"
    }, "This ", entity.kind.toLocaleLowerCase("en-US"), " does not provide any APIs."), /* @__PURE__ */ React.createElement(Typography, {
      variant: "body2"
    }, /* @__PURE__ */ React.createElement(Link, {
      to: "https://backstage.io/docs/features/software-catalog/descriptor-format#specprovidesapis-optional"
    }, "Learn how to change this."))),
    columns: apiEntityColumns,
    entities
  });
};

const ConsumingComponentsCard = ({ variant = "gridItem" }) => {
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: RELATION_API_CONSUMED_BY
  });
  if (loading) {
    return /* @__PURE__ */ React.createElement(InfoCard, {
      variant,
      title: "Consumers"
    }, /* @__PURE__ */ React.createElement(Progress, null));
  }
  if (error || !entities) {
    return /* @__PURE__ */ React.createElement(InfoCard, {
      variant,
      title: "Consumers"
    }, /* @__PURE__ */ React.createElement(WarningPanel, {
      severity: "error",
      title: "Could not load components",
      message: /* @__PURE__ */ React.createElement(CodeSnippet, {
        text: `${error}`,
        language: "text"
      })
    }));
  }
  return /* @__PURE__ */ React.createElement(EntityTable, {
    title: "Consumers",
    variant,
    emptyContent: /* @__PURE__ */ React.createElement("div", {
      style: { textAlign: "center" }
    }, /* @__PURE__ */ React.createElement(Typography, {
      variant: "body1"
    }, "No component consumes this API."), /* @__PURE__ */ React.createElement(Typography, {
      variant: "body2"
    }, /* @__PURE__ */ React.createElement(Link, {
      to: "https://backstage.io/docs/features/software-catalog/descriptor-format#specconsumesapis-optional"
    }, "Learn how to change this."))),
    columns: EntityTable.componentEntityColumns,
    entities
  });
};

const ProvidingComponentsCard = ({ variant = "gridItem" }) => {
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: RELATION_API_PROVIDED_BY
  });
  if (loading) {
    return /* @__PURE__ */ React.createElement(InfoCard, {
      variant,
      title: "Providers"
    }, /* @__PURE__ */ React.createElement(Progress, null));
  }
  if (error || !entities) {
    return /* @__PURE__ */ React.createElement(InfoCard, {
      variant,
      title: "Providers"
    }, /* @__PURE__ */ React.createElement(WarningPanel, {
      severity: "error",
      title: "Could not load components",
      message: /* @__PURE__ */ React.createElement(CodeSnippet, {
        text: `${error}`,
        language: "text"
      })
    }));
  }
  return /* @__PURE__ */ React.createElement(EntityTable, {
    title: "Providers",
    variant,
    emptyContent: /* @__PURE__ */ React.createElement("div", {
      style: { textAlign: "center" }
    }, /* @__PURE__ */ React.createElement(Typography, {
      variant: "body1"
    }, "No component provides this API."), /* @__PURE__ */ React.createElement(Typography, {
      variant: "body2"
    }, /* @__PURE__ */ React.createElement(Link, {
      to: "https://backstage.io/docs/features/software-catalog/descriptor-format#specprovidesapis-optional"
    }, "Learn how to change this."))),
    columns: EntityTable.componentEntityColumns,
    entities
  });
};

const apiDocsPlugin = createPlugin({
  id: "api-docs",
  routes: {
    root: rootRoute
  },
  apis: [
    createApiFactory({
      api: apiDocsConfigRef,
      deps: {},
      factory: () => {
        const definitionWidgets = defaultDefinitionWidgets();
        return {
          getApiDefinitionWidget: (apiEntity) => {
            return definitionWidgets.find((d) => d.type === apiEntity.spec.type);
          }
        };
      }
    })
  ],
  externalRoutes: {
    registerApi: registerComponentRouteRef
  }
});
const ApiExplorerPage = apiDocsPlugin.provide(createRoutableExtension({
  name: "ApiExplorerPage",
  component: () => import('./esm/index-e2729792.esm.js').then((m) => m.ApiExplorerIndexPage),
  mountPoint: rootRoute
}));
const EntityApiDefinitionCard = apiDocsPlugin.provide(createComponentExtension({
  name: "EntityApiDefinitionCard",
  component: {
    lazy: () => import('./esm/index-e47c01a9.esm.js').then((m) => m.ApiDefinitionCard)
  }
}));
const EntityConsumedApisCard = apiDocsPlugin.provide(createComponentExtension({
  name: "EntityConsumedApisCard",
  component: {
    lazy: () => import('./esm/index-bd1ed3f5.esm.js').then((m) => m.ConsumedApisCard)
  }
}));
const EntityConsumingComponentsCard = apiDocsPlugin.provide(createComponentExtension({
  name: "EntityConsumingComponentsCard",
  component: {
    lazy: () => import('./esm/index-993610e9.esm.js').then((m) => m.ConsumingComponentsCard)
  }
}));
const EntityProvidedApisCard = apiDocsPlugin.provide(createComponentExtension({
  name: "EntityProvidedApisCard",
  component: {
    lazy: () => import('./esm/index-bd1ed3f5.esm.js').then((m) => m.ProvidedApisCard)
  }
}));
const EntityProvidingComponentsCard = apiDocsPlugin.provide(createComponentExtension({
  name: "EntityProvidingComponentsCard",
  component: {
    lazy: () => import('./esm/index-993610e9.esm.js').then((m) => m.ProvidingComponentsCard)
  }
}));
const EntityHasApisCard = apiDocsPlugin.provide(createComponentExtension({
  name: "EntityHasApisCard",
  component: {
    lazy: () => import('./esm/index-bd1ed3f5.esm.js').then((m) => m.HasApisCard)
  }
}));

export { ApiDefinitionCard, ApiExplorerPage$1 as ApiExplorerIndexPage, ApiExplorerPage, ApiTypeTitle, AsyncApiDefinitionWidget, ConsumedApisCard, ConsumingComponentsCard, DefaultApiExplorerPage, EntityApiDefinitionCard, EntityConsumedApisCard, EntityConsumingComponentsCard, EntityHasApisCard, EntityProvidedApisCard, EntityProvidingComponentsCard, GraphQlDefinitionWidget, HasApisCard, OpenApiDefinitionWidget, PlainApiDefinitionWidget, ProvidedApisCard, ProvidingComponentsCard, apiDocsConfigRef, apiDocsPlugin, defaultDefinitionWidgets, apiDocsPlugin as plugin };
//# sourceMappingURL=index.esm.js.map
