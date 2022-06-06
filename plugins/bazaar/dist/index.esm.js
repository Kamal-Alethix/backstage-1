import { createRouteRef, createApiRef, createPlugin, createApiFactory, identityApiRef, discoveryApiRef, fetchApiRef, createRoutableExtension, useApi, useRouteRef } from '@backstage/core-plugin-api';
import React, { useState, useEffect } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { useEntity, entityRouteRef, catalogApiRef } from '@backstage/plugin-catalog-react';
import { TextField, IconButton, makeStyles, Typography, Dialog, Button, Card, CardContent, Grid, CardHeader, Divider, DialogContent as DialogContent$1, DialogActions as DialogActions$1, CardActionArea, TablePagination, FormControl as FormControl$1, Select as Select$1, MenuItem as MenuItem$1 } from '@material-ui/core';
import { StatusWarning, StatusOK, Avatar, Link, HeaderIconLinkRow, ItemCardHeader, Content, SupportButton } from '@backstage/core-components';
import EditIcon from '@material-ui/icons/Edit';
import ChatIcon from '@material-ui/icons/Chat';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import { Controller, useForm } from 'react-hook-form';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton$1 from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography$1 from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withStyles, createStyles } from '@material-ui/core/styles';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Button$1 from '@material-ui/core/Button';
import Dialog$1 from '@material-ui/core/Dialog';
import { Alert, Autocomplete } from '@material-ui/lab';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { AboutField } from '@backstage/plugin-catalog';
import { DateTime } from 'luxon';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
import SearchBar from 'material-ui-search-bar';

const rootRouteRef = createRouteRef({
  id: "bazaar"
});

const bazaarApiRef = createApiRef({
  id: "bazaar"
});
class BazaarClient {
  constructor(options) {
    this.identityApi = options.identityApi;
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }
  async updateProject(bazaarProject) {
    const baseUrl = await this.discoveryApi.getBaseUrl("bazaar");
    return await this.fetchApi.fetch(`${baseUrl}/projects`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bazaarProject)
    }).then((resp) => resp.json());
  }
  async addProject(bazaarProject) {
    const baseUrl = await this.discoveryApi.getBaseUrl("bazaar");
    return await this.fetchApi.fetch(`${baseUrl}/projects`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bazaarProject)
    }).then((resp) => resp.json());
  }
  async getProjectById(id) {
    const baseUrl = await this.discoveryApi.getBaseUrl("bazaar");
    const response = await this.fetchApi.fetch(`${baseUrl}/projects/${encodeURIComponent(id)}`);
    return response.ok ? response : null;
  }
  async getProjectByRef(entityRef) {
    const baseUrl = await this.discoveryApi.getBaseUrl("bazaar");
    const response = await this.fetchApi.fetch(`${baseUrl}/projects/${encodeURIComponent(entityRef)}`);
    return response.ok ? response : null;
  }
  async getMembers(id) {
    const baseUrl = await this.discoveryApi.getBaseUrl("bazaar");
    return await this.fetchApi.fetch(`${baseUrl}/projects/${encodeURIComponent(id)}/members`).then((resp) => resp.json());
  }
  async addMember(id, userId) {
    const baseUrl = await this.discoveryApi.getBaseUrl("bazaar");
    const { picture } = await this.identityApi.getProfileInfo();
    await this.fetchApi.fetch(`${baseUrl}/projects/${encodeURIComponent(id)}/member/${encodeURIComponent(userId)}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ picture })
    });
  }
  async deleteMember(id, userId) {
    const baseUrl = await this.discoveryApi.getBaseUrl("bazaar");
    await this.fetchApi.fetch(`${baseUrl}/projects/${encodeURIComponent(id)}/member/${encodeURIComponent(userId)}`, { method: "DELETE" });
  }
  async getProjects() {
    const baseUrl = await this.discoveryApi.getBaseUrl("bazaar");
    return await this.fetchApi.fetch(`${baseUrl}/projects`).then((resp) => resp.json());
  }
  async deleteProject(id) {
    const baseUrl = await this.discoveryApi.getBaseUrl("bazaar");
    await this.fetchApi.fetch(`${baseUrl}/projects/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  }
}

const bazaarPlugin = createPlugin({
  id: "bazaar",
  routes: {
    root: rootRouteRef
  },
  apis: [
    createApiFactory({
      api: bazaarApiRef,
      deps: {
        identityApi: identityApiRef,
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef
      },
      factory: ({ identityApi, discoveryApi, fetchApi }) => new BazaarClient({ identityApi, discoveryApi, fetchApi })
    })
  ]
});
const BazaarPage = bazaarPlugin.provide(createRoutableExtension({
  name: "BazaarPage",
  component: () => import('./esm/index-fed672f1.esm.js').then((m) => m.HomePage),
  mountPoint: rootRouteRef
}));

const InputField = ({
  inputType,
  error,
  control,
  helperText,
  placeholder,
  rules
}) => {
  const label = inputType.charAt(0).toLocaleUpperCase("en-US") + inputType.slice(1);
  return /* @__PURE__ */ React.createElement(Controller, {
    name: inputType,
    control,
    rules,
    render: ({ field }) => /* @__PURE__ */ React.createElement(TextField, {
      ...field,
      required: rules == null ? void 0 : rules.required,
      margin: "dense",
      multiline: true,
      id: "title",
      type: "text",
      fullWidth: true,
      label,
      placeholder,
      error: !!error,
      helperText: error && helperText
    })
  });
};

