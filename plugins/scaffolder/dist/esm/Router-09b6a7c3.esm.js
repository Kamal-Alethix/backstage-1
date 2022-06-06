import React, { useState, useContext, useCallback, createContext, useEffect, useRef, useMemo, Children, Component, Fragment } from 'react';
import { useNavigate, Navigate, useOutlet, Routes, Route } from 'react-router';
import { ItemCardHeader, MarkdownContent, Button, ContentHeader, Progress, WarningPanel, Link as Link$1, Content, ItemCardGrid, Page, Header, CreateButton, SupportButton, StructuredMetadataTable, InfoCard, ErrorPage, ErrorPanel, LogViewer, StatusError, StatusOK, StatusPending, Lifecycle, EmptyState } from '@backstage/core-components';
import { useRouteRef, useApi, errorApiRef, featureFlagsApiRef, useApiHolder, alertApiRef, useElementFilter } from '@backstage/core-plugin-api';
import { getEntityRelations, getEntitySourceLocation, FavoriteEntity, EntityRefLinks, useEntityList, EntityListProvider, CatalogFilterLayout, EntitySearchBar, EntityKindPicker, UserListPicker, EntityTagPicker, catalogApiRef, humanizeEntityRef, EntityRefLink } from '@backstage/plugin-catalog-react';
import { s as selectedTemplateRouteRef, e as editRouteRef, a as actionsRouteRef, b as scaffolderListTaskRouteRef, r as registerComponentRouteRef, T as TemplateTypePicker, S as SecretsContext, c as scaffolderApiRef, d as scaffolderTaskRouteRef, f as rootRouteRef, g as TaskStatusStepper, h as TaskPageLinks, F as FIELD_EXTENSION_WRAPPER_KEY, i as FIELD_EXTENSION_KEY, j as SecretsContextProvider, k as TaskPage } from './index-b64713a1.esm.js';
import { RELATION_OWNED_BY, stringifyEntityRef, parseEntityRef } from '@backstage/catalog-model';
import { makeStyles, useTheme, Card, CardMedia, CardContent, Box, Typography, Chip, CardActions, IconButton, Tooltip, Link, Stepper, Step, StepLabel, StepContent, Button as Button$1, Paper, LinearProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Divider as Divider$1, FormControl, InputLabel, Select, MenuItem as MenuItem$1, List as List$2, ListItemIcon as ListItemIcon$1, ListItemText as ListItemText$1 } from '@material-ui/core';
import { scmIntegrationsApiRef, ScmIntegrationIcon } from '@backstage/integration-react';
import WarningIcon from '@material-ui/icons/Warning';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common';
import { usePermission } from '@backstage/plugin-permission-react';
import IconButton$1 from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import { makeStyles as makeStyles$1 } from '@material-ui/core/styles';
import Description from '@material-ui/icons/Description';
import Edit from '@material-ui/icons/Edit';
import List from '@material-ui/icons/List';
import MoreVert from '@material-ui/icons/MoreVert';
import qs from 'qs';
import { useParams } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import { withTheme } from '@rjsf/core';
import { Theme } from '@rjsf/material-ui';
import cloneDeep from 'lodash/cloneDeep';
import classNames from 'classnames';
import Card$1 from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent$1 from '@material-ui/core/CardContent';
import Tooltip$1 from '@material-ui/core/Tooltip';
import Typography$1 from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { useAsync as useAsync$1, useRerender, usePrevious, useKeyboardEvent } from '@react-hookz/web';
import yaml from 'yaml';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon$1 from '@material-ui/icons/ExpandLess';
import List$1 from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Cancel from '@material-ui/icons/Cancel';
import Check from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import { StreamLanguage } from '@codemirror/language';
import { yaml as yaml$1 } from '@codemirror/legacy-modes/mode/yaml';
import Box$1 from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import CodeMirror from '@uiw/react-codemirror';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import useDebounce from 'react-use/lib/useDebounce';
import { showPanel } from '@codemirror/view';
import MaterialTable from '@material-table/core';
import SettingsIcon from '@material-ui/icons/Settings';
import AllIcon from '@material-ui/icons/FontDownload';
import { DateTime, Interval } from 'luxon';
import humanizeDuration from 'humanize-duration';
import { D as DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS } from './default-554cb9ad.esm.js';
import '@backstage/errors';
import 'zen-observable';
import '@material-ui/core/FormControl';
import '@material-ui/lab/Autocomplete';
import 'react-use/lib/useEffectOnce';
import '@material-ui/lab';
import '@material-ui/core/FormHelperText';
import '@material-ui/core/Input';
import '@material-ui/core/InputLabel';
import 'lodash/capitalize';
import '@material-ui/icons/CheckBox';
import '@material-ui/icons/CheckBoxOutlineBlank';
import '@material-ui/core/Grid';
import '@material-ui/core/Step';
import '@material-ui/core/StepLabel';
import '@material-ui/core/Stepper';
import '@material-ui/icons/FiberManualRecord';
import 'react-use/lib/useInterval';
import 'use-immer';
import '@material-ui/icons/Language';

const useStyles$e = makeStyles((theme) => ({
  cardHeader: {
    position: "relative"
  },
  title: {
    backgroundImage: ({ backgroundImage }) => backgroundImage
  },
  box: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 10,
    "-webkit-box-orient": "vertical",
    paddingBottom: "0.8em"
  },
  label: {
    color: theme.palette.text.secondary,
    textTransform: "uppercase",
    fontSize: "0.65rem",
    fontWeight: "bold",
    letterSpacing: 0.5,
    lineHeight: 1,
    paddingBottom: "0.2rem"
  },
  leftButton: {
    marginRight: "auto"
  },
  starButton: {
    position: "absolute",
    top: theme.spacing(0.5),
    right: theme.spacing(0.5),
    padding: "0.25rem",
    color: "#fff"
  }
}));
const useDeprecationStyles = makeStyles((theme) => ({
  deprecationIcon: {
    position: "absolute",
    top: theme.spacing(0.5),
    right: theme.spacing(3.5),
    padding: "0.25rem"
  },
  link: {
    color: theme.palette.warning.light
  }
}));
const getTemplateCardProps = (template) => {
  var _a, _b, _c, _d, _e;
  return {
    key: template.metadata.uid,
    name: template.metadata.name,
    title: `${(_a = template.metadata.title || template.metadata.name) != null ? _a : ""}`,
    type: (_b = template.spec.type) != null ? _b : "",
    description: (_c = template.metadata.description) != null ? _c : "-",
    tags: (_e = (_d = template.metadata) == null ? void 0 : _d.tags) != null ? _e : []
  };
};
const DeprecationWarning = () => {
  const styles = useDeprecationStyles();
  const Title = /* @__PURE__ */ React.createElement(Typography, {
    style: { padding: 10, maxWidth: 300 }
  }, "This template uses a syntax that has been deprecated, and should be migrated to a newer syntax. Click for more info.");
  return /* @__PURE__ */ React.createElement("div", {
    className: styles.deprecationIcon
  }, /* @__PURE__ */ React.createElement(Tooltip, {
    title: Title
  }, /* @__PURE__ */ React.createElement(Link, {
    href: "https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3",
    className: styles.link
  }, /* @__PURE__ */ React.createElement(WarningIcon, null))));
};
const TemplateCard = ({ template, deprecated }) => {
  var _a;
  const backstageTheme = useTheme();
  const templateRoute = useRouteRef(selectedTemplateRouteRef);
  const templateProps = getTemplateCardProps(template);
  const ownedByRelations = getEntityRelations(template, RELATION_OWNED_BY);
  const themeId = backstageTheme.getPageTheme({ themeId: templateProps.type }) ? templateProps.type : "other";
  const theme = backstageTheme.getPageTheme({ themeId });
  const classes = useStyles$e({ backgroundImage: theme.backgroundImage });
  const href = templateRoute({ templateName: templateProps.name });
  const scmIntegrationsApi = useApi(scmIntegrationsApiRef);
  const sourceLocation = getEntitySourceLocation(template, scmIntegrationsApi);
  return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardMedia, {
    className: classes.cardHeader
  }, /* @__PURE__ */ React.createElement(FavoriteEntity, {
    className: classes.starButton,
    entity: template
  }), deprecated && /* @__PURE__ */ React.createElement(DeprecationWarning, null), /* @__PURE__ */ React.createElement(ItemCardHeader, {
    title: templateProps.title,
    subtitle: templateProps.type,
    classes: { root: classes.title }
  })), /* @__PURE__ */ React.createElement(CardContent, {
    style: { display: "grid" }
  }, /* @__PURE__ */ React.createElement(Box, {
    className: classes.box
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2",
    className: classes.label
  }, "Description"), /* @__PURE__ */ React.createElement(MarkdownContent, {
    content: templateProps.description
  })), /* @__PURE__ */ React.createElement(Box, {
    className: classes.box
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2",
    className: classes.label
  }, "Owner"), /* @__PURE__ */ React.createElement(EntityRefLinks, {
    entityRefs: ownedByRelations,
    defaultKind: "Group"
  })), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2",
    className: classes.label
  }, "Tags"), (_a = templateProps.tags) == null ? void 0 : _a.map((tag) => /* @__PURE__ */ React.createElement(Chip, {
    size: "small",
    label: tag,
    key: tag
  })))), /* @__PURE__ */ React.createElement(CardActions, null, sourceLocation && /* @__PURE__ */ React.createElement(IconButton, {
    className: classes.leftButton,
    href: sourceLocation.locationTargetUrl
  }, /* @__PURE__ */ React.createElement(ScmIntegrationIcon, {
    type: sourceLocation.integrationType
  })), /* @__PURE__ */ React.createElement(Button, {
    color: "primary",
    to: href,
    "aria-label": `Choose ${templateProps.title}`
  }, "Choose")));
};

