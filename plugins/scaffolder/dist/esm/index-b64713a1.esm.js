import { parseEntityRef, KubernetesValidatorFunctions, makeValidator, RELATION_OWNED_BY } from '@backstage/catalog-model';
import { createApiRef, useApi, identityApiRef, attachComponentData, createExternalRouteRef, createRouteRef, createSubRouteRef, createPlugin, createApiFactory, discoveryApiRef, fetchApiRef, createRoutableExtension, alertApiRef, useApp, useRouteRef } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import qs from 'qs';
import ObservableImpl from 'zen-observable';
import { catalogApiRef, humanizeEntityRef, useEntityTypeFilter, entityRouteRef } from '@backstage/plugin-catalog-react';
import { TextField, FormControl as FormControl$1, Box, Typography, FormControlLabel, Checkbox, makeStyles, Grid, StepButton, Paper, Button, CircularProgress } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useCallback, useEffect, useState, createContext, useContext, useMemo, memo } from 'react';
import useAsync from 'react-use/lib/useAsync';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import { Autocomplete as Autocomplete$1 } from '@material-ui/lab';
import { scmIntegrationsApiRef, scmAuthApiRef } from '@backstage/integration-react';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { Select, Progress, Link, Page, Header, Content, ErrorPage, LogViewer } from '@backstage/core-components';
import useDebounce from 'react-use/lib/useDebounce';
import capitalize from 'lodash/capitalize';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid$1 from '@material-ui/core/Grid';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles as makeStyles$1, createStyles } from '@material-ui/core/styles';
import Typography$1 from '@material-ui/core/Typography';
import Cancel from '@material-ui/icons/Cancel';
import Check from '@material-ui/icons/Check';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import classNames from 'classnames';
import { DateTime, Interval } from 'luxon';
import { useNavigate, useParams } from 'react-router';
import useInterval from 'react-use/lib/useInterval';
import { useImmerReducer } from 'use-immer';
import LanguageIcon from '@material-ui/icons/Language';

