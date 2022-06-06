import React, { useEffect, useState, useMemo } from 'react';
import useObservable from 'react-use/lib/useObservable';
import PlayListAddIcon from '@material-ui/icons/PlaylistAdd';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles as makeStyles$1, CardContent, TextField, CardActions, Button, Popover, Card, CardHeader } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import DeleteIcon from '@material-ui/icons/Delete';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';
import { SidebarItem, SidebarScrollWrapper, Progress } from '@backstage/core-components';
import { useLocation } from 'react-router';
import '@backstage/theme';
import 'zen-observable';
import 'uuid';
import { shortcutsApiRef } from '../index.esm.js';

const useStyles$4 = makeStyles((theme) => ({
  avatar: (props) => ({
    color: theme.palette.getContrastText(props.color),
    backgroundColor: props.color,
    width: 28,
    height: 28,
    fontWeight: "bold",
    fontSize: 13,
    filter: "contrast(150%) brightness(1.4)"
  })
}));
const ShortcutIcon = (props) => {
  const classes = useStyles$4(props);
  return /* @__PURE__ */ React.createElement(Avatar, {
    className: classes.avatar
  }, props.text);
};

const useStyles$3 = makeStyles$1((theme) => ({
  field: {
    marginBottom: theme.spacing(2)
  },
  actionRoot: {
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    justifyContent: "flex-start"
  }
}));
const ShortcutForm = ({ formValues, onSave, onClose }) => {
  var _a, _b;
  const classes = useStyles$3();
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      url: (_a = formValues == null ? void 0 : formValues.url) != null ? _a : "",
      title: (_b = formValues == null ? void 0 : formValues.title) != null ? _b : ""
    }
  });
  useEffect(() => {
    reset(formValues);
  }, [reset, formValues]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Controller, {
    name: "url",
    control,
    rules: {
      required: true,
      pattern: {
        value: /^\//,
        message: "Must be a relative URL (starts with a /)"
      }
    },
    render: ({ field }) => {
      var _a2;
      return /* @__PURE__ */ React.createElement(TextField, {
        ...field,
        error: !!errors.url,
        helperText: (_a2 = errors.url) == null ? void 0 : _a2.message,
        type: "text",
        placeholder: "Enter a URL",
        InputLabelProps: {
          shrink: true
        },
        className: classes.field,
        fullWidth: true,
        label: "Shortcut URL",
        variant: "outlined",
        autoComplete: "off"
      });
    }
  }), /* @__PURE__ */ React.createElement(Controller, {
    name: "title",
    control,
    rules: {
      required: true,
      minLength: {
        value: 2,
        message: "Must be at least 2 characters"
      }
    },
    render: ({ field }) => {
      var _a2;
      return /* @__PURE__ */ React.createElement(TextField, {
        ...field,
        error: !!errors.title,
        helperText: (_a2 = errors.title) == null ? void 0 : _a2.message,
        type: "text",
        placeholder: "Enter a display name",
        InputLabelProps: {
          shrink: true
        },
        className: classes.field,
        fullWidth: true,
        label: "Display Name",
        variant: "outlined",
        autoComplete: "off"
      });
    }
  })), /* @__PURE__ */ React.createElement(CardActions, {
    classes: { root: classes.actionRoot }
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "primary",
    size: "large",
    onClick: handleSubmit(onSave)
  }, "Save"), /* @__PURE__ */ React.createElement(Button, {
    variant: "outlined",
    size: "large",
    onClick: onClose
  }, "Cancel")));
};

const useStyles$2 = makeStyles$1((theme) => ({
  card: {
    width: 400
  },
  header: {
    marginBottom: theme.spacing(1)
  },
  button: {
    marginTop: theme.spacing(1)
  }
}));
const EditShortcut = ({ shortcut, onClose, anchorEl, api }) => {
  const classes = useStyles$2();
  const alertApi = useApi(alertApiRef);
  const open = Boolean(anchorEl);
  const handleSave = async ({ url, title }) => {
    const newShortcut = {
      ...shortcut,
      url,
      title
    };
    try {
      await api.update(newShortcut);
      alertApi.post({
        message: `Updated shortcut '${title}'`,
        severity: "success"
      });
    } catch (error) {
      alertApi.post({
        message: `Could not update shortcut: ${error.message}`,
        severity: "error"
      });
    }
    onClose();
  };
  const handleRemove = async () => {
    try {
      await api.remove(shortcut.id);
      alertApi.post({
        message: `Removed shortcut '${shortcut.title}' from your sidebar`,
        severity: "success"
      });
    } catch (error) {
      alertApi.post({
        message: `Could not delete shortcut: ${error.message}`,
        severity: "error"
      });
    }
  };
  const handleClose = () => {
    onClose();
  };
  return /* @__PURE__ */ React.createElement(Popover, {
    open,
    anchorEl,
    onClose,
    anchorOrigin: {
      vertical: "top",
      horizontal: "right"
    }
  }, /* @__PURE__ */ React.createElement(Card, {
    className: classes.card
  }, /* @__PURE__ */ React.createElement(CardHeader, {
    className: classes.header,
    title: "Edit Shortcut",
    titleTypographyProps: { variant: "subtitle2" },
    action: /* @__PURE__ */ React.createElement(Button, {
      className: classes.button,
      variant: "text",
      size: "small",
      color: "secondary",
      startIcon: /* @__PURE__ */ React.createElement(DeleteIcon, null),
      onClick: handleRemove
    }, "Remove")
  }), /* @__PURE__ */ React.createElement(ShortcutForm, {
    formValues: { url: shortcut.url, title: shortcut.title },
    onClose: handleClose,
    onSave: handleSave
  })));
};