const InputSelector = ({ name, options, control, error }) => {
  const label = name.charAt(0).toLocaleUpperCase("en-US") + name.slice(1);
  return /* @__PURE__ */ React.createElement(Controller, {
    name,
    control,
    rules: {
      required: true
    },
    render: ({ field }) => /* @__PURE__ */ React.createElement(FormControl, {
      fullWidth: true
    }, /* @__PURE__ */ React.createElement(InputLabel, {
      required: true,
      htmlFor: "demo-simple-select-outlined",
      id: "demo-simple-select-outlined-label",
      style: {
        marginTop: "0.25rem"
      }
    }, label), /* @__PURE__ */ React.createElement(Select, {
      ...field,
      labelId: "demo-simple-select-outlined-label",
      id: "demo-simple-select-outlined",
      label,
      error: !!error
    }, options.map((option) => {
      return /* @__PURE__ */ React.createElement(MenuItem, {
        button: true,
        key: option,
        value: option
      }, option);
    })))
  });
};

const DateSelector = ({ name, control, setValue }) => {
  const label = `${name.charAt(0).toLocaleUpperCase("en-US") + name.slice(1, name.indexOf("D"))} date`;
  return /* @__PURE__ */ React.createElement(Controller, {
    name,
    control,
    render: ({ field }) => /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(MuiPickersUtilsProvider, {
      utils: LuxonUtils
    }, /* @__PURE__ */ React.createElement(KeyboardDatePicker, {
      disableToolbar: true,
      format: "dd-MM-yyyy",
      label,
      value: field.value,
      onChange: (date) => {
        setValue(name, date == null ? void 0 : date.toISO());
      },
      InputProps: {
        endAdornment: /* @__PURE__ */ React.createElement(IconButton, {
          onClick: () => setValue(name, null)
        }, /* @__PURE__ */ React.createElement(ClearIcon, null))
      },
      InputAdornmentProps: {
        position: "start"
      }
    })))
  });
};

const useStyles$a = makeStyles({
  container: {
    marginTop: "0.25rem",
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  startDate: {
    float: "left"
  },
  endDate: {
    float: "right"
  },
  dash: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.5rem",
    margin: "0 1rem"
  }
});
const DoubleDateSelector = ({ control, setValue }) => {
  const classes = useStyles$a();
  return /* @__PURE__ */ React.createElement("div", {
    className: classes.container
  }, /* @__PURE__ */ React.createElement("div", {
    className: classes.startDate
  }, /* @__PURE__ */ React.createElement(DateSelector, {
    name: "startDate",
    control,
    setValue
  })), /* @__PURE__ */ React.createElement(Typography, {
    className: classes.dash
  }, "-"), /* @__PURE__ */ React.createElement("div", {
    className: classes.endDate
  }, /* @__PURE__ */ React.createElement(DateSelector, {
    name: "endDate",
    control,
    setValue
  })));
};

const styles = (theme) => createStyles({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});
const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);
const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);
const CustomDialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return /* @__PURE__ */ React.createElement(MuiDialogTitle, {
    disableTypography: true,
    className: classes.root,
    ...other
  }, /* @__PURE__ */ React.createElement(Typography$1, {
    variant: "h6"
  }, children), onClose ? /* @__PURE__ */ React.createElement(IconButton$1, {
    "aria-label": "close",
    className: classes.closeButton,
    onClick: onClose
  }, /* @__PURE__ */ React.createElement(CloseIcon, null)) : null);
});

const ProjectDialog = ({
  handleSave,
  isAddForm,
  title,
  defaultValues,
  open,
  projectSelector,
  deleteButton,
  handleClose
}) => {
  const {
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors },
    setValue
  } = useForm({
    mode: "onChange",
    defaultValues
  });
  const handleSaveForm = () => {
    handleSave(getValues, reset);
  };
  const handleCloseDialog = () => {
    handleClose();
    reset(defaultValues);
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Dialog, {
    fullWidth: true,
    maxWidth: "xs",
    onClose: handleCloseDialog,
    "aria-labelledby": "customized-dialog-title",
    open
  }, /* @__PURE__ */ React.createElement(CustomDialogTitle, {
    id: "customized-dialog-title",
    onClose: handleCloseDialog
  }, title), /* @__PURE__ */ React.createElement(DialogContent, {
    style: { padding: "1rem", paddingTop: "0rem" },
    dividers: true
  }, /* @__PURE__ */ React.createElement(InputField, {
    error: errors.name,
    control,
    rules: {
      required: true,
      pattern: RegExp("^[a-zA-Z0-9_-]*$")
    },
    inputType: "name",
    helperText: "please enter a url safe project name"
  }), /* @__PURE__ */ React.createElement(InputField, {
    error: errors.description,
    control,
    rules: {
      required: true
    },
    inputType: "description",
    helperText: "please enter a description"
  }), /* @__PURE__ */ React.createElement(InputSelector, {
    control,
    name: "status",
    options: ["proposed", "ongoing"]
  }), /* @__PURE__ */ React.createElement(InputSelector, {
    control,
    name: "size",
    options: ["small", "medium", "large"]
  }), /* @__PURE__ */ React.createElement(InputField, {
    error: errors.responsible,
    control,
    rules: {
      required: true
    },
    inputType: "responsible",
    helperText: "please enter a contact person",
    placeholder: "Contact person of the project"
  }), isAddForm && projectSelector, /* @__PURE__ */ React.createElement(InputField, {
    error: errors.community,
    control,
    rules: {
      required: false,
      pattern: RegExp("^(https?)://")
    },
    inputType: "community",
    helperText: "please enter a link starting with http/https",
    placeholder: "Community link to e.g. Teams or Discord"
  }), /* @__PURE__ */ React.createElement(DoubleDateSelector, {
    setValue,
    control
  })), /* @__PURE__ */ React.createElement(DialogActions, null, !isAddForm && deleteButton, /* @__PURE__ */ React.createElement(Button, {
    onClick: handleSubmit(handleSaveForm),
    color: "primary",
    type: "submit"
  }, "Submit"))));
};