const scaffolderApiRef = createApiRef({
  id: "plugin.scaffolder.service"
});
class ScaffolderClient {
  constructor(options) {
    var _a, _b;
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = (_a = options.fetchApi) != null ? _a : { fetch };
    this.scmIntegrationsApi = options.scmIntegrationsApi;
    this.useLongPollingLogs = (_b = options.useLongPollingLogs) != null ? _b : false;
    this.identityApi = options.identityApi;
  }
  async listTasks(options) {
    if (!this.identityApi) {
      throw new Error("IdentityApi is not available in the ScaffolderClient, please pass through the IdentityApi to the ScaffolderClient constructor in order to use the listTasks method");
    }
    const baseUrl = await this.discoveryApi.getBaseUrl("scaffolder");
    const { userEntityRef } = await this.identityApi.getBackstageIdentity();
    const query = qs.stringify(options.filterByOwnership === "owned" ? { createdBy: userEntityRef } : {});
    const response = await this.fetchApi.fetch(`${baseUrl}/v2/tasks?${query}`);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return await response.json();
  }
  async getIntegrationsList(options) {
    const integrations = [
      ...this.scmIntegrationsApi.azure.list(),
      ...this.scmIntegrationsApi.bitbucket.list().filter((item) => !this.scmIntegrationsApi.bitbucketCloud.byHost(item.config.host) && !this.scmIntegrationsApi.bitbucketServer.byHost(item.config.host)),
      ...this.scmIntegrationsApi.bitbucketCloud.list(),
      ...this.scmIntegrationsApi.bitbucketServer.list(),
      ...this.scmIntegrationsApi.gerrit.list(),
      ...this.scmIntegrationsApi.github.list(),
      ...this.scmIntegrationsApi.gitlab.list()
    ].map((c) => ({ type: c.type, title: c.title, host: c.config.host })).filter((c) => options.allowedHosts.includes(c.host));
    return {
      integrations
    };
  }
  async getTemplateParameterSchema(templateRef) {
    const { namespace, kind, name } = parseEntityRef(templateRef, {
      defaultKind: "template"
    });
    const baseUrl = await this.discoveryApi.getBaseUrl("scaffolder");
    const templatePath = [namespace, kind, name].map((s) => encodeURIComponent(s)).join("/");
    const url = `${baseUrl}/v2/templates/${templatePath}/parameter-schema`;
    const response = await this.fetchApi.fetch(url);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    const schema = await response.json();
    return schema;
  }
  async scaffold(options) {
    const { templateRef, values, secrets = {} } = options;
    const url = `${await this.discoveryApi.getBaseUrl("scaffolder")}/v2/tasks`;
    const response = await this.fetchApi.fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        templateRef,
        values: { ...values },
        secrets
      })
    });
    if (response.status !== 201) {
      const status = `${response.status} ${response.statusText}`;
      const body = await response.text();
      throw new Error(`Backend request failed, ${status} ${body.trim()}`);
    }
    const { id } = await response.json();
    return { taskId: id };
  }
  async getTask(taskId) {
    const baseUrl = await this.discoveryApi.getBaseUrl("scaffolder");
    const url = `${baseUrl}/v2/tasks/${encodeURIComponent(taskId)}`;
    const response = await this.fetchApi.fetch(url);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return await response.json();
  }
  streamLogs(options) {
    if (this.useLongPollingLogs) {
      return this.streamLogsPolling(options);
    }
    return this.streamLogsEventStream(options);
  }
  async dryRun(options) {
    const baseUrl = await this.discoveryApi.getBaseUrl("scaffolder");
    const response = await this.fetchApi.fetch(`${baseUrl}/v2/dry-run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        template: options.template,
        values: options.values,
        secrets: options.secrets,
        directoryContents: options.directoryContents
      })
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response.json();
  }
  streamLogsEventStream({
    taskId,
    after
  }) {
    return new ObservableImpl((subscriber) => {
      const params = new URLSearchParams();
      if (after !== void 0) {
        params.set("after", String(Number(after)));
      }
      this.discoveryApi.getBaseUrl("scaffolder").then((baseUrl) => {
        const url = `${baseUrl}/v2/tasks/${encodeURIComponent(taskId)}/eventstream`;
        const eventSource = new EventSource(url, { withCredentials: true });
        eventSource.addEventListener("log", (event) => {
          if (event.data) {
            try {
              subscriber.next(JSON.parse(event.data));
            } catch (ex) {
              subscriber.error(ex);
            }
          }
        });
        eventSource.addEventListener("completion", (event) => {
          if (event.data) {
            try {
              subscriber.next(JSON.parse(event.data));
            } catch (ex) {
              subscriber.error(ex);
            }
          }
          eventSource.close();
          subscriber.complete();
        });
        eventSource.addEventListener("error", (event) => {
          subscriber.error(event);
        });
      }, (error) => {
        subscriber.error(error);
      });
    });
  }
  streamLogsPolling({
    taskId,
    after: inputAfter
  }) {
    let after = inputAfter;
    return new ObservableImpl((subscriber) => {
      this.discoveryApi.getBaseUrl("scaffolder").then(async (baseUrl) => {
        while (!subscriber.closed) {
          const url = `${baseUrl}/v2/tasks/${encodeURIComponent(taskId)}/events?${qs.stringify({ after })}`;
          const response = await this.fetchApi.fetch(url);
          if (!response.ok) {
            await new Promise((resolve) => setTimeout(resolve, 1e3));
            continue;
          }
          const logs = await response.json();
          for (const event of logs) {
            after = Number(event.id);
            subscriber.next(event);
            if (event.type === "completion") {
              subscriber.complete();
              return;
            }
          }
        }
      });
    });
  }
  async listActions() {
    const baseUrl = await this.discoveryApi.getBaseUrl("scaffolder");
    const response = await this.fetchApi.fetch(`${baseUrl}/v2/actions`);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return await response.json();
  }
}

const EntityPicker = (props) => {
  var _a, _b, _c, _d;
  const {
    onChange,
    schema: { title = "Entity", description = "An entity from the catalog" },
    required,
    uiSchema,
    rawErrors,
    formData,
    idSchema
  } = props;
  const allowedKinds = (_a = uiSchema["ui:options"]) == null ? void 0 : _a.allowedKinds;
  const defaultKind = (_b = uiSchema["ui:options"]) == null ? void 0 : _b.defaultKind;
  const catalogApi = useApi(catalogApiRef);
  const { value: entities, loading } = useAsync(() => catalogApi.getEntities(allowedKinds ? { filter: { kind: allowedKinds } } : void 0));
  const entityRefs = entities == null ? void 0 : entities.items.map((e) => humanizeEntityRef(e, { defaultKind }));
  const onSelect = useCallback((_, value) => {
    onChange(value || "");
  }, [onChange]);
  useEffect(() => {
    if ((entityRefs == null ? void 0 : entityRefs.length) === 1) {
      onChange(entityRefs[0]);
    }
  }, [entityRefs, onChange]);
  return /* @__PURE__ */ React.createElement(FormControl, {
    margin: "normal",
    required,
    error: (rawErrors == null ? void 0 : rawErrors.length) > 0 && !formData
  }, /* @__PURE__ */ React.createElement(Autocomplete, {
    disabled: (entityRefs == null ? void 0 : entityRefs.length) === 1,
    id: idSchema == null ? void 0 : idSchema.$id,
    value: formData || "",
    loading,
    onChange: onSelect,
    options: entityRefs || [],
    autoSelect: true,
    freeSolo: (_d = (_c = uiSchema["ui:options"]) == null ? void 0 : _c.allowArbitraryValues) != null ? _d : true,
    renderInput: (params) => /* @__PURE__ */ React.createElement(TextField, {
      ...params,
      label: title,
      margin: "normal",
      helperText: description,
      variant: "outlined",
      required,
      InputProps: params.InputProps
    })
  }));
};

const EntityNamePicker = (props) => {
  const {
    onChange,
    required,
    schema: { title = "Name", description = "Unique name of the component" },
    rawErrors,
    formData,
    uiSchema: { "ui:autofocus": autoFocus },
    idSchema,
    placeholder
  } = props;
  return /* @__PURE__ */ React.createElement(TextField, {
    id: idSchema == null ? void 0 : idSchema.$id,
    label: title,
    placeholder,
    helperText: description,
    required,
    value: formData != null ? formData : "",
    onChange: ({ target: { value } }) => onChange(value),
    margin: "normal",
    error: (rawErrors == null ? void 0 : rawErrors.length) > 0 && !formData,
    inputProps: { autoFocus }
  });
};

const entityNamePickerValidation = (value, validation) => {
  if (!KubernetesValidatorFunctions.isValidObjectName(value)) {
    validation.addError("must start and end with an alphanumeric character, and contain only alphanumeric characters, hyphens, underscores, and periods. Maximum length is 63 characters.");
  }
};

const EntityTagsPicker = (props) => {
  var _a;
  const { formData, onChange, uiSchema } = props;
  const catalogApi = useApi(catalogApiRef);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const tagValidator = makeValidator().isValidTag;
  const kinds = (_a = uiSchema["ui:options"]) == null ? void 0 : _a.kinds;
  const { loading, value: existingTags } = useAsync(async () => {
    const tagsRequest = { fields: ["metadata.tags"] };
    if (kinds) {
      tagsRequest.filter = { kind: kinds };
    }
    const entities = await catalogApi.getEntities(tagsRequest);
    return [
      ...new Set(entities.items.flatMap((e) => {
        var _a2;
        return (_a2 = e.metadata) == null ? void 0 : _a2.tags;
      }).filter(Boolean))
    ].sort();
  });
  const setTags = (_, values) => {
    let hasError = false;
    let addDuplicate = false;
    const currentTags = formData || [];
    if ((values == null ? void 0 : values.length) && currentTags.length < values.length) {
      const newTag = values[values.length - 1] = values[values.length - 1].toLocaleLowerCase("en-US").trim();
      hasError = !tagValidator(newTag);
      addDuplicate = currentTags.indexOf(newTag) !== -1;
    }
    setInputError(hasError);
    setInputValue(!hasError ? "" : inputValue);
    if (!hasError && !addDuplicate) {
      onChange(values || []);
    }
  };
  useEffectOnce(() => onChange(formData || []));
  return /* @__PURE__ */ React.createElement(FormControl$1, {
    margin: "normal"
  }, /* @__PURE__ */ React.createElement(Autocomplete$1, {
    multiple: true,
    freeSolo: true,
    filterSelectedOptions: true,
    onChange: setTags,
    value: formData || [],
    inputValue,
    loading,
    options: existingTags || [],
    ChipProps: { size: "small" },
    renderInput: (params) => /* @__PURE__ */ React.createElement(TextField, {
      ...params,
      label: "Tags",
      onChange: (e) => setInputValue(e.target.value),
      error: inputError,
      helperText: "Add any relevant tags, hit 'Enter' to add new tags. Valid format: [a-z0-9+#] separated by [-], at most 63 characters"
    })
  }));
};

const OwnerPicker = (props) => {
  var _a;
  const {
    schema: { title = "Owner", description = "The owner of the component" },
    uiSchema,
    ...restProps
  } = props;
  const ownerUiSchema = {
    ...uiSchema,
    "ui:options": {
      allowedKinds: ((_a = uiSchema["ui:options"]) == null ? void 0 : _a.allowedKinds) || [
        "Group",
        "User"
      ],
      defaultKind: "Group"
    }
  };
  return /* @__PURE__ */ React.createElement(EntityPicker, {
    ...restProps,
    schema: { title, description },
    uiSchema: ownerUiSchema
  });
};

const GithubRepoPicker = (props) => {
  const { allowedOwners = [], rawErrors, state, onChange } = props;
  const ownerItems = allowedOwners ? allowedOwners.map((i) => ({ label: i, value: i })) : [{ label: "Loading...", value: "loading" }];
  const { owner, repoName } = state;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormControl, {
    margin: "normal",
    required: true,
    error: (rawErrors == null ? void 0 : rawErrors.length) > 0 && !owner
  }, (allowedOwners == null ? void 0 : allowedOwners.length) ? /* @__PURE__ */ React.createElement(Select, {
    native: true,
    label: "Owner Available",
    onChange: (s) => onChange({ owner: String(Array.isArray(s) ? s[0] : s) }),
    disabled: allowedOwners.length === 1,
    selected: owner,
    items: ownerItems
  }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(InputLabel, {
    htmlFor: "ownerInput"
  }, "Owner"), /* @__PURE__ */ React.createElement(Input, {
    id: "ownerInput",
    onChange: (e) => onChange({ owner: e.target.value }),
    value: owner
  })), /* @__PURE__ */ React.createElement(FormHelperText, null, "The organization, user or project that this repo will belong to")), /* @__PURE__ */ React.createElement(FormControl, {
    margin: "normal",
    required: true,
    error: (rawErrors == null ? void 0 : rawErrors.length) > 0 && !repoName
  }, /* @__PURE__ */ React.createElement(InputLabel, {
    htmlFor: "repoNameInput"
  }, "Repository"), /* @__PURE__ */ React.createElement(Input, {
    id: "repoNameInput",
    onChange: (e) => onChange({ repoName: e.target.value }),
    value: repoName
  }), /* @__PURE__ */ React.createElement(FormHelperText, null, "The name of the repository")));
};

const GitlabRepoPicker = (props) => {
  const { allowedOwners = [], rawErrors, state, onChange } = props;
  const ownerItems = allowedOwners ? allowedOwners.map((i) => ({ label: i, value: i })) : [{ label: "Loading...", value: "loading" }];
  const { owner, repoName } = state;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormControl, {
    margin: "normal",
    required: true,
    error: (rawErrors == null ? void 0 : rawErrors.length) > 0 && !owner
  }, (allowedOwners == null ? void 0 : allowedOwners.length) ? /* @__PURE__ */ React.createElement(Select, {
    native: true,
    label: "Owner Available",
    onChange: (selected) => onChange({
      owner: String(Array.isArray(selected) ? selected[0] : selected)
    }),
    disabled: allowedOwners.length === 1,
    selected: owner,
    items: ownerItems
  }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(InputLabel, {
    htmlFor: "ownerInput"
  }, "Owner"), /* @__PURE__ */ React.createElement(Input, {
    id: "ownerInput",
    onChange: (e) => onChange({ owner: e.target.value }),
    value: owner
  })), /* @__PURE__ */ React.createElement(FormHelperText, null, "The organization, groups, subgroups, user, project (also known as namespaces in gitlab), that this repo will belong to")), /* @__PURE__ */ React.createElement(FormControl, {
    margin: "normal",
    required: true,
    error: (rawErrors == null ? void 0 : rawErrors.length) > 0 && !repoName
  }, /* @__PURE__ */ React.createElement(InputLabel, {
    htmlFor: "repoNameInput"
  }, "Repository"), /* @__PURE__ */ React.createElement(Input, {
    id: "repoNameInput",
    onChange: (e) => onChange({ repoName: e.target.value }),
    value: repoName
  }), /* @__PURE__ */ React.createElement(FormHelperText, null, "The name of the repository")));
};

const AzureRepoPicker = (props) => {
  const { rawErrors, state, onChange } = props;
  const { organization, repoName, owner } = state;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormControl, {
    margin: "normal",
    required: true,
    error: (rawErrors == null ? void 0 : rawErrors.length) > 0 && !organization
  }, /* @__PURE__ */ React.createElement(InputLabel, {
    htmlFor: "orgInput"
  }, "Organization"), /* @__PURE__ */ React.createElement(Input, {
    id: "orgInput",
    onChange: (e) => onChange({ organization: e.target.value }),
    value: organization
  }), /* @__PURE__ */ React.createElement(FormHelperText, null, "The organization that this repo will belong to")), /* @__PURE__ */ React.createElement(FormControl, {
    margin: "normal",
    required: true,
    error: (rawErrors == null ? void 0 : rawErrors.length) > 0 && !owner
  }, /* @__PURE__ */ React.createElement(InputLabel, {
    htmlFor: "ownerInput"
  }, "Owner"), /* @__PURE__ */ React.createElement(Input, {
    id: "ownerInput",
    onChange: (e) => onChange({ owner: e.target.value }),
    value: owner
  }), /* @__PURE__ */ React.createElement(FormHelperText, null, "The Owner that this repo will belong to")), /* @__PURE__ */ React.createElement(FormControl, {
    margin: "normal",
    required: true,
    error: (rawErrors == null ? void 0 : rawErrors.length) > 0 && !repoName
  }, /* @__PURE__ */ React.createElement(InputLabel, {
    htmlFor: "repoNameInput"
  }, "Repository"), /* @__PURE__ */ React.createElement(Input, {
    id: "repoNameInput",
    onChange: (e) => onChange({ repoName: e.target.value }),
    value: repoName
  }), /* @__PURE__ */ React.createElement(FormHelperText, null, "The name of the repository")));
};

const BitbucketRepoPicker = (props) => {
  const { onChange, rawErrors, state } = props;
  const { host, workspace, project, repoName } = state;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, host === "bitbucket.org" && /* @__PURE__ */ React.createElement(FormControl, {
    margin: "normal",
    required: true,
    error: (rawErrors == null ? void 0 : rawErrors.length) > 0 && !workspace
  }, /* @__PURE__ */ React.createElement(InputLabel, {
    htmlFor: "workspaceInput"
  }, "Workspace"), /* @__PURE__ */ React.createElement(Input, {
    id: "workspaceInput",
    onChange: (e) => onChange({ workspace: e.target.value }),
    value: workspace
  }), /* @__PURE__ */ React.createElement(FormHelperText, null, "The Organization that this repo will belong to")), /* @__PURE__ */ React.createElement(FormControl, {
    margin: "normal",
    required: true,
    error: (rawErrors == null ? void 0 : rawErrors.length) > 0 && !project
  }, /* @__PURE__ */ React.createElement(InputLabel, {
    htmlFor: "projectInput"
  }, "Project"), /* @__PURE__ */ React.createElement(Input, {
    id: "projectInput",
    onChange: (e) => onChange({ project: e.target.value }),
    value: project
  }), /* @__PURE__ */ React.createElement(FormHelperText, null, "The Project that this repo will belong to")), /* @__PURE__ */ React.createElement(FormControl, {
    margin: "normal",
    required: true,
    error: (rawErrors == null ? void 0 : rawErrors.length) > 0 && !repoName
  }, /* @__PURE__ */ React.createElement(InputLabel, {
    htmlFor: "repoNameInput"
  }, "Repository"), /* @__PURE__ */ React.createElement(Input, {
    id: "repoNameInput",
    onChange: (e) => onChange({ repoName: e.target.value }),
    value: repoName
  }), /* @__PURE__ */ React.createElement(FormHelperText, null, "The name of the repository")));
};

const GerritRepoPicker = (props) => {
  const { onChange, rawErrors, state } = props;
  const { workspace, repoName, owner } = state;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormControl, {
    margin: "normal",
    required: true,
    error: (rawErrors == null ? void 0 : rawErrors.length) > 0 && !workspace
  }, /* @__PURE__ */ React.createElement(InputLabel, {
    htmlFor: "ownerInput"
  }, "Owner"), /* @__PURE__ */ React.createElement(Input, {
    id: "ownerInput",
    onChange: (e) => onChange({ owner: e.target.value }),
    value: owner
  }), /* @__PURE__ */ React.createElement(FormHelperText, null, "The owner of the project")), /* @__PURE__ */ React.createElement(FormControl, {
    margin: "normal",
    required: true,
    error: (rawErrors == null ? void 0 : rawErrors.length) > 0 && !workspace
  }, /* @__PURE__ */ React.createElement(InputLabel, {
    htmlFor: "parentInput"
  }, "Parent"), /* @__PURE__ */ React.createElement(Input, {
    id: "parentInput",
    onChange: (e) => onChange({ workspace: e.target.value }),
    value: workspace
  }), /* @__PURE__ */ React.createElement(FormHelperText, null, "The project parent that the repo will belong to")), /* @__PURE__ */ React.createElement(FormControl, {
    margin: "normal",
    required: true,
    error: (rawErrors == null ? void 0 : rawErrors.length) > 0 && !repoName
  }, /* @__PURE__ */ React.createElement(InputLabel, {
    htmlFor: "repoNameInput"
  }, "Repository"), /* @__PURE__ */ React.createElement(Input, {
    id: "repoNameInput",
    onChange: (e) => onChange({ repoName: e.target.value }),
    value: repoName
  }), /* @__PURE__ */ React.createElement(FormHelperText, null, "The name of the repository")));
};

const RepoUrlPickerHost = (props) => {
  const { host, hosts, onChange, rawErrors } = props;
  const scaffolderApi = useApi(scaffolderApiRef);
  const { value: { integrations } = { integrations: [] }, loading } = useAsync(async () => {
    return await scaffolderApi.getIntegrationsList({
      allowedHosts: hosts != null ? hosts : []
    });
  });
  useEffect(() => {
    if (!host) {
      if (hosts == null ? void 0 : hosts.length) {
        onChange(hosts[0]);
      } else if (integrations == null ? void 0 : integrations.length) {
        onChange(integrations[0].host);
      }
    }
  }, [hosts, host, onChange, integrations]);
  const hostsOptions = integrations ? integrations.filter((i) => (hosts == null ? void 0 : hosts.length) ? hosts == null ? void 0 : hosts.includes(i.host) : true).map((i) => ({ label: i.title, value: i.host })) : [{ label: "Loading...", value: "loading" }];
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormControl, {
    margin: "normal",
    required: true,
    error: (rawErrors == null ? void 0 : rawErrors.length) > 0 && !host
  }, /* @__PURE__ */ React.createElement(Select, {
    native: true,
    disabled: (hosts == null ? void 0 : hosts.length) === 1,
    label: "Host",
    onChange: (s) => onChange(String(Array.isArray(s) ? s[0] : s)),
    selected: host,
    items: hostsOptions,
    "data-testid": "host-select"
  }), /* @__PURE__ */ React.createElement(FormHelperText, null, "The host where the repository will be created")));
};

function serializeRepoPickerUrl(data) {
  if (!data.host) {
    return void 0;
  }
  const params = new URLSearchParams();
  if (data.owner) {
    params.set("owner", data.owner);
  }
  if (data.repoName) {
    params.set("repo", data.repoName);
  }
  if (data.organization) {
    params.set("organization", data.organization);
  }
  if (data.workspace) {
    params.set("workspace", data.workspace);
  }
  if (data.project) {
    params.set("project", data.project);
  }
  return `${data.host}?${params.toString()}`;
}
function parseRepoPickerUrl(url) {
  let host = "";
  let owner = "";
  let repoName = "";
  let organization = "";
  let workspace = "";
  let project = "";
  try {
    if (url) {
      const parsed = new URL(`https://${url}`);
      host = parsed.host;
      owner = parsed.searchParams.get("owner") || "";
      repoName = parsed.searchParams.get("repo") || "";
      organization = parsed.searchParams.get("organization") || "";
      workspace = parsed.searchParams.get("workspace") || "";
      project = parsed.searchParams.get("project") || "";
    }
  } catch {
  }
  return { host, owner, repoName, organization, workspace, project };
}