const useStyles$1 = makeStyles({
  root: {
    "&:hover #edit": {
      visibility: "visible"
    }
  },
  button: {
    visibility: "hidden"
  },
  icon: {
    color: "white",
    fontSize: 16
  }
});
const getIconText = (title) => title.split(" ").length === 1 ? title[0].toUpperCase() + title[1].toLowerCase() : title.replace(/\B\W/g, "").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
const ShortcutItem = ({ shortcut, api }) => {
  const classes = useStyles$1();
  const [anchorEl, setAnchorEl] = React.useState();
  const handleClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(void 0);
  };
  const text = getIconText(shortcut.title);
  const color = api.getColor(shortcut.url);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Tooltip, {
    title: shortcut.title,
    enterDelay: 500
  }, /* @__PURE__ */ React.createElement(SidebarItem, {
    className: classes.root,
    to: shortcut.url,
    text: shortcut.title,
    icon: () => /* @__PURE__ */ React.createElement(ShortcutIcon, {
      text,
      color
    })
  }, /* @__PURE__ */ React.createElement(IconButton, {
    id: "edit",
    "data-testid": "edit",
    onClick: handleClick,
    className: classes.button
  }, /* @__PURE__ */ React.createElement(EditIcon, {
    className: classes.icon
  })))), /* @__PURE__ */ React.createElement(EditShortcut, {
    onClose: handleClose,
    anchorEl,
    api,
    shortcut
  }));
};

const useStyles = makeStyles$1((theme) => ({
  card: {
    maxWidth: 400
  },
  header: {
    marginBottom: theme.spacing(1)
  },
  button: {
    marginTop: theme.spacing(1)
  }
}));
const AddShortcut = ({ onClose, anchorEl, api }) => {
  const classes = useStyles();
  const alertApi = useApi(alertApiRef);
  const { pathname } = useLocation();
  const [formValues, setFormValues] = useState();
  const open = Boolean(anchorEl);
  const handleSave = async ({ url, title }) => {
    const shortcut = { url, title };
    try {
      await api.add(shortcut);
      alertApi.post({
        message: `Added shortcut '${title}' to your sidebar`,
        severity: "success"
      });
    } catch (error) {
      alertApi.post({
        message: `Could not add shortcut: ${error.message}`,
        severity: "error"
      });
    }
    onClose();
  };
  const handlePaste = () => {
    setFormValues({ url: pathname, title: document.title });
  };
  const handleClose = () => {
    setFormValues(void 0);
    onClose();
  };
  return /* @__PURE__ */ React.createElement(Popover, {
    open,
    anchorEl,
    TransitionProps: { onExit: handleClose },
    onClose,
    anchorOrigin: {
      vertical: "top",
      horizontal: "right"
    }
  }, /* @__PURE__ */ React.createElement(Card, {
    className: classes.card
  }, /* @__PURE__ */ React.createElement(CardHeader, {
    className: classes.header,
    title: "Add Shortcut",
    titleTypographyProps: { variant: "subtitle2" },
    action: /* @__PURE__ */ React.createElement(Button, {
      className: classes.button,
      variant: "text",
      size: "small",
      color: "primary",
      onClick: handlePaste
    }, "Use current page")
  }), /* @__PURE__ */ React.createElement(ShortcutForm, {
    onClose: handleClose,
    onSave: handleSave,
    formValues
  })));
};

const Shortcuts = (props) => {
  var _a;
  const shortcutApi = useApi(shortcutsApiRef);
  const shortcuts = useObservable(useMemo(() => shortcutApi.shortcut$(), [shortcutApi]));
  const [anchorEl, setAnchorEl] = React.useState();
  const loading = Boolean(!shortcuts);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(void 0);
  };
  return /* @__PURE__ */ React.createElement(SidebarScrollWrapper, null, /* @__PURE__ */ React.createElement(SidebarItem, {
    icon: (_a = props.icon) != null ? _a : PlayListAddIcon,
    text: "Add Shortcuts",
    onClick: handleClick
  }), /* @__PURE__ */ React.createElement(AddShortcut, {
    onClose: handleClose,
    anchorEl,
    api: shortcutApi
  }), loading ? /* @__PURE__ */ React.createElement(Progress, null) : shortcuts == null ? void 0 : shortcuts.map((shortcut) => /* @__PURE__ */ React.createElement(ShortcutItem, {
    key: shortcut.id,
    shortcut,
    api: shortcutApi
  })));
};

export { Shortcuts };
//# sourceMappingURL=Shortcuts-17e4c625.esm.js.map