const ConfirmationDialog = ({
  open,
  handleClose,
  message,
  type,
  handleSubmit
}) => {
  return /* @__PURE__ */ React.createElement(Dialog$1, {
    fullWidth: true,
    maxWidth: "xs",
    onClose: handleClose,
    "aria-labelledby": "customized-dialog-title",
    open
  }, /* @__PURE__ */ React.createElement(CustomDialogTitle, {
    id: "customized-dialog-title",
    onClose: handleClose
  }, type.charAt(0).toLocaleUpperCase("en-US") + type.slice(1), " project"), /* @__PURE__ */ React.createElement(DialogContent, {
    dividers: true
  }, message), /* @__PURE__ */ React.createElement(DialogActions, null, /* @__PURE__ */ React.createElement(Button$1, {
    onClick: handleSubmit,
    color: "primary",
    type: "submit"
  }, type)));
};

const useStyles$9 = makeStyles({
  button: {
    marginLeft: "0",
    marginRight: "auto"
  },
  wordBreak: {
    wordBreak: "break-all",
    whiteSpace: "normal",
    margin: "-0.25rem 0"
  }
});
const EditProjectDialog = ({
  bazaarProject,
  openEdit,
  handleEditClose,
  handleCardClose,
  fetchBazaarProject
}) => {
  var _a, _b;
  const classes = useStyles$9();
  const bazaarApi = useApi(bazaarApiRef);
  const [openDelete, setOpenDelete] = useState(false);
  const [defaultValues, setDefaultValues] = useState({
    ...bazaarProject,
    startDate: (_a = bazaarProject.startDate) != null ? _a : null,
    endDate: (_b = bazaarProject.endDate) != null ? _b : null
  });
  const handleDeleteClose = () => {
    setOpenDelete(false);
    handleEditClose();
    if (handleCardClose)
      handleCardClose();
  };
  const handleDeleteSubmit = async () => {
    await bazaarApi.deleteProject(bazaarProject.id);
    handleDeleteClose();
    fetchBazaarProject();
  };
  useEffect(() => {
    var _a2, _b2;
    setDefaultValues({
      ...bazaarProject,
      startDate: (_a2 = bazaarProject.startDate) != null ? _a2 : null,
      endDate: (_b2 = bazaarProject.endDate) != null ? _b2 : null
    });
  }, [bazaarProject]);
  const handleEditSubmit = async (getValues) => {
    var _a2, _b2;
    const formValues = getValues();
    const updateResponse = await bazaarApi.updateProject({
      ...formValues,
      id: bazaarProject.id,
      entityRef: bazaarProject.entityRef,
      membersCount: bazaarProject.membersCount,
      startDate: (_a2 = formValues == null ? void 0 : formValues.startDate) != null ? _a2 : null,
      endDate: (_b2 = formValues == null ? void 0 : formValues.endDate) != null ? _b2 : null
    });
    if (updateResponse.status === "ok")
      fetchBazaarProject();
    handleEditClose();
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(ConfirmationDialog, {
    open: openDelete,
    handleClose: handleDeleteClose,
    message: [
      "Are you sure you want to delete ",
      /* @__PURE__ */ React.createElement("b", {
        key: bazaarProject.name,
        className: classes.wordBreak
      }, bazaarProject.name),
      " from the Bazaar?"
    ],
    type: "delete",
    handleSubmit: handleDeleteSubmit
  }), /* @__PURE__ */ React.createElement(ProjectDialog, {
    title: "Edit project",
    handleSave: handleEditSubmit,
    isAddForm: false,
    defaultValues,
    open: openEdit,
    handleClose: handleEditClose,
    deleteButton: /* @__PURE__ */ React.createElement(Button, {
      color: "primary",
      type: "submit",
      className: classes.button,
      onClick: () => {
        setOpenDelete(true);
      }
    }, "Delete project")
  }));
};

const statuses = {
  proposed: /* @__PURE__ */ React.createElement(StatusWarning, null, "proposed"),
  ongoing: /* @__PURE__ */ React.createElement(StatusOK, null, "ongoing")
};
const StatusTag = ({ status, styles }) => {
  return /* @__PURE__ */ React.createElement("div", {
    className: styles
  }, statuses[status]);
};

const useStyles$8 = makeStyles({
  break: {
    wordBreak: "break-word",
    textAlign: "justify"
  }
});
const CardContentFields = ({
  bazaarProject,
  members,
  descriptionSize,
  membersSize
}) => {
  var _a, _b;
  const classes = useStyles$8();
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Grid, {
    container: true
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: descriptionSize
  }, /* @__PURE__ */ React.createElement(AboutField, {
    label: "Description"
  }, bazaarProject.description.split("\n").map((str, i) => /* @__PURE__ */ React.createElement(Typography, {
    key: i,
    variant: "body2",
    paragraph: true,
    className: classes.break
  }, str)))), /* @__PURE__ */ React.createElement(Grid, {
    style: {
      display: "flex",
      justifyContent: "flex-end"
    },
    item: true,
    xs: membersSize
  }, /* @__PURE__ */ React.createElement(AboutField, {
    label: "Latest members"
  }, members.length ? members.slice(0, 7).map((member) => {
    return /* @__PURE__ */ React.createElement("div", {
      style: {
        textAlign: "left",
        backgroundColor: "",
        marginBottom: "0.3rem",
        marginTop: "0.3rem",
        display: "block"
      },
      key: member.userId
    }, /* @__PURE__ */ React.createElement(Avatar, {
      displayName: member.userId,
      customStyles: {
        width: "19px",
        height: "19px",
        fontSize: "8px",
        float: "left",
        marginRight: "0.3rem",
        marginTop: "0rem",
        marginBottom: "0rem",
        alignItems: "left",
        textAlign: "left"
      },
      picture: member.picture
    }), /* @__PURE__ */ React.createElement(Link, {
      className: classes.break,
      to: `http://github.com/${member.userId}`,
      target: "_blank"
    }, member == null ? void 0 : member.userId));
  }) : /* @__PURE__ */ React.createElement("div", null))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 2
  }, /* @__PURE__ */ React.createElement(AboutField, {
    label: "Status"
  }, /* @__PURE__ */ React.createElement(StatusTag, {
    status: bazaarProject.status
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 2
  }, /* @__PURE__ */ React.createElement(AboutField, {
    label: "size"
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2"
  }, bazaarProject.size))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 2
  }, /* @__PURE__ */ React.createElement(AboutField, {
    label: "Start date"
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2"
  }, ((_a = bazaarProject.startDate) == null ? void 0 : _a.substring(0, 10)) || ""))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 2
  }, /* @__PURE__ */ React.createElement(AboutField, {
    label: "End date"
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2"
  }, ((_b = bazaarProject.endDate) == null ? void 0 : _b.substring(0, 10)) || ""))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(AboutField, {
    label: "Responsible"
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2"
  }, bazaarProject.responsible || "")))))));
};