const SecretsContext = createContext(void 0);
const SecretsContextProvider = ({ children }) => {
  const [secrets, setSecrets] = useState({});
  return /* @__PURE__ */ React.createElement(SecretsContext.Provider, {
    value: { secrets, setSecrets }
  }, children);
};
const useTemplateSecrets = () => {
  const value = useContext(SecretsContext);
  if (!value) {
    throw new Error("useTemplateSecrets must be used within a SecretsContextProvider");
  }
  const { setSecrets: updateSecrets } = value;
  const setSecrets = useCallback((input) => {
    updateSecrets((currentSecrets) => ({ ...currentSecrets, ...input }));
  }, [updateSecrets]);
  return { setSecrets };
};

const RepoUrlPicker = (props) => {
  var _a, _b;
  const { uiSchema, onChange, rawErrors, formData } = props;
  const [state, setState] = useState(parseRepoPickerUrl(formData));
  const integrationApi = useApi(scmIntegrationsApiRef);
  const scmAuthApi = useApi(scmAuthApiRef);
  const { setSecrets } = useTemplateSecrets();
  const allowedHosts = useMemo(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = uiSchema == null ? void 0 : uiSchema["ui:options"]) == null ? void 0 : _a2.allowedHosts) != null ? _b2 : [];
  }, [uiSchema]);
  const allowedOwners = useMemo(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = uiSchema == null ? void 0 : uiSchema["ui:options"]) == null ? void 0 : _a2.allowedOwners) != null ? _b2 : [];
  }, [uiSchema]);
  useEffect(() => {
    onChange(serializeRepoPickerUrl(state));
  }, [state, onChange]);
  useEffect(() => {
    if (allowedOwners.length === 1) {
      setState((prevState) => ({ ...prevState, owner: allowedOwners[0] }));
    }
  }, [setState, allowedOwners]);
  const updateLocalState = useCallback((newState) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  }, [setState]);
  useDebounce(async () => {
    var _a2;
    const { requestUserCredentials } = (_a2 = uiSchema == null ? void 0 : uiSchema["ui:options"]) != null ? _a2 : {};
    if (!requestUserCredentials || !(state.host && state.owner && state.repoName)) {
      return;
    }
    const [host, owner, repoName] = [
      state.host,
      state.owner,
      state.repoName
    ].map(encodeURIComponent);
    const { token } = await scmAuthApi.getCredentials({
      url: `https://${host}/${owner}/${repoName}`,
      additionalScope: {
        repoWrite: true,
        customScopes: requestUserCredentials.additionalScopes
      }
    });
    setSecrets({ [requestUserCredentials.secretsKey]: token });
  }, 500, [state, uiSchema]);
  const hostType = (_b = state.host && ((_a = integrationApi.byHost(state.host)) == null ? void 0 : _a.type)) != null ? _b : null;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(RepoUrlPickerHost, {
    host: state.host,
    hosts: allowedHosts,
    onChange: (host) => setState((prevState) => ({ ...prevState, host })),
    rawErrors
  }), hostType === "github" && /* @__PURE__ */ React.createElement(GithubRepoPicker, {
    allowedOwners,
    rawErrors,
    state,
    onChange: updateLocalState
  }), hostType === "gitlab" && /* @__PURE__ */ React.createElement(GitlabRepoPicker, {
    allowedOwners,
    rawErrors,
    state,
    onChange: updateLocalState
  }), hostType === "bitbucket" && /* @__PURE__ */ React.createElement(BitbucketRepoPicker, {
    rawErrors,
    state,
    onChange: updateLocalState
  }), hostType === "azure" && /* @__PURE__ */ React.createElement(AzureRepoPicker, {
    rawErrors,
    state,
    onChange: updateLocalState
  }), hostType === "gerrit" && /* @__PURE__ */ React.createElement(GerritRepoPicker, {
    rawErrors,
    state,
    onChange: updateLocalState
  }));
};