const TemplateList = ({
  TemplateCardComponent,
  group
}) => {
  const { loading, error, entities } = useEntityList();
  const Card = TemplateCardComponent || TemplateCard;
  const maybeFilteredEntities = group ? entities.filter((e) => group.filter(e)) : entities;
  const titleComponent = (() => {
    if (group && group.title) {
      if (typeof group.title === "string") {
        return /* @__PURE__ */ React.createElement(ContentHeader, {
          title: group.title
        });
      }
      return group.title;
    }
    return /* @__PURE__ */ React.createElement(ContentHeader, {
      title: "Other Templates"
    });
  })();
  if (group && maybeFilteredEntities.length === 0) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, loading && /* @__PURE__ */ React.createElement(Progress, null), error && /* @__PURE__ */ React.createElement(WarningPanel, {
    title: "Oops! Something went wrong loading the templates"
  }, error.message), !error && !loading && !entities.length && /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2"
  }, "No templates found that match your filter. Learn more about", " ", /* @__PURE__ */ React.createElement(Link$1, {
    to: "https://backstage.io/docs/features/software-templates/adding-templates"
  }, "adding templates"), "."), /* @__PURE__ */ React.createElement(Content, null, titleComponent, /* @__PURE__ */ React.createElement(ItemCardGrid, null, maybeFilteredEntities && (maybeFilteredEntities == null ? void 0 : maybeFilteredEntities.length) > 0 && maybeFilteredEntities.map((template) => /* @__PURE__ */ React.createElement(Card, {
    key: stringifyEntityRef(template),
    template,
    deprecated: template.apiVersion === "backstage.io/v1beta2"
  })))));
};

const useStyles$d = makeStyles$1({
  button: {
    color: "white"
  }
});
function ScaffolderPageContextMenu(props) {
  const classes = useStyles$d();
  const [anchorEl, setAnchorEl] = useState();
  const editLink = useRouteRef(editRouteRef);
  const actionsLink = useRouteRef(actionsRouteRef);
  const tasksLink = useRouteRef(scaffolderListTaskRouteRef);
  const navigate = useNavigate();
  const showEditor = props.editor !== false;
  const showActions = props.actions !== false;
  const showTasks = props.tasks !== false;
  if (!showEditor && !showActions) {
    return null;
  }
  const onOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const onClose = () => {
    setAnchorEl(void 0);
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IconButton$1, {
    "aria-label": "more",
    "aria-controls": "long-menu",
    "aria-haspopup": "true",
    onClick: onOpen,
    "data-testid": "menu-button",
    color: "inherit",
    className: classes.button
  }, /* @__PURE__ */ React.createElement(MoreVert, null)), /* @__PURE__ */ React.createElement(Popover, {
    open: Boolean(anchorEl),
    onClose,
    anchorEl,
    anchorOrigin: { vertical: "bottom", horizontal: "right" },
    transformOrigin: { vertical: "top", horizontal: "right" }
  }, /* @__PURE__ */ React.createElement(MenuList, null, showEditor && /* @__PURE__ */ React.createElement(MenuItem, {
    onClick: () => navigate(editLink())
  }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(Edit, {
    fontSize: "small"
  })), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: "Template Editor"
  })), showActions && /* @__PURE__ */ React.createElement(MenuItem, {
    onClick: () => navigate(actionsLink())
  }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(Description, {
    fontSize: "small"
  })), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: "Installed Actions"
  })), showTasks && /* @__PURE__ */ React.createElement(MenuItem, {
    onClick: () => navigate(tasksLink())
  }, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(List, {
    fontSize: "small"
  })), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: "Task List"
  })))));
}

const ScaffolderPageContents = ({
  TemplateCardComponent,
  groups,
  contextMenu
}) => {
  const registerComponentLink = useRouteRef(registerComponentRouteRef);
  const otherTemplatesGroup = {
    title: groups ? "Other Templates" : "Templates",
    filter: (entity) => {
      const filtered = (groups != null ? groups : []).map((group) => group.filter(entity));
      return !filtered.some((result) => result === true);
    }
  };
  const { allowed } = usePermission({
    permission: catalogEntityCreatePermission
  });
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "home"
  }, /* @__PURE__ */ React.createElement(Header, {
    pageTitleOverride: "Create a New Component",
    title: "Create a New Component",
    subtitle: "Create new software components using standard templates"
  }, /* @__PURE__ */ React.createElement(ScaffolderPageContextMenu, {
    ...contextMenu
  })), /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: "Available Templates"
  }, allowed && /* @__PURE__ */ React.createElement(CreateButton, {
    title: "Register Existing Component",
    to: registerComponentLink && registerComponentLink()
  }), /* @__PURE__ */ React.createElement(SupportButton, null, "Create new software components using standard templates. Different templates create different kinds of components (services, websites, documentation, ...).")), /* @__PURE__ */ React.createElement(CatalogFilterLayout, null, /* @__PURE__ */ React.createElement(CatalogFilterLayout.Filters, null, /* @__PURE__ */ React.createElement(EntitySearchBar, null), /* @__PURE__ */ React.createElement(EntityKindPicker, {
    initialFilter: "template",
    hidden: true
  }), /* @__PURE__ */ React.createElement(UserListPicker, {
    initialFilter: "all",
    availableFilters: ["all", "starred"]
  }), /* @__PURE__ */ React.createElement(TemplateTypePicker, null), /* @__PURE__ */ React.createElement(EntityTagPicker, null)), /* @__PURE__ */ React.createElement(CatalogFilterLayout.Content, null, groups && groups.map((group, index) => /* @__PURE__ */ React.createElement(TemplateList, {
    key: index,
    TemplateCardComponent,
    group
  })), /* @__PURE__ */ React.createElement(TemplateList, {
    key: "other",
    TemplateCardComponent,
    group: otherTemplatesGroup
  })))));
};
const ScaffolderPage = ({
  TemplateCardComponent,
  groups
}) => /* @__PURE__ */ React.createElement(EntityListProvider, null, /* @__PURE__ */ React.createElement(ScaffolderPageContents, {
  TemplateCardComponent,
  groups
}));

function isObject$1(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function extractUiSchema(schema, uiSchema) {
  if (!isObject$1(schema)) {
    return;
  }
  const { properties, items, anyOf, oneOf, allOf, dependencies } = schema;
  for (const propName in schema) {
    if (!schema.hasOwnProperty(propName)) {
      continue;
    }
    if (propName.startsWith("ui:")) {
      uiSchema[propName] = schema[propName];
      delete schema[propName];
    }
  }
  if (isObject$1(properties)) {
    for (const propName in properties) {
      if (!properties.hasOwnProperty(propName)) {
        continue;
      }
      const schemaNode = properties[propName];
      if (!isObject$1(schemaNode)) {
        continue;
      }
      const innerUiSchema = {};
      uiSchema[propName] = innerUiSchema;
      extractUiSchema(schemaNode, innerUiSchema);
    }
  }
  if (isObject$1(items)) {
    const innerUiSchema = {};
    uiSchema.items = innerUiSchema;
    extractUiSchema(items, innerUiSchema);
  }
  if (Array.isArray(anyOf)) {
    for (const schemaNode of anyOf) {
      if (!isObject$1(schemaNode)) {
        continue;
      }
      extractUiSchema(schemaNode, uiSchema);
    }
  }
  if (Array.isArray(oneOf)) {
    for (const schemaNode of oneOf) {
      if (!isObject$1(schemaNode)) {
        continue;
      }
      extractUiSchema(schemaNode, uiSchema);
    }
  }
  if (Array.isArray(allOf)) {
    for (const schemaNode of allOf) {
      if (!isObject$1(schemaNode)) {
        continue;
      }
      extractUiSchema(schemaNode, uiSchema);
    }
  }
  if (isObject$1(dependencies)) {
    for (const depName of Object.keys(dependencies)) {
      const schemaNode = dependencies[depName];
      if (!isObject$1(schemaNode)) {
        continue;
      }
      extractUiSchema(schemaNode, uiSchema);
    }
  }
}
function transformSchemaToProps(inputSchema) {
  inputSchema.type = inputSchema.type || "object";
  const schema = JSON.parse(JSON.stringify(inputSchema));
  delete schema.title;
  const uiSchema = {};
  extractUiSchema(schema, uiSchema);
  return { schema, uiSchema };
}

const DescriptionField = ({ description }) => description && /* @__PURE__ */ React.createElement(MarkdownContent, {
  content: description,
  linkTarget: "_blank"
});

var fieldOverrides = /*#__PURE__*/Object.freeze({
  __proto__: null,
  DescriptionField: DescriptionField
});

const Form = withTheme(Theme);
function getUiSchemasFromSteps(steps) {
  const uiSchemas = [];
  steps.forEach((step) => {
    const schemaProps = step.schema.properties;
    for (const key in schemaProps) {
      if (schemaProps.hasOwnProperty(key)) {
        const uiSchema = schemaProps[key];
        uiSchema.name = key;
        uiSchemas.push(uiSchema);
      }
    }
  });
  return uiSchemas;
}
function getReviewData(formData, steps) {
  const uiSchemas = getUiSchemasFromSteps(steps);
  const reviewData = {};
  for (const key in formData) {
    if (formData.hasOwnProperty(key)) {
      const uiSchema = uiSchemas.find((us) => us.name === key);
      if (!uiSchema) {
        reviewData[key] = formData[key];
        continue;
      }
      if (uiSchema["ui:widget"] === "password") {
        reviewData[key] = "******";
        continue;
      }
      if (!uiSchema["ui:backstage"] || !uiSchema["ui:backstage"].review) {
        reviewData[key] = formData[key];
        continue;
      }
      const review = uiSchema["ui:backstage"].review;
      if (review.mask) {
        reviewData[key] = review.mask;
        continue;
      }
      if (!review.show) {
        continue;
      }
      reviewData[key] = formData[key];
    }
  }
  return reviewData;
}
const MultistepJsonForm = (props) => {
  const {
    formData,
    onChange,
    onReset,
    onFinish,
    fields,
    widgets,
    finishButtonLabel
  } = props;
  const [activeStep, setActiveStep] = useState(0);
  const [disableButtons, setDisableButtons] = useState(false);
  const errorApi = useApi(errorApiRef);
  const featureFlagApi = useApi(featureFlagsApiRef);
  const featureFlagKey = "backstage:featureFlag";
  const filterOutProperties = (step) => {
    var _a;
    const filteredStep = cloneDeep(step);
    const removedPropertyKeys = [];
    if (filteredStep.schema.properties) {
      filteredStep.schema.properties = Object.fromEntries(Object.entries(filteredStep.schema.properties).filter(([key, value]) => {
        if (value[featureFlagKey]) {
          if (featureFlagApi.isActive(value[featureFlagKey])) {
            return true;
          }
          removedPropertyKeys.push(key);
          return false;
        }
        return true;
      }));
      filteredStep.schema.required = Array.isArray(filteredStep.schema.required) ? (_a = filteredStep.schema.required) == null ? void 0 : _a.filter((r) => !removedPropertyKeys.includes(r)) : filteredStep.schema.required;
    }
    return filteredStep;
  };
  const steps = props.steps.filter((step) => {
    const featureFlag = step.schema[featureFlagKey];
    return typeof featureFlag !== "string" || featureFlagApi.isActive(featureFlag);
  }).map(filterOutProperties);
  const handleReset = () => {
    setActiveStep(0);
    onReset();
  };
  const handleNext = () => {
    setActiveStep(Math.min(activeStep + 1, steps.length));
  };
  const handleBack = () => setActiveStep(Math.max(activeStep - 1, 0));
  const handleCreate = async () => {
    if (!onFinish) {
      return;
    }
    setDisableButtons(true);
    try {
      await onFinish();
    } catch (err) {
      errorApi.post(err);
    } finally {
      setDisableButtons(false);
    }
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Stepper, {
    activeStep,
    orientation: "vertical"
  }, steps.map(({ title, schema, ...formProps }, index) => {
    return /* @__PURE__ */ React.createElement(Step, {
      key: title
    }, /* @__PURE__ */ React.createElement(StepLabel, {
      "aria-label": `Step ${index + 1} ${title}`,
      "aria-disabled": "false",
      tabIndex: 0
    }, /* @__PURE__ */ React.createElement(Typography, {
      variant: "h6",
      component: "h3"
    }, title)), /* @__PURE__ */ React.createElement(StepContent, {
      key: title
    }, /* @__PURE__ */ React.createElement(Form, {
      showErrorList: false,
      fields: { ...fieldOverrides, ...fields },
      widgets,
      noHtml5Validate: true,
      formData,
      formContext: { formData },
      onChange,
      onSubmit: (e) => {
        if (e.errors.length === 0)
          handleNext();
      },
      ...formProps,
      ...transformSchemaToProps(schema)
    }, /* @__PURE__ */ React.createElement(Button$1, {
      disabled: activeStep === 0,
      onClick: handleBack
    }, "Back"), /* @__PURE__ */ React.createElement(Button$1, {
      variant: "contained",
      color: "primary",
      type: "submit"
    }, "Next step"))));
  })), activeStep === steps.length && /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(Paper, {
    square: true,
    elevation: 0
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6"
  }, "Review and create"), /* @__PURE__ */ React.createElement(StructuredMetadataTable, {
    dense: true,
    metadata: getReviewData(formData, steps)
  }), /* @__PURE__ */ React.createElement(Box, {
    mb: 4
  }), /* @__PURE__ */ React.createElement(Button$1, {
    onClick: handleBack,
    disabled: disableButtons
  }, "Back"), /* @__PURE__ */ React.createElement(Button$1, {
    onClick: handleReset,
    disabled: disableButtons
  }, "Reset"), /* @__PURE__ */ React.createElement(Button$1, {
    variant: "contained",
    color: "primary",
    onClick: handleCreate,
    disabled: !onFinish || disableButtons
  }, finishButtonLabel != null ? finishButtonLabel : "Create"))));
};