const sortMembers = (m1, m2) => {
  return new Date(m2.joinDate).getTime() - new Date(m1.joinDate).getTime();
};
const sortByDate = (a, b) => {
  const dateA = new Date(a.updatedAt).getTime();
  const dateB = new Date(b.updatedAt).getTime();
  return dateB - dateA;
};
const sortByName = (a, b) => {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  }
  return 0;
};
const sortByMembers = (a, b) => {
  return b.membersCount - a.membersCount;
};

const parseBazaarProject = (metadata) => {
  return {
    id: metadata.id,
    entityRef: metadata.entity_ref,
    name: metadata.name,
    community: metadata.community,
    description: metadata.description,
    status: metadata.status,
    updatedAt: metadata.updated_at,
    membersCount: metadata.members_count,
    size: metadata.size,
    startDate: metadata.start_date,
    endDate: metadata.end_date,
    responsible: metadata.responsible
  };
};
const parseMember = (member) => {
  return {
    itemId: member.item_id,
    userId: member.user_id,
    joinDate: member.join_date,
    picture: member.picture
  };
};
const parseBazaarResponse = async (response) => {
  if (response) {
    const metadata = await response.json().then((resp) => resp.data[0]);
    if (metadata) {
      return parseBazaarProject(metadata);
    }
  }
  return null;
};

const fetchProjectMembers = async (bazaarApi, project) => {
  const response = await bazaarApi.getMembers(project.id);
  if (response.data.length > 0) {
    const dbMembers = response.data.map((member) => {
      return parseMember(member);
    });
    dbMembers.sort(sortMembers);
    return dbMembers;
  }
  return [];
};
const fetchCatalogItems = async (catalogApi) => {
  const entities = await catalogApi.getEntities({
    filter: {
      kind: ["Component", "Resource"]
    },
    fields: ["kind", "metadata.name", "metadata.namespace"]
  });
  return entities.items;
};

const useStyles$7 = makeStyles({
  wordBreak: {
    wordBreak: "break-all",
    whiteSpace: "normal",
    margin: "-0.25rem 0"
  }
});
const EntityBazaarInfoContent = ({
  bazaarProject,
  fetchBazaarProject
}) => {
  var _a;
  const classes = useStyles$7();
  const bazaarApi = useApi(bazaarApiRef);
  const identity = useApi(identityApiRef);
  const [openEdit, setOpenEdit] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [openUnlink, setOpenUnlink] = useState(false);
  const [members, fetchMembers] = useAsyncFn(async () => {
    return bazaarProject ? await fetchProjectMembers(bazaarApi, bazaarProject) : [];
  });
  const [userId, fetchUserId] = useAsyncFn(async () => {
    return await (await identity.getProfileInfo()).displayName;
  });
  useEffect(() => {
    fetchMembers();
    fetchUserId();
  }, [fetchMembers, fetchUserId]);
  useEffect(() => {
    var _a2;
    if (members.value && userId.value) {
      setIsMember(((_a2 = members.value) == null ? void 0 : _a2.map((member) => member.userId).indexOf(userId.value)) >= 0);
    }
  }, [bazaarProject, members, identity, userId.value]);
  const handleMembersClick = async () => {
    if (userId.value) {
      if (!isMember) {
        await bazaarApi.addMember(bazaarProject == null ? void 0 : bazaarProject.id, userId.value);
      } else {
        await bazaarApi.deleteMember(bazaarProject.id, userId.value);
      }
      setIsMember(!isMember);
      fetchMembers();
    }
  };
  const links = [
    {
      label: "Entity page",
      icon: /* @__PURE__ */ React.createElement(DashboardIcon, null),
      disabled: true
    },
    {
      label: "Unlink project",
      icon: /* @__PURE__ */ React.createElement(LinkOffIcon, null),
      disabled: false,
      onClick: () => {
        setOpenUnlink(true);
      }
    },
    {
      label: isMember ? "Leave" : "Join",
      icon: isMember ? /* @__PURE__ */ React.createElement(ExitToAppIcon, null) : /* @__PURE__ */ React.createElement(PersonAddIcon, null),
      href: "",
      onClick: async () => {
        handleMembersClick();
      }
    },
    {
      label: "Community",
      icon: /* @__PURE__ */ React.createElement(ChatIcon, null),
      href: bazaarProject == null ? void 0 : bazaarProject.community,
      disabled: (bazaarProject == null ? void 0 : bazaarProject.community) === "" || !isMember
    }
  ];
  const handleEditClose = () => {
    setOpenEdit(false);
  };
  const handleUnlinkClose = () => {
    setOpenUnlink(false);
  };
  const handleUnlinkSubmit = async () => {
    const updateResponse = await bazaarApi.updateProject({
      ...bazaarProject,
      entityRef: null
    });
    if (updateResponse.status === "ok") {
      handleUnlinkClose();
      fetchBazaarProject();
    }
  };
  if (members.error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, (_a = members == null ? void 0 : members.error) == null ? void 0 : _a.message);
  }
  if (bazaarProject) {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(EditProjectDialog, {
      bazaarProject,
      openEdit,
      handleEditClose,
      fetchBazaarProject
    }), openUnlink && /* @__PURE__ */ React.createElement(ConfirmationDialog, {
      open: openUnlink,
      handleClose: handleUnlinkClose,
      message: [
        "Are you sure you want to unlink ",
        /* @__PURE__ */ React.createElement("b", {
          className: classes.wordBreak
        }, parseEntityRef(bazaarProject.entityRef).name),
        " from ",
        /* @__PURE__ */ React.createElement("b", {
          className: classes.wordBreak
        }, bazaarProject.name),
        " ?"
      ],
      type: "unlink",
      handleSubmit: handleUnlinkSubmit
    }), /* @__PURE__ */ React.createElement(CardHeader, {
      title: /* @__PURE__ */ React.createElement("p", {
        className: classes.wordBreak
      }, bazaarProject == null ? void 0 : bazaarProject.name),
      action: /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(IconButton, {
        onClick: () => {
          setOpenEdit(true);
        }
      }, /* @__PURE__ */ React.createElement(EditIcon, null))),
      subheader: /* @__PURE__ */ React.createElement(HeaderIconLinkRow, {
        links
      })
    }), /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(CardContentFields, {
      bazaarProject,
      members: members.value || [],
      descriptionSize: 10,
      membersSize: 2
    }));
  }
  return null;
};