const repoPickerValidation = (value, validation, context) => {
  var _a;
  try {
    const { host, searchParams } = new URL(`https://${value}`);
    const integrationApi = context.apiHolder.get(scmIntegrationsApiRef);
    if (!host) {
      validation.addError("Incomplete repository location provided, host not provided");
    } else {
      if (((_a = integrationApi == null ? void 0 : integrationApi.byHost(host)) == null ? void 0 : _a.type) === "bitbucket") {
        if (host === "bitbucket.org" && !searchParams.get("workspace")) {
          validation.addError("Incomplete repository location provided, workspace not provided");
        }
        if (!searchParams.get("project")) {
          validation.addError("Incomplete repository location provided, project not provided");
        }
      } else {
        if (!searchParams.get("owner")) {
          validation.addError("Incomplete repository location provided, owner not provided");
        }
      }
      if (!searchParams.get("repo")) {
        validation.addError("Incomplete repository location provided, repo not provided");
      }
    }
  } catch {
    validation.addError("Unable to parse the Repository URL");
  }
};

const OwnedEntityPicker = (props) => {
  var _a, _b;
  const {
    onChange,
    schema: { title = "Entity", description = "An entity from the catalog" },
    required,
    uiSchema,
    rawErrors,
    formData,
    idSchema
  } = props;
  const allowedKinds = (_a = uiSchema["ui:options"]) == null ? void 0 : _a.allowedKinds;
  const defaultKind = (_b = uiSchema["ui:options"]) == null ? void 0 : _b.defaultKind;
  const { ownedEntities, loading } = useOwnedEntities(allowedKinds);
  const entityRefs = ownedEntities == null ? void 0 : ownedEntities.items.map((e) => humanizeEntityRef(e, { defaultKind })).filter((n) => n);
  const onSelect = (_, value) => {
    onChange(value || "");
  };
  return /* @__PURE__ */ React.createElement(FormControl, {
    margin: "normal",
    required,
    error: (rawErrors == null ? void 0 : rawErrors.length) > 0 && !formData
  }, /* @__PURE__ */ React.createElement(Autocomplete, {
    id: idSchema == null ? void 0 : idSchema.$id,
    value: formData || "",
    loading,
    onChange: onSelect,
    options: entityRefs || [],
    autoSelect: true,
    freeSolo: true,
    renderInput: (params) => /* @__PURE__ */ React.createElement(TextField, {
      ...params,
      label: title,
      margin: "normal",
      helperText: description,
      variant: "outlined",
      required,
      InputProps: params.InputProps
    })
  }));
};
function useOwnedEntities(allowedKinds) {
  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);
  const { loading, value: refs } = useAsync(async () => {
    const identity = await identityApi.getBackstageIdentity();
    const identityRefs = identity.ownershipEntityRefs;
    const catalogs = await catalogApi.getEntities(allowedKinds ? {
      filter: {
        kind: allowedKinds,
        [`relations.${RELATION_OWNED_BY}`]: identityRefs || []
      }
    } : {
      filter: {
        [`relations.${RELATION_OWNED_BY}`]: identityRefs || []
      }
    });
    return catalogs;
  }, []);
  const ownedEntities = useMemo(() => {
    return refs;
  }, [refs]);
  return useMemo(() => ({ loading, ownedEntities }), [loading, ownedEntities]);
}