function isObject(obj) {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}
const createValidator = (rootSchema, validators, context) => {
  function validate(schema, formData, errors) {
    const schemaProps = schema.properties;
    const customObject = schema.type === "object" && schemaProps === void 0;
    if (!isObject(schemaProps) && !customObject) {
      return;
    }
    if (schemaProps) {
      for (const [key, propData] of Object.entries(formData)) {
        const propValidation = errors[key];
        if (isObject(propData)) {
          const propSchemaProps = schemaProps[key];
          if (isObject(propSchemaProps)) {
            validate(propSchemaProps, propData, propValidation);
          }
        } else {
          const propSchema = schemaProps[key];
          const fieldName = isObject(propSchema) && propSchema["ui:field"];
          if (fieldName && typeof validators[fieldName] === "function") {
            validators[fieldName](propData, propValidation, context);
          }
        }
      }
    } else if (customObject) {
      const fieldName = schema["ui:field"];
      if (fieldName && typeof validators[fieldName] === "function") {
        validators[fieldName](formData, errors, context);
      }
    }
  }
  return (formData, errors) => {
    validate(rootSchema, formData, errors);
    return errors;
  };
};

const useTemplateParameterSchema = (templateRef) => {
  const scaffolderApi = useApi(scaffolderApiRef);
  const { value, loading, error } = useAsync(() => scaffolderApi.getTemplateParameterSchema(templateRef), [scaffolderApi, templateRef]);
  return { schema: value, loading, error };
};
const TemplatePage = ({
  customFieldExtensions = []
}) => {
  const apiHolder = useApiHolder();
  const secretsContext = useContext(SecretsContext);
  const errorApi = useApi(errorApiRef);
  const scaffolderApi = useApi(scaffolderApiRef);
  const { templateName } = useParams();
  const navigate = useNavigate();
  const scaffolderTaskRoute = useRouteRef(scaffolderTaskRouteRef);
  const rootRoute = useRouteRef(rootRouteRef);
  const { schema, loading, error } = useTemplateParameterSchema(templateName);
  const [formState, setFormState] = useState(() => {
    var _a;
    const query = qs.parse(window.location.search, {
      ignoreQueryPrefix: true
    });
    try {
      return JSON.parse(query.formData);
    } catch (e) {
      return (_a = query.formData) != null ? _a : {};
    }
  });
  const handleFormReset = () => setFormState({});
  const handleChange = useCallback((e) => setFormState(e.formData), [setFormState]);
  const handleCreate = async () => {
    var _a;
    const { taskId } = await scaffolderApi.scaffold({
      templateRef: stringifyEntityRef({
        name: templateName,
        kind: "template",
        namespace: "default"
      }),
      values: formState,
      secrets: secretsContext == null ? void 0 : secretsContext.secrets
    });
    const formParams = qs.stringify({ formData: formState }, { addQueryPrefix: true });
    const newUrl = `${window.location.pathname}${formParams}`;
    (_a = window.history) == null ? void 0 : _a.replaceState(null, document.title, newUrl);
    navigate(scaffolderTaskRoute({ taskId }));
  };
  if (error) {
    errorApi.post(new Error(`Failed to load template, ${error}`));
    return /* @__PURE__ */ React.createElement(Navigate, {
      to: rootRoute()
    });
  }
  if (!loading && !schema) {
    errorApi.post(new Error("Template was not found."));
    return /* @__PURE__ */ React.createElement(Navigate, {
      to: rootRoute()
    });
  }
  const customFieldComponents = Object.fromEntries(customFieldExtensions.map(({ name, component }) => [name, component]));
  const customFieldValidators = Object.fromEntries(customFieldExtensions.map(({ name, validation }) => [name, validation]));
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "home"
  }, /* @__PURE__ */ React.createElement(Header, {
    pageTitleOverride: "Create a New Component",
    title: "Create a New Component",
    subtitle: "Create new software components using standard templates"
  }), /* @__PURE__ */ React.createElement(Content, null, loading && /* @__PURE__ */ React.createElement(LinearProgress, {
    "data-testid": "loading-progress"
  }), schema && /* @__PURE__ */ React.createElement(InfoCard, {
    title: schema.title,
    noPadding: true,
    titleTypographyProps: { component: "h2" }
  }, /* @__PURE__ */ React.createElement(MultistepJsonForm, {
    formData: formState,
    fields: customFieldComponents,
    onChange: handleChange,
    onReset: handleFormReset,
    onFinish: handleCreate,
    steps: schema.steps.map((step) => {
      return {
        ...step,
        validate: createValidator(step.schema, customFieldValidators, { apiHolder })
      };
    })
  }))));
};

const useStyles$c = makeStyles((theme) => ({
  code: {
    fontFamily: "Menlo, monospace",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.type === "dark" ? theme.palette.grey[700] : theme.palette.grey[300],
    display: "inline-block",
    borderRadius: 5,
    border: `1px solid ${theme.palette.grey[500]}`,
    position: "relative"
  },
  codeRequired: {
    "&::after": {
      position: "absolute",
      content: '"*"',
      top: 0,
      right: theme.spacing(0.5),
      fontWeight: "bolder",
      color: theme.palette.error.light
    }
  }
}));
const ActionsPage = () => {
  const api = useApi(scaffolderApiRef);
  const classes = useStyles$c();
  const { loading, value, error } = useAsync(async () => {
    return api.listActions();
  });
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(ErrorPage, {
      statusMessage: "Failed to load installed actions",
      status: "500"
    });
  }
  const formatRows = (input) => {
    const properties = input.properties;
    if (!properties) {
      return void 0;
    }
    return Object.entries(properties).map((entry) => {
      var _a;
      const [key] = entry;
      const props = entry[1];
      const codeClassname = classNames(classes.code, {
        [classes.codeRequired]: (_a = input.required) == null ? void 0 : _a.includes(key)
      });
      return /* @__PURE__ */ React.createElement(TableRow, {
        key
      }, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement("div", {
        className: codeClassname
      }, key)), /* @__PURE__ */ React.createElement(TableCell, null, props.title), /* @__PURE__ */ React.createElement(TableCell, null, props.description), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement("span", {
        className: classes.code
      }, props.type)));
    });
  };
  const renderTable = (input) => {
    if (!input.properties) {
      return void 0;
    }
    return /* @__PURE__ */ React.createElement(TableContainer, {
      component: Paper
    }, /* @__PURE__ */ React.createElement(Table, {
      size: "small"
    }, /* @__PURE__ */ React.createElement(TableHead, null, /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, "Name"), /* @__PURE__ */ React.createElement(TableCell, null, "Title"), /* @__PURE__ */ React.createElement(TableCell, null, "Description"), /* @__PURE__ */ React.createElement(TableCell, null, "Type"))), /* @__PURE__ */ React.createElement(TableBody, null, formatRows(input))));
  };
  const renderTables = (name, input) => {
    if (!input) {
      return void 0;
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Typography, {
      variant: "h6"
    }, name), input.map((i, index) => /* @__PURE__ */ React.createElement("div", {
      key: index
    }, renderTable(i))));
  };
  const items = value == null ? void 0 : value.map((action) => {
    var _a, _b, _c, _d;
    if (action.id.startsWith("legacy:")) {
      return void 0;
    }
    const oneOf = renderTables("oneOf", (_b = (_a = action.schema) == null ? void 0 : _a.input) == null ? void 0 : _b.oneOf);
    return /* @__PURE__ */ React.createElement(Box, {
      pb: 4,
      key: action.id
    }, /* @__PURE__ */ React.createElement(Typography, {
      variant: "h4",
      className: classes.code
    }, action.id), /* @__PURE__ */ React.createElement(Typography, null, action.description), ((_c = action.schema) == null ? void 0 : _c.input) && /* @__PURE__ */ React.createElement(Box, {
      pb: 2
    }, /* @__PURE__ */ React.createElement(Typography, {
      variant: "h5"
    }, "Input"), renderTable(action.schema.input), oneOf), ((_d = action.schema) == null ? void 0 : _d.output) && /* @__PURE__ */ React.createElement(Box, {
      pb: 2
    }, /* @__PURE__ */ React.createElement(Typography, {
      variant: "h5"
    }, "Output"), renderTable(action.schema.output)));
  });
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "home"
  }, /* @__PURE__ */ React.createElement(Header, {
    pageTitleOverride: "Create a New Component",
    title: "Installed actions",
    subtitle: "This is the collection of all installed actions"
  }), /* @__PURE__ */ React.createElement(Content, null, items));
};