const EntityBazaarInfoCard = () => {
  var _a;
  const { entity } = useEntity();
  const bazaarApi = useApi(bazaarApiRef);
  const [bazaarProject, fetchBazaarProject] = useAsyncFn(async () => {
    const response = await bazaarApi.getProjectByRef(stringifyEntityRef(entity));
    return await parseBazaarResponse(response);
  });
  const [isBazaar, setIsBazaar] = useState((_a = bazaarProject.value) != null ? _a : false);
  useEffect(() => {
    fetchBazaarProject();
  }, [fetchBazaarProject]);
  useEffect(() => {
    const isBazaarProject = bazaarProject.value !== void 0;
    setIsBazaar(isBazaarProject);
  }, [bazaarProject.value]);
  if (isBazaar) {
    return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(EntityBazaarInfoContent, {
      bazaarProject: bazaarProject.value,
      fetchBazaarProject
    }));
  }
  return null;
};

const useStyles$6 = makeStyles({
  container: { width: "100%", minWidth: "22rem" },
  autocomplete: { overflow: "hidden" }
});
const ProjectSelector = ({
  catalogEntities,
  onChange,
  disableClearable,
  defaultValue,
  label
}) => {
  const classes = useStyles$6();
  return /* @__PURE__ */ React.createElement("div", {
    className: classes.container
  }, /* @__PURE__ */ React.createElement(Autocomplete, {
    className: classes.autocomplete,
    fullWidth: true,
    disableClearable,
    defaultValue,
    options: catalogEntities,
    getOptionLabel: (option) => {
      var _a;
      return (_a = option == null ? void 0 : option.metadata) == null ? void 0 : _a.name;
    },
    renderOption: (option) => {
      var _a;
      return /* @__PURE__ */ React.createElement("span", null, (_a = option == null ? void 0 : option.metadata) == null ? void 0 : _a.name);
    },
    renderInput: (params) => /* @__PURE__ */ React.createElement(TextField, {
      ...params,
      label
    }),
    onChange: (_, data) => {
      onChange(data);
    }
  }));
};

const AddProjectDialog = ({
  catalogEntities,
  open,
  handleClose,
  fetchBazaarProjects,
  fetchCatalogEntities
}) => {
  const bazaarApi = useApi(bazaarApiRef);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const defaultValues = {
    name: "",
    title: "Add project",
    community: "",
    description: "",
    status: "proposed",
    size: "medium",
    responsible: "",
    startDate: null,
    endDate: null
  };
  const handleEntityClick = (entity) => {
    setSelectedEntity(entity);
  };
  const handleSubmit = async (getValues, reset) => {
    var _a, _b;
    const formValues = getValues();
    const response = await bazaarApi.addProject({
      ...formValues,
      entityRef: selectedEntity ? stringifyEntityRef(selectedEntity) : null,
      startDate: (_a = formValues.startDate) != null ? _a : null,
      endDate: (_b = formValues.endDate) != null ? _b : null
    });
    if (response.status === "ok") {
      fetchBazaarProjects();
      fetchCatalogEntities();
    }
    handleClose();
    reset(defaultValues);
  };
  return /* @__PURE__ */ React.createElement(ProjectDialog, {
    handleSave: handleSubmit,
    title: "Add project",
    isAddForm: true,
    defaultValues,
    open,
    projectSelector: /* @__PURE__ */ React.createElement(ProjectSelector, {
      onChange: handleEntityClick,
      catalogEntities: catalogEntities || [],
      disableClearable: false,
      defaultValue: null,
      label: "Select a project"
    }),
    handleClose
  });
};

const useStyles$5 = makeStyles({
  content: { padding: "0 1rem" }
});
const LinkProjectDialog = ({
  openProjectSelector,
  handleProjectSelectorClose,
  catalogEntities,
  bazaarProject,
  fetchBazaarProject,
  initEntity
}) => {
  const classes = useStyles$5();
  const bazaarApi = useApi(bazaarApiRef);
  const [selectedEntity, setSelectedEntity] = useState(initEntity);
  const handleEntityClick = (entity) => {
    setSelectedEntity(entity);
  };
  const handleSubmit = async () => {
    handleProjectSelectorClose();
    const updateResponse = await bazaarApi.updateProject({
      ...bazaarProject,
      entityRef: stringifyEntityRef(selectedEntity)
    });
    if (updateResponse.status === "ok")
      fetchBazaarProject();
  };
  return /* @__PURE__ */ React.createElement(Dialog, {
    onClose: handleProjectSelectorClose,
    open: openProjectSelector
  }, /* @__PURE__ */ React.createElement(CustomDialogTitle, {
    id: "customized-dialog-title",
    onClose: handleProjectSelectorClose
  }, "Select entity"), /* @__PURE__ */ React.createElement(DialogContent$1, {
    className: classes.content,
    dividers: true
  }, /* @__PURE__ */ React.createElement(ProjectSelector, {
    label: "",
    onChange: handleEntityClick,
    catalogEntities: catalogEntities || [],
    disableClearable: true,
    defaultValue: catalogEntities[0] || null
  })), /* @__PURE__ */ React.createElement(DialogActions$1, null, /* @__PURE__ */ React.createElement(Button, {
    onClick: handleSubmit,
    color: "primary",
    type: "submit"
  }, "OK")));
};