const FIELD_EXTENSION_WRAPPER_KEY = "scaffolder.extensions.wrapper.v1";
const FIELD_EXTENSION_KEY = "scaffolder.extensions.field.v1";
function createScaffolderFieldExtension(options) {
  return {
    expose() {
      const FieldExtensionDataHolder = () => null;
      attachComponentData(FieldExtensionDataHolder, FIELD_EXTENSION_KEY, options);
      return FieldExtensionDataHolder;
    }
  };
}
const ScaffolderFieldExtensions = () => null;
attachComponentData(ScaffolderFieldExtensions, FIELD_EXTENSION_WRAPPER_KEY, true);

const registerComponentRouteRef = createExternalRouteRef({
  id: "register-component",
  optional: true
});
const rootRouteRef = createRouteRef({
  id: "scaffolder"
});
const selectedTemplateRouteRef = createSubRouteRef({
  id: "scaffolder/selected-template",
  parent: rootRouteRef,
  path: "/templates/:templateName"
});
const scaffolderTaskRouteRef = createSubRouteRef({
  id: "scaffolder/task",
  parent: rootRouteRef,
  path: "/tasks/:taskId"
});
const scaffolderListTaskRouteRef = createSubRouteRef({
  id: "scaffolder/list-tasks",
  parent: rootRouteRef,
  path: "/tasks"
});
const actionsRouteRef = createSubRouteRef({
  id: "scaffolder/actions",
  parent: rootRouteRef,
  path: "/actions"
});
const editRouteRef = createSubRouteRef({
  id: "scaffolder/edit",
  parent: rootRouteRef,
  path: "/edit"
});