const showDirectoryPicker = window.showDirectoryPicker;
class WebFileAccess {
  constructor(path, handle) {
    this.path = path;
    this.handle = handle;
  }
  file() {
    return this.handle.getFile();
  }
  async save(data) {
    const writable = await this.handle.createWritable();
    await writable.write(data);
    await writable.close();
  }
}
class WebDirectoryAccess {
  constructor(handle) {
    this.handle = handle;
  }
  async listFiles() {
    const content = [];
    for await (const entry of this.listDirectoryContents(this.handle)) {
      content.push(entry);
    }
    return content;
  }
  async *listDirectoryContents(dirHandle, basePath = []) {
    for await (const handle of dirHandle.values()) {
      if (handle.kind === "file") {
        yield new WebFileAccess([...basePath, handle.name].join("/"), handle);
      } else if (handle.kind === "directory") {
        yield* this.listDirectoryContents(handle, [...basePath, handle.name]);
      }
    }
  }
}
class WebFileSystemAccess {
  static isSupported() {
    return Boolean(showDirectoryPicker);
  }
  static async requestDirectoryAccess() {
    if (!showDirectoryPicker) {
      throw new Error("File system access is not supported");
    }
    const handle = await showDirectoryPicker();
    return new WebDirectoryAccess(handle);
  }
  constructor() {
  }
}

const useStyles$b = makeStyles$1((theme) => ({
  introText: {
    textAlign: "center",
    marginTop: theme.spacing(2)
  },
  card: {
    position: "relative",
    maxWidth: 340,
    marginTop: theme.spacing(4),
    margin: theme.spacing(0, 2)
  },
  infoIcon: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1)
  }
}));
function TemplateEditorIntro(props) {
  const classes = useStyles$b();
  const supportsLoad = WebFileSystemAccess.isSupported();
  const cardLoadLocal = /* @__PURE__ */ React.createElement(Card$1, {
    className: classes.card,
    elevation: 4
  }, /* @__PURE__ */ React.createElement(CardActionArea, {
    disabled: !supportsLoad,
    onClick: () => {
      var _a;
      return (_a = props.onSelect) == null ? void 0 : _a.call(props, "local");
    }
  }, /* @__PURE__ */ React.createElement(CardContent$1, null, /* @__PURE__ */ React.createElement(Typography$1, {
    variant: "h5",
    gutterBottom: true,
    color: supportsLoad ? void 0 : "textSecondary",
    style: { display: "flex", flexFlow: "row nowrap" }
  }, "Load Template Directory"), /* @__PURE__ */ React.createElement(Typography$1, {
    variant: "body1",
    color: supportsLoad ? void 0 : "textSecondary"
  }, "Load a local template directory, allowing you to both edit and try executing your own template."))), !supportsLoad && /* @__PURE__ */ React.createElement("div", {
    className: classes.infoIcon
  }, /* @__PURE__ */ React.createElement(Tooltip$1, {
    placement: "top",
    title: "Only supported in some Chromium-based browsers"
  }, /* @__PURE__ */ React.createElement(InfoOutlinedIcon, null))));
  const cardFormEditor = /* @__PURE__ */ React.createElement(Card$1, {
    className: classes.card,
    elevation: 4
  }, /* @__PURE__ */ React.createElement(CardActionArea, {
    onClick: () => {
      var _a;
      return (_a = props.onSelect) == null ? void 0 : _a.call(props, "form");
    }
  }, /* @__PURE__ */ React.createElement(CardContent$1, null, /* @__PURE__ */ React.createElement(Typography$1, {
    variant: "h5",
    gutterBottom: true
  }, "Edit Template Form"), /* @__PURE__ */ React.createElement(Typography$1, {
    variant: "body1"
  }, "Preview and edit a template form, either using a sample template or by loading a template from the catalog."))));
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement(Typography$1, {
    variant: "h6",
    className: classes.introText
  }, "Get started by choosing one of the options below"), /* @__PURE__ */ React.createElement("div", {
    style: {
      display: "flex",
      flexFlow: "row wrap",
      alignItems: "flex-start",
      justifyContent: "center",
      alignContent: "flex-start"
    }
  }, supportsLoad && cardLoadLocal, cardFormEditor, !supportsLoad && cardLoadLocal));
}

var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _access, _signalUpdate, _content, _savedContent, _access2, _listeners, _files, _selectedFile, _signalUpdate2;
const MAX_SIZE = 1024 * 1024;
const MAX_SIZE_MESSAGE = "This file is too large to be displayed";
class DirectoryEditorFileManager {
  constructor(access, signalUpdate) {
    __privateAdd(this, _access, void 0);
    __privateAdd(this, _signalUpdate, void 0);
    __privateAdd(this, _content, void 0);
    __privateAdd(this, _savedContent, void 0);
    __privateSet(this, _access, access);
    __privateSet(this, _signalUpdate, signalUpdate);
  }
  get path() {
    return __privateGet(this, _access).path;
  }
  get content() {
    var _a;
    return (_a = __privateGet(this, _content)) != null ? _a : MAX_SIZE_MESSAGE;
  }
  updateContent(content) {
    if (__privateGet(this, _content) === void 0) {
      return;
    }
    __privateSet(this, _content, content);
    __privateGet(this, _signalUpdate).call(this);
  }
  get dirty() {
    return __privateGet(this, _content) !== __privateGet(this, _savedContent);
  }
  async save() {
    if (__privateGet(this, _content) !== void 0) {
      await __privateGet(this, _access).save(__privateGet(this, _content));
      __privateSet(this, _savedContent, __privateGet(this, _content));
      __privateGet(this, _signalUpdate).call(this);
    }
  }
  async reload() {
    const file = await __privateGet(this, _access).file();
    if (file.size > MAX_SIZE) {
      if (__privateGet(this, _content) !== void 0) {
        __privateSet(this, _content, void 0);
        __privateSet(this, _savedContent, void 0);
        __privateGet(this, _signalUpdate).call(this);
      }
      return;
    }
    const content = await file.text();
    if (__privateGet(this, _content) !== content) {
      __privateSet(this, _content, content);
      __privateSet(this, _savedContent, content);
      __privateGet(this, _signalUpdate).call(this);
    }
  }
}
_access = new WeakMap();
_signalUpdate = new WeakMap();
_content = new WeakMap();
_savedContent = new WeakMap();
class DirectoryEditorManager {
  constructor(access) {
    __privateAdd(this, _access2, void 0);
    __privateAdd(this, _listeners, /* @__PURE__ */ new Set());
    __privateAdd(this, _files, []);
    __privateAdd(this, _selectedFile, void 0);
    this.setSelectedFile = (path) => {
      const prev = __privateGet(this, _selectedFile);
      const next = __privateGet(this, _files).find((file) => file.path === path);
      if (prev !== next) {
        __privateSet(this, _selectedFile, next);
        __privateGet(this, _signalUpdate2).call(this);
      }
    };
    __privateAdd(this, _signalUpdate2, () => {
      __privateGet(this, _listeners).forEach((listener) => listener());
    });
    __privateSet(this, _access2, access);
  }
  get files() {
    return __privateGet(this, _files);
  }
  get selectedFile() {
    return __privateGet(this, _selectedFile);
  }
  get dirty() {
    return __privateGet(this, _files).some((file) => file.dirty);
  }
  async save() {
    await Promise.all(__privateGet(this, _files).map((file) => file.save()));
  }
  async reload() {
    var _a;
    const selectedPath = (_a = __privateGet(this, _selectedFile)) == null ? void 0 : _a.path;
    const files = await __privateGet(this, _access2).listFiles();
    const fileManagers = await Promise.all(files.map(async (file) => {
      const manager = new DirectoryEditorFileManager(file, __privateGet(this, _signalUpdate2));
      await manager.reload();
      return manager;
    }));
    __privateGet(this, _files).length = 0;
    __privateGet(this, _files).push(...fileManagers);
    this.setSelectedFile(selectedPath);
    __privateGet(this, _signalUpdate2).call(this);
  }
  subscribe(listener) {
    __privateGet(this, _listeners).add(listener);
    return () => {
      __privateGet(this, _listeners).delete(listener);
    };
  }
}
_access2 = new WeakMap();
_listeners = new WeakMap();
_files = new WeakMap();
_selectedFile = new WeakMap();
_signalUpdate2 = new WeakMap();
const DirectoryEditorContext = createContext(void 0);
function useDirectoryEditor() {
  const value = useContext(DirectoryEditorContext);
  const rerender = useRerender();
  useEffect(() => value == null ? void 0 : value.subscribe(rerender), [value, rerender]);
  if (!value) {
    throw new Error("must be used within a DirectoryEditorProvider");
  }
  return value;
}
function DirectoryEditorProvider(props) {
  const { directory } = props;
  const [{ result, error }, { execute }] = useAsync$1(async (dir) => {
    const manager = new DirectoryEditorManager(dir);
    await manager.reload();
    const firstYaml = manager.files.find((file) => file.path.match(/\.ya?ml$/));
    if (firstYaml) {
      manager.setSelectedFile(firstYaml.path);
    }
    return manager;
  });
  useEffect(() => {
    execute(directory);
  }, [execute, directory]);
  if (error) {
    return /* @__PURE__ */ React.createElement(ErrorPanel, {
      error
    });
  } else if (!result) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  return /* @__PURE__ */ React.createElement(DirectoryEditorContext.Provider, {
    value: result
  }, props.children);
}