const useStyles$4 = makeStyles({
  wordBreak: {
    wordBreak: "break-all",
    whiteSpace: "normal",
    margin: "-0.25rem 0"
  }
});
const HomePageBazaarInfoCard = ({
  initProject,
  handleClose,
  initEntity
}) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const classes = useStyles$4();
  const entityLink = useRouteRef(entityRouteRef);
  const bazaarApi = useApi(bazaarApiRef);
  const identity = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);
  const [openEdit, setOpenEdit] = useState(false);
  const [openProjectSelector, setOpenProjectSelector] = useState(false);
  const [openUnlink, setOpenUnlink] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [catalogEntities, fetchCatalogEntities] = useAsyncFn(async () => {
    const entities = await fetchCatalogItems(catalogApi);
    const bazaarProjects = await bazaarApi.getProjects();
    const bazaarLinkedRefs = bazaarProjects.data.filter((entity) => entity.entity_ref !== null).map((entity) => entity.entity_ref);
    return entities.filter((entity) => !bazaarLinkedRefs.includes(stringifyEntityRef(entity)));
  });
  const [bazaarProject, fetchBazaarProject] = useAsyncFn(async () => {
    const response = await bazaarApi.getProjectById(initProject.id);
    return await parseBazaarResponse(response);
  });
  const [members, fetchMembers] = useAsyncFn(async () => {
    var _a2;
    return fetchProjectMembers(bazaarApi, (_a2 = bazaarProject.value) != null ? _a2 : initProject);
  });
  const [userId, fetchUserId] = useAsyncFn(async () => {
    return await (await identity.getProfileInfo()).displayName;
  });
  useEffect(() => {
    fetchMembers();
    fetchBazaarProject();
    fetchCatalogEntities();
    fetchUserId();
  }, [fetchMembers, fetchBazaarProject, fetchCatalogEntities, fetchUserId]);
  useEffect(() => {
    var _a2;
    if (members.value && userId.value) {
      setIsMember(((_a2 = members.value) == null ? void 0 : _a2.map((member) => member.userId).indexOf(userId.value)) >= 0);
    }
  }, [bazaarProject.value, members, identity, userId.value]);
  const handleMembersClick = async () => {
    if (userId.value) {
      if (!isMember) {
        await bazaarApi.addMember(bazaarProject.value.id, userId.value);
      } else {
        await bazaarApi.deleteMember(bazaarProject.value.id, userId.value);
      }
      setIsMember(!isMember);
      fetchMembers();
    }
  };
  const getEntityPageLink = () => {
    var _a2;
    if ((_a2 = bazaarProject == null ? void 0 : bazaarProject.value) == null ? void 0 : _a2.entityRef) {
      const { name, kind, namespace } = parseEntityRef(bazaarProject.value.entityRef);
      return entityLink({ kind, namespace, name });
    }
    return "";
  };
  const handleLink = () => {
    var _a2;
    if ((_a2 = bazaarProject.value) == null ? void 0 : _a2.entityRef) {
      setOpenUnlink(true);
    } else {
      fetchCatalogEntities();
      setOpenProjectSelector(true);
    }
  };
  const links = [
    {
      label: "Entity page",
      icon: /* @__PURE__ */ React.createElement(DashboardIcon, null),
      href: ((_a = bazaarProject.value) == null ? void 0 : _a.entityRef) ? getEntityPageLink() : "",
      disabled: ((_b = bazaarProject.value) == null ? void 0 : _b.entityRef) === null
    },
    {
      label: ((_c = bazaarProject.value) == null ? void 0 : _c.entityRef) ? "Unlink project" : "Link project",
      icon: ((_d = bazaarProject.value) == null ? void 0 : _d.entityRef) ? /* @__PURE__ */ React.createElement(LinkOffIcon, null) : /* @__PURE__ */ React.createElement(InsertLinkIcon, null),
      onClick: handleLink
    },
    {
      label: isMember ? "Leave" : "Join",
      icon: isMember ? /* @__PURE__ */ React.createElement(ExitToAppIcon, null) : /* @__PURE__ */ React.createElement(PersonAddIcon, null),
      href: "",
      onClick: async () => {
        handleMembersClick();
      }
    },
    {
      label: "Community",
      icon: /* @__PURE__ */ React.createElement(ChatIcon, null),
      href: (_e = bazaarProject.value) == null ? void 0 : _e.community,
      disabled: !((_f = bazaarProject.value) == null ? void 0 : _f.community) || !isMember
    }
  ];
  const handleUnlinkSubmit = async () => {
    const updateResponse = await bazaarApi.updateProject({
      ...bazaarProject.value,
      entityRef: null
    });
    if (updateResponse.status === "ok") {
      setOpenUnlink(false);
      fetchBazaarProject();
    }
  };
  if (bazaarProject.error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, (_g = bazaarProject == null ? void 0 : bazaarProject.error) == null ? void 0 : _g.message);
  } else if (members.error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, (_h = members == null ? void 0 : members.error) == null ? void 0 : _h.message);
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(LinkProjectDialog, {
    openProjectSelector,
    handleProjectSelectorClose: () => setOpenProjectSelector(false),
    catalogEntities: catalogEntities.value || [],
    bazaarProject: bazaarProject.value || initProject,
    fetchBazaarProject,
    initEntity
  }), openUnlink && /* @__PURE__ */ React.createElement(ConfirmationDialog, {
    open: openUnlink,
    handleClose: () => setOpenUnlink(false),
    message: [
      "Are you sure you want to unlink ",
      /* @__PURE__ */ React.createElement("b", {
        className: classes.wordBreak
      }, parseEntityRef((_i = bazaarProject.value) == null ? void 0 : _i.entityRef).name),
      " from ",
      /* @__PURE__ */ React.createElement("b", {
        className: classes.wordBreak
      }, (_j = bazaarProject.value) == null ? void 0 : _j.name),
      " ?"
    ],
    type: "unlink",
    handleSubmit: handleUnlinkSubmit
  }), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(EditProjectDialog, {
    bazaarProject: bazaarProject.value || initProject,
    openEdit,
    handleEditClose: () => setOpenEdit(false),
    handleCardClose: handleClose,
    fetchBazaarProject
  }), /* @__PURE__ */ React.createElement(CardHeader, {
    title: /* @__PURE__ */ React.createElement("p", {
      className: classes.wordBreak
    }, ((_k = bazaarProject.value) == null ? void 0 : _k.name) || initProject.name),
    action: /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(IconButton, {
      onClick: () => setOpenEdit(true)
    }, /* @__PURE__ */ React.createElement(EditIcon, null)), /* @__PURE__ */ React.createElement(IconButton, {
      onClick: handleClose
    }, /* @__PURE__ */ React.createElement(CloseIcon, null))),
    subheader: /* @__PURE__ */ React.createElement(HeaderIconLinkRow, {
      links
    })
  }), /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(CardContentFields, {
    bazaarProject: bazaarProject.value || initProject,
    members: members.value || [],
    descriptionSize: 9,
    membersSize: 3
  })));
};