const scaffolderPlugin = createPlugin({
  id: "scaffolder",
  apis: [
    createApiFactory({
      api: scaffolderApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        scmIntegrationsApi: scmIntegrationsApiRef,
        fetchApi: fetchApiRef,
        identityApi: identityApiRef
      },
      factory: ({ discoveryApi, scmIntegrationsApi, fetchApi, identityApi }) => new ScaffolderClient({
        discoveryApi,
        scmIntegrationsApi,
        fetchApi,
        identityApi
      })
    })
  ],
  routes: {
    root: rootRouteRef
  },
  externalRoutes: {
    registerComponent: registerComponentRouteRef
  }
});
const EntityPickerFieldExtension = scaffolderPlugin.provide(createScaffolderFieldExtension({
  component: EntityPicker,
  name: "EntityPicker"
}));
const EntityNamePickerFieldExtension = scaffolderPlugin.provide(createScaffolderFieldExtension({
  component: EntityNamePicker,
  name: "EntityNamePicker",
  validation: entityNamePickerValidation
}));
const RepoUrlPickerFieldExtension = scaffolderPlugin.provide(createScaffolderFieldExtension({
  component: RepoUrlPicker,
  name: "RepoUrlPicker",
  validation: repoPickerValidation
}));
const OwnerPickerFieldExtension = scaffolderPlugin.provide(createScaffolderFieldExtension({
  component: OwnerPicker,
  name: "OwnerPicker"
}));
const ScaffolderPage = scaffolderPlugin.provide(createRoutableExtension({
  name: "ScaffolderPage",
  component: () => import('./Router-09b6a7c3.esm.js').then((m) => m.Router),
  mountPoint: rootRouteRef
}));
const OwnedEntityPickerFieldExtension = scaffolderPlugin.provide(createScaffolderFieldExtension({
  component: OwnedEntityPicker,
  name: "OwnedEntityPicker"
}));
const EntityTagsPickerFieldExtension = scaffolderPlugin.provide(createScaffolderFieldExtension({
  component: EntityTagsPicker,
  name: "EntityTagsPicker"
}));
const NextScaffolderPage = scaffolderPlugin.provide(createRoutableExtension({
  name: "NextScaffolderPage",
  component: () => import('./index-f46ffb89.esm.js').then((m) => m.Router),
  mountPoint: rootRouteRef
}));

const icon = /* @__PURE__ */ React.createElement(CheckBoxOutlineBlankIcon, {
  fontSize: "small"
});
const checkedIcon = /* @__PURE__ */ React.createElement(CheckBoxIcon, {
  fontSize: "small"
});
const TemplateTypePicker = () => {
  const alertApi = useApi(alertApiRef);
  const { error, loading, availableTypes, selectedTypes, setSelectedTypes } = useEntityTypeFilter();
  if (loading)
    return /* @__PURE__ */ React.createElement(Progress, null);
  if (!availableTypes)
    return null;
  if (error) {
    alertApi.post({
      message: `Failed to load entity types`,
      severity: "error"
    });
    return null;
  }
  return /* @__PURE__ */ React.createElement(Box, {
    pb: 1,
    pt: 1
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "button"
  }, "Categories"), /* @__PURE__ */ React.createElement(Autocomplete$1, {
    multiple: true,
    "aria-label": "Categories",
    options: availableTypes,
    value: selectedTypes,
    onChange: (_, value) => setSelectedTypes(value),
    renderOption: (option, { selected }) => /* @__PURE__ */ React.createElement(FormControlLabel, {
      control: /* @__PURE__ */ React.createElement(Checkbox, {
        icon,
        checkedIcon,
        checked: selected
      }),
      label: capitalize(option)
    }),
    size: "small",
    popupIcon: /* @__PURE__ */ React.createElement(ExpandMoreIcon, {
      "data-testid": "categories-picker-expand"
    }),
    renderInput: (params) => /* @__PURE__ */ React.createElement(TextField, {
      ...params,
      variant: "outlined"
    })
  }));
};