const MAX_CONTENT_SIZE = 256 * 1024;
const CHUNK_SIZE = 32768;
const DryRunContext = createContext(void 0);
function base64EncodeContent(content) {
  if (content.length > MAX_CONTENT_SIZE) {
    return btoa("<file too large>");
  }
  try {
    return btoa(content);
  } catch {
    const decoder = new TextEncoder();
    const buffer = decoder.encode(content);
    const chunks = new Array();
    for (let offset = 0; offset < buffer.length; offset += CHUNK_SIZE) {
      chunks.push(String.fromCharCode(...buffer.slice(offset, offset + CHUNK_SIZE)));
    }
    return btoa(chunks.join(""));
  }
}
function DryRunProvider(props) {
  const scaffolderApi = useApi(scaffolderApiRef);
  const [state, setState] = useState({
    results: [],
    selectedResult: void 0
  });
  const idRef = useRef(1);
  const selectResult = useCallback((id) => {
    setState((prevState) => {
      const result = prevState.results.find((r) => r.id === id);
      if (result === prevState.selectedResult) {
        return prevState;
      }
      return {
        results: prevState.results,
        selectedResult: result
      };
    });
  }, []);
  const deleteResult = useCallback((id) => {
    setState((prevState) => {
      var _a;
      const index = prevState.results.findIndex((r) => r.id === id);
      if (index === -1) {
        return prevState;
      }
      const newResults = prevState.results.slice();
      const [deleted] = newResults.splice(index, 1);
      return {
        results: newResults,
        selectedResult: ((_a = prevState.selectedResult) == null ? void 0 : _a.id) === deleted.id ? newResults[0] : prevState.selectedResult
      };
    });
  }, []);
  const execute = useCallback(async (options) => {
    if (!scaffolderApi.dryRun) {
      throw new Error("Scaffolder API does not support dry-run");
    }
    const parsed = yaml.parse(options.templateContent);
    const response = await scaffolderApi.dryRun({
      template: parsed,
      values: options.values,
      secrets: {},
      directoryContents: options.files.map((file) => ({
        path: file.path,
        base64Content: base64EncodeContent(file.content)
      }))
    });
    const result = {
      ...response,
      id: idRef.current++
    };
    setState((prevState) => {
      var _a;
      return {
        results: [...prevState.results, result],
        selectedResult: (_a = prevState.selectedResult) != null ? _a : result
      };
    });
  }, [scaffolderApi]);
  const dryRun = useMemo(() => ({
    ...state,
    selectResult,
    deleteResult,
    execute
  }), [state, selectResult, deleteResult, execute]);
  return /* @__PURE__ */ React.createElement(DryRunContext.Provider, {
    value: dryRun
  }, props.children);
}
function useDryRun() {
  const value = useContext(DryRunContext);
  if (!value) {
    throw new Error("must be used within a DryRunProvider");
  }
  return value;
}

const useStyles$a = makeStyles$1((theme) => ({
  root: {
    overflowY: "auto",
    background: theme.palette.background.default
  },
  iconSuccess: {
    minWidth: 0,
    marginRight: theme.spacing(1),
    color: theme.palette.status.ok
  },
  iconFailure: {
    minWidth: 0,
    marginRight: theme.spacing(1),
    color: theme.palette.status.error
  }
}));
function DryRunResultsList() {
  const classes = useStyles$a();
  const dryRun = useDryRun();
  return /* @__PURE__ */ React.createElement(List$1, {
    className: classes.root,
    dense: true
  }, dryRun.results.map((result) => {
    var _a;
    const failed = result.log.some((l) => l.body.status === "failed");
    return /* @__PURE__ */ React.createElement(ListItem, {
      button: true,
      key: result.id,
      selected: ((_a = dryRun.selectedResult) == null ? void 0 : _a.id) === result.id,
      onClick: () => dryRun.selectResult(result.id)
    }, /* @__PURE__ */ React.createElement(ListItemIcon, {
      className: failed ? classes.iconFailure : classes.iconSuccess
    }, failed ? /* @__PURE__ */ React.createElement(Cancel, null) : /* @__PURE__ */ React.createElement(Check, null)), /* @__PURE__ */ React.createElement(ListItemText, {
      primary: `Result ${result.id}`
    }), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, null, /* @__PURE__ */ React.createElement(IconButton$1, {
      edge: "end",
      "aria-label": "delete",
      onClick: () => dryRun.deleteResult(result.id)
    }, /* @__PURE__ */ React.createElement(DeleteIcon, null))));
  }));
}

const useStyles$9 = makeStyles$1({
  root: {
    whiteSpace: "nowrap",
    overflowY: "auto"
  }
});
function parseFileEntires(paths) {
  const root = {
    type: "directory",
    name: "",
    path: "",
    children: []
  };
  for (const path of paths.slice().sort()) {
    const parts = path.split("/");
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part === "") {
        throw new Error(`Invalid path part: ''`);
      }
      const entryPath = parts.slice(0, i + 1).join("/");
      const existing = current.children.find((child) => child.name === part);
      if ((existing == null ? void 0 : existing.type) === "file") {
        throw new Error(`Duplicate filename at '${entryPath}'`);
      } else if (existing) {
        current = existing;
      } else {
        if (i < parts.length - 1) {
          const newEntry = {
            type: "directory",
            name: part,
            path: entryPath,
            children: []
          };
          const firstFileIndex = current.children.findIndex((child) => child.type === "file");
          current.children.splice(firstFileIndex, 0, newEntry);
          current = newEntry;
        } else {
          current.children.push({
            type: "file",
            name: part,
            path: entryPath
          });
        }
      }
    }
  }
  return root.children;
}
function FileTreeItem({ entry }) {
  if (entry.type === "file") {
    return /* @__PURE__ */ React.createElement(TreeItem, {
      nodeId: entry.path,
      label: entry.name
    });
  }
  return /* @__PURE__ */ React.createElement(TreeItem, {
    nodeId: entry.path,
    label: entry.name
  }, entry.children.map((child) => /* @__PURE__ */ React.createElement(FileTreeItem, {
    key: child.path,
    entry: child
  })));
}
function FileBrowser(props) {
  const classes = useStyles$9();
  const fileTree = useMemo(() => parseFileEntires(props.filePaths), [props.filePaths]);
  return /* @__PURE__ */ React.createElement(TreeView, {
    selected: props.selected,
    className: classes.root,
    defaultCollapseIcon: /* @__PURE__ */ React.createElement(ExpandMoreIcon, null),
    defaultExpandIcon: /* @__PURE__ */ React.createElement(ChevronRightIcon, null),
    onNodeSelect: (_e, nodeId) => {
      if (props.onSelect && props.filePaths.includes(nodeId)) {
        props.onSelect(nodeId);
      }
    }
  }, fileTree.map((entry) => /* @__PURE__ */ React.createElement(FileTreeItem, {
    key: entry.path,
    entry
  })));
}

const useStyles$8 = makeStyles$1((theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "280px auto 3fr",
    gridTemplateRows: "1fr"
  },
  child: {
    overflowY: "auto",
    height: "100%",
    minHeight: 0
  },
  firstChild: {
    background: theme.palette.background.paper
  }
}));
function DryRunResultsSplitView(props) {
  const classes = useStyles$8();
  const childArray = Children.toArray(props.children);
  if (childArray.length !== 2) {
    throw new Error("must have exactly 2 children");
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: classes.root
  }, /* @__PURE__ */ React.createElement("div", {
    className: classNames(classes.child, classes.firstChild)
  }, childArray[0]), /* @__PURE__ */ React.createElement(Divider, {
    orientation: "horizontal"
  }), /* @__PURE__ */ React.createElement("div", {
    className: classes.child
  }, childArray[1]));
}