const useStyles$3 = makeStyles({
  statusTag: {
    display: "inline-block",
    whiteSpace: "nowrap",
    marginBottom: "0.8rem"
  },
  description: {
    display: "-webkit-box",
    WebkitLineClamp: 7,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textAlign: "justify"
  },
  memberCount: {
    float: "right"
  },
  content: {
    height: "13rem"
  },
  header: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
});
const ProjectCard = ({
  project,
  fetchBazaarProjects,
  catalogEntities
}) => {
  const classes = useStyles$3();
  const [openCard, setOpenCard] = useState(false);
  const { id, name, status, updatedAt, description, membersCount } = project;
  const handleClose = () => {
    setOpenCard(false);
    fetchBazaarProjects();
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Dialog, {
    fullWidth: true,
    onClose: handleClose,
    open: openCard
  }, /* @__PURE__ */ React.createElement(HomePageBazaarInfoCard, {
    initProject: project,
    handleClose,
    initEntity: catalogEntities[0] || null
  })), /* @__PURE__ */ React.createElement(Card, {
    key: id
  }, /* @__PURE__ */ React.createElement(CardActionArea, {
    onClick: () => setOpenCard(true)
  }, /* @__PURE__ */ React.createElement(ItemCardHeader, {
    classes: { root: classes.header },
    title: /* @__PURE__ */ React.createElement(Typography, {
      noWrap: true,
      variant: "h6",
      component: "h4"
    }, name),
    subtitle: `updated ${DateTime.fromISO(new Date(updatedAt).toISOString()).toRelative({
      base: DateTime.now()
    })}`
  }), /* @__PURE__ */ React.createElement(CardContent, {
    className: classes.content
  }, /* @__PURE__ */ React.createElement(StatusTag, {
    styles: classes.statusTag,
    status
  }), /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2",
    className: classes.memberCount
  }, Number(membersCount) === Number(1) ? `${membersCount} member` : `${membersCount} members`), /* @__PURE__ */ React.createElement(Typography, {
    variant: "body2",
    className: classes.description
  }, description)))));
};

const useStyles$2 = makeStyles({
  content: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center"
  },
  empty: {
    height: "10rem",
    textAlign: "center",
    verticalAlign: "middle",
    lineHeight: "10rem"
  },
  pagination: {
    marginTop: "1rem",
    marginLeft: "auto",
    marginRight: "0"
  }
});
const ProjectPreview = ({
  bazaarProjects,
  fetchBazaarProjects,
  catalogEntities
}) => {
  const classes = useStyles$2();
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(12);
  const handlePageChange = (_, newPage) => {
    setPage(newPage + 1);
  };
  const handleRowChange = (event) => {
    setRows(parseInt(event.target.value, 10));
    setPage(1);
  };
  if (!bazaarProjects.length) {
    return /* @__PURE__ */ React.createElement("div", {
      className: classes.empty
    }, "Please add projects to the Bazaar.");
  }
  return /* @__PURE__ */ React.createElement(Content, {
    className: classes.content,
    noPadding: true
  }, /* @__PURE__ */ React.createElement(Grid, {
    wrap: "wrap",
    container: true,
    spacing: 3
  }, bazaarProjects.slice((page - 1) * rows, rows * page).map((bazaarProject, i) => {
    return /* @__PURE__ */ React.createElement(Grid, {
      key: i,
      item: true,
      xs: 2
    }, /* @__PURE__ */ React.createElement(ProjectCard, {
      project: bazaarProject,
      key: i,
      fetchBazaarProjects,
      catalogEntities
    }));
  })), /* @__PURE__ */ React.createElement(TablePagination, {
    className: classes.pagination,
    rowsPerPageOptions: [12, 24, 48, 96],
    count: bazaarProjects == null ? void 0 : bazaarProjects.length,
    page: page - 1,
    onPageChange: handlePageChange,
    rowsPerPage: rows,
    onRowsPerPageChange: handleRowChange,
    backIconButtonProps: { disabled: page === 1 },
    nextIconButtonProps: {
      disabled: rows * page >= bazaarProjects.length
    }
  }));
};