function reducer(draft, action) {
  var _a, _b, _c;
  switch (action.type) {
    case "INIT": {
      draft.steps = action.data.spec.steps.reduce((current, next) => {
        current[next.id] = { status: "open", id: next.id };
        return current;
      }, {});
      draft.stepLogs = action.data.spec.steps.reduce((current, next) => {
        current[next.id] = [];
        return current;
      }, {});
      draft.loading = false;
      draft.error = void 0;
      draft.completed = false;
      draft.task = action.data;
      return;
    }
    case "LOGS": {
      const entries = action.data;
      for (const entry of entries) {
        const logLine = `${entry.createdAt} ${entry.body.message}`;
        if (!entry.body.stepId || !((_a = draft.steps) == null ? void 0 : _a[entry.body.stepId])) {
          continue;
        }
        const currentStepLog = (_b = draft.stepLogs) == null ? void 0 : _b[entry.body.stepId];
        const currentStep = (_c = draft.steps) == null ? void 0 : _c[entry.body.stepId];
        if (entry.body.status && entry.body.status !== currentStep.status) {
          currentStep.status = entry.body.status;
          if (currentStep.status === "processing") {
            currentStep.startedAt = entry.createdAt;
          }
          if (["cancelled", "failed", "completed"].includes(currentStep.status)) {
            currentStep.endedAt = entry.createdAt;
          }
        }
        currentStepLog == null ? void 0 : currentStepLog.push(logLine);
      }
      return;
    }
    case "COMPLETED": {
      draft.completed = true;
      draft.output = action.data.body.output;
      return;
    }
    case "ERROR": {
      draft.error = action.data;
      draft.loading = false;
      draft.completed = true;
      return;
    }
    default:
      return;
  }
}
const useTaskEventStream = (taskId) => {
  const scaffolderApi = useApi(scaffolderApiRef);
  const [state, dispatch] = useImmerReducer(reducer, {
    loading: true,
    completed: false,
    stepLogs: {},
    steps: {}
  });
  useEffect(() => {
    let didCancel = false;
    let subscription;
    let logPusher;
    scaffolderApi.getTask(taskId).then((task) => {
      if (didCancel) {
        return;
      }
      dispatch({ type: "INIT", data: task });
      const observable = scaffolderApi.streamLogs({ taskId });
      const collectedLogEvents = new Array();
      function emitLogs() {
        if (collectedLogEvents.length) {
          const logs = collectedLogEvents.splice(0, collectedLogEvents.length);
          dispatch({ type: "LOGS", data: logs });
        }
      }
      logPusher = setInterval(emitLogs, 500);
      subscription = observable.subscribe({
        next: (event) => {
          switch (event.type) {
            case "log":
              return collectedLogEvents.push(event);
            case "completion":
              emitLogs();
              dispatch({ type: "COMPLETED", data: event });
              return void 0;
            default:
              throw new Error(`Unhandled event type ${event.type} in observer`);
          }
        },
        error: (error) => {
          emitLogs();
          dispatch({ type: "ERROR", data: error });
        }
      });
    }, (error) => {
      if (!didCancel) {
        dispatch({ type: "ERROR", data: error });
      }
    });
    return () => {
      didCancel = true;
      if (subscription) {
        subscription.unsubscribe();
      }
      if (logPusher) {
        clearInterval(logPusher);
      }
    };
  }, [scaffolderApi, dispatch, taskId]);
  return state;
};

const useStyles$1 = makeStyles({
  svgIcon: {
    display: "inline-block",
    "& svg": {
      display: "inline-block",
      fontSize: "inherit",
      verticalAlign: "baseline"
    }
  }
});
const IconLink = (props) => {
  const { href, text, Icon, ...linkProps } = props;
  const classes = useStyles$1();
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    direction: "row",
    spacing: 1
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(Typography, {
    component: "div",
    className: classes.svgIcon
  }, Icon ? /* @__PURE__ */ React.createElement(Icon, null) : /* @__PURE__ */ React.createElement(LanguageIcon, null))), /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(Link, {
    to: href,
    ...linkProps
  }, text || href)));
};

const TaskPageLinks = ({ output }) => {
  const { links = [] } = output;
  const app = useApp();
  const entityRoute = useRouteRef(entityRouteRef);
  const iconResolver = (key) => {
    var _a;
    return key ? (_a = app.getSystemIcon(key)) != null ? _a : LanguageIcon : LanguageIcon;
  };
  return /* @__PURE__ */ React.createElement(Box, {
    px: 3,
    pb: 3
  }, links.filter(({ url, entityRef }) => url || entityRef).map(({ url, entityRef, title, icon }) => {
    if (entityRef) {
      const entityName = parseEntityRef(entityRef, {
        defaultKind: "<unknown>",
        defaultNamespace: "<unknown>"
      });
      const target = entityRoute(entityName);
      return { title, icon, url: target };
    }
    return { title, icon, url };
  }).map(({ url, title, icon }, i) => /* @__PURE__ */ React.createElement(IconLink, {
    key: `output-link-${i}`,
    href: url,
    text: title != null ? title : url,
    Icon: iconResolver(icon),
    target: "_blank"
  })));
};