const useStyles$7 = makeStyles$1({
  root: {
    display: "flex",
    flexFlow: "column nowrap"
  },
  contentWrapper: {
    flex: 1,
    position: "relative"
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    "& > *": {
      flex: 1
    }
  },
  codeMirror: {
    height: "100%",
    overflowY: "auto"
  }
});
function FilesContent() {
  const classes = useStyles$7();
  const { selectedResult } = useDryRun();
  const [selectedPath, setSelectedPath] = useState("");
  const selectedFile = selectedResult == null ? void 0 : selectedResult.directoryContents.find((f) => f.path === selectedPath);
  useEffect(() => {
    if (selectedResult) {
      const [firstFile] = selectedResult.directoryContents;
      if (firstFile) {
        setSelectedPath(firstFile.path);
      } else {
        setSelectedPath("");
      }
    }
    return void 0;
  }, [selectedResult]);
  if (!selectedResult) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(DryRunResultsSplitView, null, /* @__PURE__ */ React.createElement(FileBrowser, {
    selected: selectedPath,
    onSelect: setSelectedPath,
    filePaths: selectedResult.directoryContents.map((file) => file.path)
  }), /* @__PURE__ */ React.createElement(CodeMirror, {
    className: classes.codeMirror,
    theme: "dark",
    height: "100%",
    extensions: [StreamLanguage.define(yaml$1)],
    readOnly: true,
    value: (selectedFile == null ? void 0 : selectedFile.base64Content) ? atob(selectedFile.base64Content) : ""
  }));
}
function LogContent() {
  var _a, _b;
  const { selectedResult } = useDryRun();
  const [currentStepId, setUserSelectedStepId] = useState();
  const steps = useMemo(() => {
    var _a2;
    if (!selectedResult) {
      return [];
    }
    return (_a2 = selectedResult.steps.map((step) => {
      var _a3, _b2;
      const stepLog = selectedResult.log.filter((l) => l.body.stepId === step.id);
      return {
        id: step.id,
        name: step.name,
        logString: stepLog.map((l) => l.body.message).join("\n"),
        status: (_b2 = (_a3 = stepLog[stepLog.length - 1]) == null ? void 0 : _a3.body.status) != null ? _b2 : "completed"
      };
    })) != null ? _a2 : [];
  }, [selectedResult]);
  if (!selectedResult) {
    return null;
  }
  const selectedStep = (_a = steps.find((s) => s.id === currentStepId)) != null ? _a : steps[0];
  return /* @__PURE__ */ React.createElement(DryRunResultsSplitView, null, /* @__PURE__ */ React.createElement(TaskStatusStepper, {
    steps,
    currentStepId: selectedStep.id,
    onUserStepChange: setUserSelectedStepId
  }), /* @__PURE__ */ React.createElement(LogViewer, {
    text: (_b = selectedStep == null ? void 0 : selectedStep.logString) != null ? _b : ""
  }));
}
function OutputContent() {
  var _a, _b;
  const classes = useStyles$7();
  const { selectedResult } = useDryRun();
  if (!selectedResult) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(DryRunResultsSplitView, null, /* @__PURE__ */ React.createElement(Box$1, {
    pt: 2
  }, ((_b = (_a = selectedResult.output) == null ? void 0 : _a.links) == null ? void 0 : _b.length) && /* @__PURE__ */ React.createElement(TaskPageLinks, {
    output: selectedResult.output
  })), /* @__PURE__ */ React.createElement(CodeMirror, {
    className: classes.codeMirror,
    theme: "dark",
    height: "100%",
    extensions: [StreamLanguage.define(yaml$1)],
    readOnly: true,
    value: JSON.stringify(selectedResult.output, null, 2)
  }));
}
function DryRunResultsView() {
  const classes = useStyles$7();
  const [selectedTab, setSelectedTab] = useState("files");
  return /* @__PURE__ */ React.createElement("div", {
    className: classes.root
  }, /* @__PURE__ */ React.createElement(Tabs, {
    value: selectedTab,
    onChange: (_, v) => setSelectedTab(v)
  }, /* @__PURE__ */ React.createElement(Tab, {
    value: "files",
    label: "Files"
  }), /* @__PURE__ */ React.createElement(Tab, {
    value: "log",
    label: "Log"
  }), /* @__PURE__ */ React.createElement(Tab, {
    value: "output",
    label: "Output"
  })), /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement("div", {
    className: classes.contentWrapper
  }, /* @__PURE__ */ React.createElement("div", {
    className: classes.content
  }, selectedTab === "files" && /* @__PURE__ */ React.createElement(FilesContent, null), selectedTab === "log" && /* @__PURE__ */ React.createElement(LogContent, null), selectedTab === "output" && /* @__PURE__ */ React.createElement(OutputContent, null))));
}

const useStyles$6 = makeStyles$1((theme) => ({
  header: {
    height: 48,
    minHeight: 0,
    "&.Mui-expanded": {
      height: 48,
      minHeight: 0
    }
  },
  content: {
    display: "grid",
    background: theme.palette.background.default,
    gridTemplateColumns: "180px auto 1fr",
    gridTemplateRows: "1fr",
    padding: 0,
    height: 400
  }
}));
function DryRunResults() {
  const classes = useStyles$6();
  const dryRun = useDryRun();
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(true);
  const resultsLength = dryRun.results.length;
  const prevResultsLength = usePrevious(resultsLength);
  useEffect(() => {
    if (prevResultsLength === 0 && resultsLength === 1) {
      setHidden(false);
      setExpanded(true);
    } else if (prevResultsLength === 1 && resultsLength === 0) {
      setExpanded(false);
    }
  }, [prevResultsLength, resultsLength]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Accordion, {
    variant: "outlined",
    expanded,
    hidden: resultsLength === 0 && hidden,
    onChange: (_, exp) => setExpanded(exp),
    onTransitionEnd: () => resultsLength === 0 && setHidden(true)
  }, /* @__PURE__ */ React.createElement(AccordionSummary, {
    className: classes.header,
    expandIcon: /* @__PURE__ */ React.createElement(ExpandMoreIcon$1, null)
  }, /* @__PURE__ */ React.createElement(Typography$1, null, "Dry-run results")), /* @__PURE__ */ React.createElement(Divider, {
    orientation: "horizontal"
  }), /* @__PURE__ */ React.createElement(AccordionDetails, {
    className: classes.content
  }, /* @__PURE__ */ React.createElement(DryRunResultsList, null), /* @__PURE__ */ React.createElement(Divider, {
    orientation: "horizontal"
  }), /* @__PURE__ */ React.createElement(DryRunResultsView, null))));
}

const useStyles$5 = makeStyles((theme) => ({
  button: {
    padding: theme.spacing(1)
  },
  buttons: {
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  buttonsGap: {
    flex: "1 1 auto"
  },
  buttonsDivider: {
    marginBottom: theme.spacing(1)
  }
}));
function TemplateEditorBrowser(props) {
  var _a, _b;
  const classes = useStyles$5();
  const directoryEditor = useDirectoryEditor();
  const changedFiles = directoryEditor.files.filter((file) => file.dirty);
  const handleClose = () => {
    if (!props.onClose) {
      return;
    }
    if (changedFiles.length > 0) {
      const accepted = window.confirm("Are you sure? Unsaved changes will be lost");
      if (!accepted) {
        return;
      }
    }
    props.onClose();
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: classes.buttons
  }, /* @__PURE__ */ React.createElement(Tooltip, {
    title: "Save all files"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    className: classes.button,
    disabled: directoryEditor.files.every((file) => !file.dirty),
    onClick: () => directoryEditor.save()
  }, /* @__PURE__ */ React.createElement(SaveIcon, null))), /* @__PURE__ */ React.createElement(Tooltip, {
    title: "Reload directory"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    className: classes.button,
    onClick: () => directoryEditor.reload()
  }, /* @__PURE__ */ React.createElement(RefreshIcon, null))), /* @__PURE__ */ React.createElement("div", {
    className: classes.buttonsGap
  }), /* @__PURE__ */ React.createElement(Tooltip, {
    title: "Close directory"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    className: classes.button,
    onClick: handleClose
  }, /* @__PURE__ */ React.createElement(CloseIcon, null)))), /* @__PURE__ */ React.createElement(Divider$1, {
    className: classes.buttonsDivider
  }), /* @__PURE__ */ React.createElement(FileBrowser, {
    selected: (_b = (_a = directoryEditor.selectedFile) == null ? void 0 : _a.path) != null ? _b : "",
    onSelect: directoryEditor.setSelectedFile,
    filePaths: directoryEditor.files.map((file) => file.path)
  }));
}

const useStyles$4 = makeStyles$1({
  containerWrapper: {
    position: "relative",
    width: "100%",
    height: "100%"
  },
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "auto"
  }
});
class ErrorBoundary extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      shouldRender: true
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.invalidator !== this.props.invalidator) {
      this.setState({ shouldRender: true });
    }
  }
  componentDidCatch(error) {
    this.props.setErrorText(error.message);
    this.setState({ shouldRender: false });
  }
  render() {
    return this.state.shouldRender ? this.props.children : null;
  }
}
function isJsonObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function TemplateEditorForm(props) {
  const {
    content,
    contentIsSpec,
    data,
    onUpdate,
    onDryRun,
    setErrorText,
    fieldExtensions = []
  } = props;
  const classes = useStyles$4();
  const apiHolder = useApiHolder();
  const [steps, setSteps] = useState();
  const fields = useMemo(() => {
    return Object.fromEntries(fieldExtensions.map(({ name, component }) => [name, component]));
  }, [fieldExtensions]);
  useDebounce(() => {
    try {
      if (!content) {
        setSteps(void 0);
        return;
      }
      const parsed = yaml.parse(content);
      if (!isJsonObject(parsed)) {
        setSteps(void 0);
        return;
      }
      let rootObj = parsed;
      if (!contentIsSpec) {
        const isTemplate = String(parsed.kind).toLocaleLowerCase("en-US") === "template";
        if (!isTemplate) {
          setSteps(void 0);
          return;
        }
        rootObj = isJsonObject(parsed.spec) ? parsed.spec : {};
      }
      const { parameters } = rootObj;
      if (!Array.isArray(parameters)) {
        setErrorText("Template parameters must be an array");
        setSteps(void 0);
        return;
      }
      const fieldValidators = Object.fromEntries(fieldExtensions.map(({ name, validation }) => [name, validation]));
      setErrorText();
      setSteps(parameters.flatMap((param) => isJsonObject(param) ? [
        {
          title: String(param.title),
          schema: param,
          validate: createValidator(param, fieldValidators, {
            apiHolder
          })
        }
      ] : []));
    } catch (e) {
      setErrorText(e.message);
    }
  }, 250, [contentIsSpec, content, apiHolder]);
  if (!steps) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", {
    className: classes.containerWrapper
  }, /* @__PURE__ */ React.createElement("div", {
    className: classes.container
  }, /* @__PURE__ */ React.createElement(ErrorBoundary, {
    invalidator: steps,
    setErrorText
  }, /* @__PURE__ */ React.createElement(MultistepJsonForm, {
    steps,
    fields,
    formData: data,
    onChange: (e) => onUpdate(e.formData),
    onReset: () => onUpdate({}),
    finishButtonLabel: onDryRun && "Try It",
    onFinish: onDryRun && (() => onDryRun(data))
  }))));
}
function TemplateEditorFormDirectoryEditorDryRun(props) {
  const { setErrorText, fieldExtensions = [] } = props;
  const dryRun = useDryRun();
  const directoryEditor = useDirectoryEditor();
  const { selectedFile } = directoryEditor;
  const [data, setData] = useState({});
  const handleDryRun = async () => {
    if (!selectedFile) {
      return;
    }
    await dryRun.execute({
      templateContent: selectedFile.content,
      values: data,
      files: directoryEditor.files
    });
  };
  const content = selectedFile && selectedFile.path.match(/\.ya?ml$/) ? selectedFile.content : void 0;
  return /* @__PURE__ */ React.createElement(TemplateEditorForm, {
    onDryRun: handleDryRun,
    fieldExtensions,
    setErrorText,
    content,
    data,
    onUpdate: setData
  });
}
TemplateEditorForm.DirectoryEditorDryRun = TemplateEditorFormDirectoryEditorDryRun;