const useStyles$1 = makeStyles({
  select: {
    fontSize: "xx-large",
    fontWeight: "bold",
    width: "16rem"
  }
});
const SortMethodSelector = ({
  sortMethodNbr,
  handleSortMethodChange
}) => {
  const classes = useStyles$1();
  return /* @__PURE__ */ React.createElement(FormControl$1, {
    fullWidth: true
  }, /* @__PURE__ */ React.createElement(Select$1, {
    className: classes.select,
    disableUnderline: true,
    value: sortMethodNbr,
    onChange: handleSortMethodChange
  }, /* @__PURE__ */ React.createElement(MenuItem$1, {
    value: 0
  }, "Latest updated"), /* @__PURE__ */ React.createElement(MenuItem$1, {
    value: 1
  }, "A-Z"), /* @__PURE__ */ React.createElement(MenuItem$1, {
    value: 2
  }, "Most members")));
};

const useStyles = makeStyles({
  button: { minWidth: "11rem" },
  container: {
    marginTop: "2rem"
  },
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
    marginBottom: "1.2rem"
  },
  search: {
    marginRight: "1rem",
    height: "2.5rem",
    width: "35rem"
  }
});
const getUnlinkedCatalogEntities = (bazaarProjects, catalogEntities) => {
  const bazaarProjectRefs = bazaarProjects.map((project) => project.entityRef);
  return catalogEntities.filter((entity) => {
    return !(bazaarProjectRefs == null ? void 0 : bazaarProjectRefs.includes(stringifyEntityRef(entity)));
  });
};
const SortView = () => {
  var _a;
  const bazaarApi = useApi(bazaarApiRef);
  const catalogApi = useApi(catalogApiRef);
  const classes = useStyles();
  const sortMethods = [sortByDate, sortByName, sortByMembers];
  const [sortMethodNbr, setSortMethodNbr] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [unlinkedCatalogEntities, setUnlinkedCatalogEntities] = useState();
  const [catalogEntities, fetchCatalogEntities] = useAsyncFn(async () => {
    return await fetchCatalogItems(catalogApi);
  });
  const [bazaarProjects, fetchBazaarProjects] = useAsyncFn(async () => {
    const response = await bazaarApi.getProjects();
    const dbProjects = [];
    response.data.forEach((project) => {
      dbProjects.push(parseBazaarProject(project));
    });
    return dbProjects;
  });
  const catalogEntityRefs = (_a = catalogEntities.value) == null ? void 0 : _a.map((project) => stringifyEntityRef(project));
  const getSearchResults = () => {
    var _a2;
    return (_a2 = bazaarProjects.value) == null ? void 0 : _a2.filter((project) => project.name.includes(searchValue)).sort(sortMethods[sortMethodNbr]);
  };
  useEffect(() => {
    const filterBrokenLinks = () => {
      var _a2;
      if (catalogEntityRefs) {
        (_a2 = bazaarProjects.value) == null ? void 0 : _a2.forEach(async (project) => {
          if (project.entityRef) {
            if (!(catalogEntityRefs == null ? void 0 : catalogEntityRefs.includes(project.entityRef))) {
              await bazaarApi.updateProject({
                ...project,
                entityRef: null
              });
            }
          }
        });
      }
    };
    filterBrokenLinks();
  }, [
    bazaarApi,
    bazaarProjects.value,
    catalogEntityRefs,
    catalogEntities.value
  ]);
  useEffect(() => {
    fetchCatalogEntities();
    fetchBazaarProjects();
  }, [fetchBazaarProjects, fetchCatalogEntities]);
  useEffect(() => {
    const unlinkedCEntities = getUnlinkedCatalogEntities(bazaarProjects.value || [], catalogEntities.value || []);
    if (unlinkedCEntities) {
      setUnlinkedCatalogEntities(unlinkedCEntities);
    }
  }, [bazaarProjects, catalogEntities]);
  const handleSortMethodChange = (event) => {
    setSortMethodNbr(typeof event.target.value === "number" ? event.target.value : 0);
  };
  if (catalogEntities.error)
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, catalogEntities.error.message);
  if (bazaarProjects.error)
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, bazaarProjects.error.message);
  return /* @__PURE__ */ React.createElement(Content, {
    noPadding: true
  }, /* @__PURE__ */ React.createElement("div", {
    className: classes.header
  }, /* @__PURE__ */ React.createElement(SortMethodSelector, {
    sortMethodNbr,
    handleSortMethodChange
  }), /* @__PURE__ */ React.createElement(SearchBar, {
    className: classes.search,
    value: searchValue,
    onChange: (newSortMethod) => {
      setSearchValue(newSortMethod);
    },
    onCancelSearch: () => {
      setSearchValue("");
    }
  }), /* @__PURE__ */ React.createElement(Button, {
    className: classes.button,
    variant: "contained",
    color: "primary",
    onClick: () => {
      setOpenAdd(true);
    }
  }, "Add project"), /* @__PURE__ */ React.createElement(AddProjectDialog, {
    catalogEntities: unlinkedCatalogEntities || [],
    handleClose: () => {
      setOpenAdd(false);
    },
    open: openAdd,
    fetchBazaarProjects,
    fetchCatalogEntities
  }), /* @__PURE__ */ React.createElement(SupportButton, null)), /* @__PURE__ */ React.createElement(ProjectPreview, {
    bazaarProjects: getSearchResults() || [],
    fetchBazaarProjects,
    catalogEntities: unlinkedCatalogEntities || []
  }), /* @__PURE__ */ React.createElement(Content, {
    noPadding: true,
    className: classes.container
  }));
};

export { BazaarPage, EntityBazaarInfoCard, SortView, bazaarPlugin };
//# sourceMappingURL=index.esm.js.map