const humanizeDuration = require("humanize-duration");
const useStyles = makeStyles$1((theme) => createStyles({
  root: {
    width: "100%"
  },
  button: {
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  },
  labelWrapper: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  stepWrapper: {
    width: "100%"
  }
}));
const StepTimeTicker = ({ step }) => {
  const [time, setTime] = useState("");
  useInterval(() => {
    if (!step.startedAt) {
      setTime("");
      return;
    }
    const end = step.endedAt ? DateTime.fromISO(step.endedAt) : DateTime.local();
    const startedAt = DateTime.fromISO(step.startedAt);
    const formatted = Interval.fromDateTimes(startedAt, end).toDuration().valueOf();
    setTime(humanizeDuration(formatted, { round: true }));
  }, 1e3);
  return /* @__PURE__ */ React.createElement(Typography$1, {
    variant: "caption"
  }, time);
};
const useStepIconStyles = makeStyles$1((theme) => createStyles({
  root: {
    color: theme.palette.text.disabled,
    display: "flex",
    height: 22,
    alignItems: "center"
  },
  completed: {
    color: theme.palette.status.ok
  },
  error: {
    color: theme.palette.status.error
  }
}));
function TaskStepIconComponent(props) {
  const classes = useStepIconStyles();
  const { active, completed, error } = props;
  const getMiddle = () => {
    if (active) {
      return /* @__PURE__ */ React.createElement(CircularProgress, {
        size: "24px"
      });
    }
    if (completed) {
      return /* @__PURE__ */ React.createElement(Check, null);
    }
    if (error) {
      return /* @__PURE__ */ React.createElement(Cancel, null);
    }
    return /* @__PURE__ */ React.createElement(FiberManualRecordIcon, null);
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: classNames(classes.root, {
      [classes.completed]: completed,
      [classes.error]: error
    })
  }, getMiddle());
}
const TaskStatusStepper = memo((props) => {
  const { steps, currentStepId, onUserStepChange } = props;
  const classes = useStyles(props);
  return /* @__PURE__ */ React.createElement("div", {
    className: classes.root
  }, /* @__PURE__ */ React.createElement(Stepper, {
    activeStep: steps.findIndex((s) => s.id === currentStepId),
    orientation: "vertical",
    nonLinear: true
  }, steps.map((step, index) => {
    const isCompleted = step.status === "completed";
    const isFailed = step.status === "failed";
    const isActive = step.status === "processing";
    const isSkipped = step.status === "skipped";
    return /* @__PURE__ */ React.createElement(Step, {
      key: String(index),
      expanded: true
    }, /* @__PURE__ */ React.createElement(StepButton, {
      onClick: () => onUserStepChange(step.id)
    }, /* @__PURE__ */ React.createElement(StepLabel, {
      StepIconProps: {
        completed: isCompleted,
        error: isFailed,
        active: isActive
      },
      StepIconComponent: TaskStepIconComponent,
      className: classes.stepWrapper
    }, /* @__PURE__ */ React.createElement("div", {
      className: classes.labelWrapper
    }, /* @__PURE__ */ React.createElement(Typography$1, {
      variant: "subtitle2"
    }, step.name), isSkipped ? /* @__PURE__ */ React.createElement(Typography$1, {
      variant: "caption"
    }, "Skipped") : /* @__PURE__ */ React.createElement(StepTimeTicker, {
      step
    })))));
  })));
});
const hasLinks = ({ links = [] }) => links.length > 0;
const TaskPage = ({ loadingText }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const rootPath = useRouteRef(rootRouteRef);
  const templateRoute = useRouteRef(selectedTemplateRouteRef);
  const [userSelectedStepId, setUserSelectedStepId] = useState(void 0);
  const [lastActiveStepId, setLastActiveStepId] = useState(void 0);
  const { taskId } = useParams();
  const taskStream = useTaskEventStream(taskId);
  const completed = taskStream.completed;
  const steps = useMemo(() => {
    var _a, _b;
    return (_b = (_a = taskStream.task) == null ? void 0 : _a.spec.steps.map((step) => {
      var _a2;
      return {
        ...step,
        ...(_a2 = taskStream == null ? void 0 : taskStream.steps) == null ? void 0 : _a2[step.id]
      };
    })) != null ? _b : [];
  }, [taskStream]);
  useEffect(() => {
    var _a;
    const mostRecentFailedOrActiveStep = steps.find((step) => ["failed", "processing"].includes(step.status));
    if (completed && !mostRecentFailedOrActiveStep) {
      setLastActiveStepId((_a = steps[steps.length - 1]) == null ? void 0 : _a.id);
      return;
    }
    setLastActiveStepId(mostRecentFailedOrActiveStep == null ? void 0 : mostRecentFailedOrActiveStep.id);
  }, [steps, completed]);
  const currentStepId = userSelectedStepId != null ? userSelectedStepId : lastActiveStepId;
  const logAsString = useMemo(() => {
    if (!currentStepId) {
      return loadingText ? loadingText : "Loading...";
    }
    const log = taskStream.stepLogs[currentStepId];
    if (!(log == null ? void 0 : log.length)) {
      return "Waiting for logs...";
    }
    return log.join("\n");
  }, [taskStream.stepLogs, currentStepId, loadingText]);
  const taskNotFound = taskStream.completed === true && taskStream.loading === false && !taskStream.task;
  const { output } = taskStream;
  const handleStartOver = () => {
    var _a, _b, _c;
    if (!taskStream.task || !((_b = (_a = taskStream.task) == null ? void 0 : _a.spec.templateInfo) == null ? void 0 : _b.entityRef)) {
      navigate(rootPath());
      return;
    }
    const formData = taskStream.task.spec.parameters;
    const { name } = parseEntityRef((_c = taskStream.task.spec.templateInfo) == null ? void 0 : _c.entityRef);
    navigate(`${templateRoute({ templateName: name })}?${qs.stringify({
      formData: JSON.stringify(formData)
    })}`);
  };
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "home"
  }, /* @__PURE__ */ React.createElement(Header, {
    pageTitleOverride: `Task ${taskId}`,
    title: "Task Activity",
    subtitle: `Activity for task: ${taskId}`
  }), /* @__PURE__ */ React.createElement(Content, null, taskNotFound ? /* @__PURE__ */ React.createElement(ErrorPage, {
    status: "404",
    statusMessage: "Task not found",
    additionalInfo: "No task found with this ID"
  }) : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Grid$1, {
    container: true
  }, /* @__PURE__ */ React.createElement(Grid$1, {
    item: true,
    xs: 3
  }, /* @__PURE__ */ React.createElement(Paper, null, /* @__PURE__ */ React.createElement(TaskStatusStepper, {
    steps,
    currentStepId,
    onUserStepChange: setUserSelectedStepId
  }), output && hasLinks(output) && /* @__PURE__ */ React.createElement(TaskPageLinks, {
    output
  }), /* @__PURE__ */ React.createElement(Button, {
    className: classes.button,
    onClick: handleStartOver,
    disabled: !completed,
    variant: "contained",
    color: "primary"
  }, "Start Over"))), /* @__PURE__ */ React.createElement(Grid$1, {
    item: true,
    xs: 9
  }, !currentStepId && /* @__PURE__ */ React.createElement(Progress, null), /* @__PURE__ */ React.createElement("div", {
    style: { height: "80vh" }
  }, /* @__PURE__ */ React.createElement(LogViewer, {
    text: logAsString
  })))))));
};

export { RepoUrlPickerFieldExtension as A, ScaffolderPage as B, scaffolderPlugin as C, useTemplateSecrets as D, EntityPicker as E, FIELD_EXTENSION_WRAPPER_KEY as F, NextScaffolderPage as N, OwnerPicker as O, RepoUrlPicker as R, SecretsContext as S, TemplateTypePicker as T, actionsRouteRef as a, scaffolderListTaskRouteRef as b, scaffolderApiRef as c, scaffolderTaskRouteRef as d, editRouteRef as e, rootRouteRef as f, TaskStatusStepper as g, TaskPageLinks as h, FIELD_EXTENSION_KEY as i, SecretsContextProvider as j, TaskPage as k, EntityNamePicker as l, entityNamePickerValidation as m, EntityTagsPicker as n, repoPickerValidation as o, OwnedEntityPicker as p, ScaffolderClient as q, registerComponentRouteRef as r, selectedTemplateRouteRef as s, createScaffolderFieldExtension as t, ScaffolderFieldExtensions as u, EntityPickerFieldExtension as v, EntityNamePickerFieldExtension as w, EntityTagsPickerFieldExtension as x, OwnerPickerFieldExtension as y, OwnedEntityPickerFieldExtension as z };
//# sourceMappingURL=index-b64713a1.esm.js.map