const useStyles$3 = makeStyles((theme) => ({
  container: {
    position: "relative",
    width: "100%",
    height: "100%"
  },
  codeMirror: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  errorPanel: {
    color: theme.palette.error.main,
    lineHeight: 2,
    margin: theme.spacing(0, 1)
  },
  floatingButtons: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(3)
  },
  floatingButton: {
    padding: theme.spacing(1)
  }
}));
function TemplateEditorTextArea(props) {
  const { errorText } = props;
  const classes = useStyles$3();
  const panelExtension = useMemo(() => {
    if (!errorText) {
      return showPanel.of(null);
    }
    const dom = document.createElement("div");
    dom.classList.add(classes.errorPanel);
    dom.textContent = errorText;
    return showPanel.of(() => ({ dom, bottom: true }));
  }, [classes, errorText]);
  useKeyboardEvent((e) => e.key === "s" && (e.ctrlKey || e.metaKey), (e) => {
    e.preventDefault();
    if (props.onSave) {
      props.onSave();
    }
  });
  return /* @__PURE__ */ React.createElement("div", {
    className: classes.container
  }, /* @__PURE__ */ React.createElement(CodeMirror, {
    className: classes.codeMirror,
    theme: "dark",
    height: "100%",
    extensions: [StreamLanguage.define(yaml$1), panelExtension],
    value: props.content,
    onChange: props.onUpdate
  }), (props.onSave || props.onReload) && /* @__PURE__ */ React.createElement("div", {
    className: classes.floatingButtons
  }, /* @__PURE__ */ React.createElement(Paper, null, props.onSave && /* @__PURE__ */ React.createElement(Tooltip, {
    title: "Save file"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    className: classes.floatingButton,
    onClick: () => {
      var _a;
      return (_a = props.onSave) == null ? void 0 : _a.call(props);
    }
  }, /* @__PURE__ */ React.createElement(SaveIcon, null))), props.onReload && /* @__PURE__ */ React.createElement(Tooltip, {
    title: "Reload file"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    className: classes.floatingButton,
    onClick: () => {
      var _a;
      return (_a = props.onReload) == null ? void 0 : _a.call(props);
    }
  }, /* @__PURE__ */ React.createElement(RefreshIcon, null))))));
}
function TemplateEditorDirectoryEditorTextArea(props) {
  var _a, _b;
  const directoryEditor = useDirectoryEditor();
  const actions = ((_a = directoryEditor.selectedFile) == null ? void 0 : _a.dirty) ? {
    onSave: () => directoryEditor.save(),
    onReload: () => directoryEditor.reload()
  } : {
    onReload: () => directoryEditor.reload()
  };
  return /* @__PURE__ */ React.createElement(TemplateEditorTextArea, {
    errorText: props.errorText,
    content: (_b = directoryEditor.selectedFile) == null ? void 0 : _b.content,
    onUpdate: (content) => {
      var _a2;
      return (_a2 = directoryEditor.selectedFile) == null ? void 0 : _a2.updateContent(content);
    },
    ...actions
  });
}
TemplateEditorTextArea.DirectoryEditor = TemplateEditorDirectoryEditorTextArea;

const useStyles$2 = makeStyles({
  root: {
    gridArea: "pageContent",
    display: "grid",
    gridTemplateAreas: `
      "browser editor preview"
      "results results results"
    `,
    gridTemplateColumns: "1fr 3fr 2fr",
    gridTemplateRows: "1fr auto"
  },
  browser: {
    gridArea: "browser",
    overflow: "auto"
  },
  editor: {
    gridArea: "editor",
    overflow: "auto"
  },
  preview: {
    gridArea: "preview",
    overflow: "auto"
  },
  results: {
    gridArea: "results"
  }
});
const TemplateEditor = (props) => {
  const classes = useStyles$2();
  const [errorText, setErrorText] = useState();
  return /* @__PURE__ */ React.createElement(DirectoryEditorProvider, {
    directory: props.directory
  }, /* @__PURE__ */ React.createElement(DryRunProvider, null, /* @__PURE__ */ React.createElement("main", {
    className: classes.root
  }, /* @__PURE__ */ React.createElement("section", {
    className: classes.browser
  }, /* @__PURE__ */ React.createElement(TemplateEditorBrowser, {
    onClose: props.onClose
  })), /* @__PURE__ */ React.createElement("section", {
    className: classes.editor
  }, /* @__PURE__ */ React.createElement(TemplateEditorTextArea.DirectoryEditor, {
    errorText
  })), /* @__PURE__ */ React.createElement("section", {
    className: classes.preview
  }, /* @__PURE__ */ React.createElement(TemplateEditorForm.DirectoryEditorDryRun, {
    setErrorText,
    fieldExtensions: props.fieldExtensions
  })), /* @__PURE__ */ React.createElement("section", {
    className: classes.results
  }, /* @__PURE__ */ React.createElement(DryRunResults, null)))));
};

const EXAMPLE_TEMPLATE_PARAMS_YAML = `# Edit the template parameters below to see how they will render in the scaffolder form UI
parameters:
  - title: Fill in some steps
    required:
      - name
    properties:
      name:
        title: Name
        type: string
        description: Unique name of the component
      owner:
        title: Owner
        type: string
        description: Owner of the component
        ui:field: OwnerPicker
        ui:options:
          allowedKinds:
            - Group
  - title: Choose a location
    required:
      - repoUrl
    properties:
      repoUrl:
        title: Repository Location
        type: string
        ui:field: RepoUrlPicker
        ui:options:
          allowedHosts:
            - github.com
steps:
  - id: fetch-base
    name: Fetch Base
    action: fetch:template
    input:
      url: ./template
      values:
        name: \${{parameters.name}}
`;
const useStyles$1 = makeStyles((theme) => ({
  root: {
    gridArea: "pageContent",
    display: "grid",
    gridTemplateAreas: `
      "controls controls"
      "textArea preview"
    `,
    gridTemplateRows: "auto 1fr",
    gridTemplateColumns: "1fr 1fr"
  },
  controls: {
    gridArea: "controls",
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "center",
    margin: theme.spacing(1)
  },
  textArea: {
    gridArea: "textArea"
  },
  preview: {
    gridArea: "preview"
  }
}));
const TemplateFormPreviewer = ({
  defaultPreviewTemplate = EXAMPLE_TEMPLATE_PARAMS_YAML,
  customFieldExtensions = [],
  onClose
}) => {
  const classes = useStyles$1();
  const alertApi = useApi(alertApiRef);
  const catalogApi = useApi(catalogApiRef);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [errorText, setErrorText] = useState();
  const [templateOptions, setTemplateOptions] = useState([]);
  const [templateYaml, setTemplateYaml] = useState(defaultPreviewTemplate);
  const [formState, setFormState] = useState({});
  const { loading } = useAsync(() => catalogApi.getEntities({
    filter: { kind: "template" },
    fields: [
      "kind",
      "metadata.namespace",
      "metadata.name",
      "metadata.title",
      "spec.parameters",
      "spec.steps",
      "spec.output"
    ]
  }).then(({ items }) => setTemplateOptions(items.map((template) => {
    var _a;
    return {
      label: (_a = template.metadata.title) != null ? _a : humanizeEntityRef(template, { defaultKind: "template" }),
      value: template
    };
  }))).catch((e) => alertApi.post({
    message: `Error loading exisiting templates: ${e.message}`,
    severity: "error"
  })), [catalogApi]);
  const handleSelectChange = useCallback((selected) => {
    setSelectedTemplate(selected);
    setTemplateYaml(yaml.stringify(selected.spec));
  }, [setTemplateYaml]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, loading && /* @__PURE__ */ React.createElement(LinearProgress, null), /* @__PURE__ */ React.createElement("main", {
    className: classes.root
  }, /* @__PURE__ */ React.createElement("div", {
    className: classes.controls
  }, /* @__PURE__ */ React.createElement(FormControl, {
    variant: "outlined",
    size: "small",
    fullWidth: true
  }, /* @__PURE__ */ React.createElement(InputLabel, {
    id: "select-template-label"
  }, "Load Existing Template"), /* @__PURE__ */ React.createElement(Select, {
    value: selectedTemplate,
    label: "Load Existing Template",
    labelId: "select-template-label",
    onChange: (e) => handleSelectChange(e.target.value)
  }, templateOptions.map((option, idx) => /* @__PURE__ */ React.createElement(MenuItem$1, {
    key: idx,
    value: option.value
  }, option.label)))), /* @__PURE__ */ React.createElement(IconButton, {
    size: "medium",
    onClick: onClose
  }, /* @__PURE__ */ React.createElement(CloseIcon, null))), /* @__PURE__ */ React.createElement("div", {
    className: classes.textArea
  }, /* @__PURE__ */ React.createElement(TemplateEditorTextArea, {
    content: templateYaml,
    onUpdate: setTemplateYaml,
    errorText
  })), /* @__PURE__ */ React.createElement("div", {
    className: classes.preview
  }, /* @__PURE__ */ React.createElement(TemplateEditorForm, {
    content: templateYaml,
    contentIsSpec: true,
    fieldExtensions: customFieldExtensions,
    data: formState,
    onUpdate: setFormState,
    setErrorText
  }))));
};

function TemplateEditorPage(props) {
  const [selection, setSelection] = useState();
  let content = null;
  if ((selection == null ? void 0 : selection.type) === "local") {
    content = /* @__PURE__ */ React.createElement(TemplateEditor, {
      directory: selection.directory,
      fieldExtensions: props.customFieldExtensions,
      onClose: () => setSelection(void 0)
    });
  } else if ((selection == null ? void 0 : selection.type) === "form") {
    content = /* @__PURE__ */ React.createElement(TemplateFormPreviewer, {
      defaultPreviewTemplate: props.defaultPreviewTemplate,
      customFieldExtensions: props.customFieldExtensions,
      onClose: () => setSelection(void 0)
    });
  } else {
    content = /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(TemplateEditorIntro, {
      onSelect: (option) => {
        if (option === "local") {
          WebFileSystemAccess.requestDirectoryAccess().then((directory) => setSelection({ type: "local", directory })).catch(() => {
          });
        } else if (option === "form") {
          setSelection({ type: "form" });
        }
      }
    }));
  }
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "home"
  }, /* @__PURE__ */ React.createElement(Header, {
    title: "Template Editor",
    subtitle: "Edit, preview, and try out templates and template forms"
  }), content);
}

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
  name: "ScaffolderReactOwnerListPicker"
});
function getFilterGroups() {
  return [
    {
      name: "Task Owner",
      items: [
        {
          id: "owned",
          label: "Owned",
          icon: SettingsIcon
        },
        {
          id: "all",
          label: "All",
          icon: AllIcon
        }
      ]
    }
  ];
}
const OwnerListPicker = (props) => {
  const { filter, onSelectOwner } = props;
  const classes = useStyles();
  const filterGroups = getFilterGroups();
  return /* @__PURE__ */ React.createElement(Card, {
    className: classes.root
  }, filterGroups.map((group) => /* @__PURE__ */ React.createElement(Fragment, {
    key: group.name
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2",
    className: classes.title
  }, group.name), /* @__PURE__ */ React.createElement(Card, {
    className: classes.groupWrapper
  }, /* @__PURE__ */ React.createElement(List$2, {
    disablePadding: true,
    dense: true
  }, group.items.map((item) => /* @__PURE__ */ React.createElement(MenuItem$1, {
    key: item.id,
    button: true,
    divider: true,
    onClick: () => onSelectOwner(item.id),
    selected: item.id === filter,
    className: classes.menuItem,
    "data-testid": `owner-picker-${item.id}`
  }, item.icon && /* @__PURE__ */ React.createElement(ListItemIcon$1, {
    className: classes.listIcon
  }, /* @__PURE__ */ React.createElement(item.icon, {
    fontSize: "small"
  })), /* @__PURE__ */ React.createElement(ListItemText$1, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1"
  }, item.label)))))))));
};

const CreatedAtColumn = ({ createdAt }) => {
  const createdAtTime = DateTime.fromISO(createdAt);
  const formatted = Interval.fromDateTimes(createdAtTime, DateTime.local()).toDuration().valueOf();
  return /* @__PURE__ */ React.createElement("p", null, humanizeDuration(formatted, { round: true }), " ago");
};

const OwnerEntityColumn = ({ entityRef }) => {
  var _a, _b, _c;
  const catalogApi = useApi(catalogApiRef);
  const { value, loading, error } = useAsync(() => catalogApi.getEntityByRef(entityRef || ""), [catalogApi, entityRef]);
  if (!entityRef) {
    return /* @__PURE__ */ React.createElement("p", null, "Unknown");
  }
  if (loading || error) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(EntityRefLink, {
    entityRef: parseEntityRef(entityRef),
    title: (_c = (_b = (_a = value == null ? void 0 : value.spec) == null ? void 0 : _a.profile) == null ? void 0 : _b.displayName) != null ? _c : value == null ? void 0 : value.metadata.name
  });
};

const TaskStatusColumn = ({ status }) => {
  switch (status) {
    case "processing":
      return /* @__PURE__ */ React.createElement(StatusPending, null, status);
    case "completed":
      return /* @__PURE__ */ React.createElement(StatusOK, null, status);
    case "error":
    default:
      return /* @__PURE__ */ React.createElement(StatusError, null, status);
  }
};

const TemplateTitleColumn = ({ entityRef }) => {
  const scaffolder = useApi(scaffolderApiRef);
  const { value, loading, error } = useAsync(() => scaffolder.getTemplateParameterSchema(entityRef || ""), [scaffolder, entityRef]);
  if (loading || error || !entityRef) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(EntityRefLink, {
    entityRef: parseEntityRef(entityRef),
    title: value == null ? void 0 : value.title
  });
};

const ListTaskPageContent = (props) => {
  var _a;
  const { initiallySelectedFilter = "owned" } = props;
  const scaffolderApi = useApi(scaffolderApiRef);
  const rootLink = useRouteRef(rootRouteRef);
  const [ownerFilter, setOwnerFilter] = useState(initiallySelectedFilter);
  const { value, loading, error } = useAsync(() => {
    var _a2;
    if (scaffolderApi.listTasks) {
      return (_a2 = scaffolderApi.listTasks) == null ? void 0 : _a2.call(scaffolderApi, { filterByOwnership: ownerFilter });
    }
    console.warn("listTasks is not implemented in the scaffolderApi, please make sure to implement this method.");
    return Promise.resolve({ tasks: [] });
  }, [scaffolderApi, ownerFilter]);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ErrorPanel, {
      error
    }), /* @__PURE__ */ React.createElement(EmptyState, {
      missing: "info",
      title: "No information to display",
      description: "There is no Tasks or there was an issue communicating with backend."
    }));
  }
  return /* @__PURE__ */ React.createElement(CatalogFilterLayout, null, /* @__PURE__ */ React.createElement(CatalogFilterLayout.Filters, null, /* @__PURE__ */ React.createElement(OwnerListPicker, {
    filter: ownerFilter,
    onSelectOwner: (id) => setOwnerFilter(id)
  })), /* @__PURE__ */ React.createElement(CatalogFilterLayout.Content, null, /* @__PURE__ */ React.createElement(MaterialTable, {
    data: (_a = value == null ? void 0 : value.tasks) != null ? _a : [],
    title: "Tasks",
    columns: [
      {
        title: "Task ID",
        field: "id",
        render: (row) => /* @__PURE__ */ React.createElement(Link$1, {
          to: `${rootLink()}/tasks/${row.id}`
        }, row.id)
      },
      {
        title: "Template",
        render: (row) => {
          var _a2;
          return /* @__PURE__ */ React.createElement(TemplateTitleColumn, {
            entityRef: (_a2 = row.spec.templateInfo) == null ? void 0 : _a2.entityRef
          });
        }
      },
      {
        title: "Created",
        field: "createdAt",
        render: (row) => /* @__PURE__ */ React.createElement(CreatedAtColumn, {
          createdAt: row.createdAt
        })
      },
      {
        title: "Owner",
        field: "createdBy",
        render: (row) => {
          var _a2, _b;
          return /* @__PURE__ */ React.createElement(OwnerEntityColumn, {
            entityRef: (_b = (_a2 = row.spec) == null ? void 0 : _a2.user) == null ? void 0 : _b.ref
          });
        }
      },
      {
        title: "Status",
        field: "status",
        render: (row) => /* @__PURE__ */ React.createElement(TaskStatusColumn, {
          status: row.status
        })
      }
    ]
  })));
};
const ListTasksPage = (props) => {
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "home"
  }, /* @__PURE__ */ React.createElement(Header, {
    pageTitleOverride: "Templates Tasks",
    title: /* @__PURE__ */ React.createElement(React.Fragment, null, "List template tasks ", /* @__PURE__ */ React.createElement(Lifecycle, {
      shorthand: true,
      alpha: true
    })),
    subtitle: "All tasks that have been started"
  }), /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(ListTaskPageContent, {
    ...props
  })));
};

const Router = (props) => {
  const { groups, components = {}, defaultPreviewTemplate } = props;
  const { TemplateCardComponent, TaskPageComponent } = components;
  const outlet = useOutlet();
  const TaskPageElement = TaskPageComponent != null ? TaskPageComponent : TaskPage;
  const customFieldExtensions = useElementFilter(outlet, (elements) => elements.selectByComponentData({
    key: FIELD_EXTENSION_WRAPPER_KEY
  }).findComponentData({
    key: FIELD_EXTENSION_KEY
  }));
  const fieldExtensions = [
    ...customFieldExtensions,
    ...DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS.filter(({ name }) => !customFieldExtensions.some((customFieldExtension) => customFieldExtension.name === name))
  ];
  return /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, {
    element: /* @__PURE__ */ React.createElement(ScaffolderPage, {
      groups,
      TemplateCardComponent,
      contextMenu: props.contextMenu
    })
  }), /* @__PURE__ */ React.createElement(Route, {
    path: selectedTemplateRouteRef.path,
    element: /* @__PURE__ */ React.createElement(SecretsContextProvider, null, /* @__PURE__ */ React.createElement(TemplatePage, {
      customFieldExtensions: fieldExtensions
    }))
  }), /* @__PURE__ */ React.createElement(Route, {
    path: scaffolderListTaskRouteRef.path,
    element: /* @__PURE__ */ React.createElement(ListTasksPage, null)
  }), /* @__PURE__ */ React.createElement(Route, {
    path: scaffolderTaskRouteRef.path,
    element: /* @__PURE__ */ React.createElement(TaskPageElement, null)
  }), /* @__PURE__ */ React.createElement(Route, {
    path: actionsRouteRef.path,
    element: /* @__PURE__ */ React.createElement(ActionsPage, null)
  }), /* @__PURE__ */ React.createElement(Route, {
    path: editRouteRef.path,
    element: /* @__PURE__ */ React.createElement(SecretsContextProvider, null, /* @__PURE__ */ React.createElement(TemplateEditorPage, {
      defaultPreviewTemplate,
      customFieldExtensions: fieldExtensions
    }))
  }), /* @__PURE__ */ React.createElement(Route, {
    path: "preview",
    element: /* @__PURE__ */ React.createElement(Navigate, {
      to: "../edit"
    })
  }));
};

export { Router };
//# sourceMappingURL=Router-09b6a7c3.esm.js.map
