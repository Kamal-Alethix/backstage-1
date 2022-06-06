import React, { useRef, useReducer, useState } from 'react';
import { Button, Grid, Typography, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Progress, Table, Page, Header, HeaderLabel, Content, ContentHeader, SupportButton } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import { useApi, discoveryApiRef, fetchApiRef, alertApiRef } from '@backstage/core-plugin-api';

const TodoList = ({ onEdit }) => {
  const discoveryApi = useApi(discoveryApiRef);
  const { fetch } = useApi(fetchApiRef);
  const { value, loading, error } = useAsync(async () => {
    const response = await fetch(`${await discoveryApi.getBaseUrl("todolist")}/todos`);
    return response.json();
  }, []);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  return /* @__PURE__ */ React.createElement(TodosTable, {
    todos: value || [],
    onEdit
  });
};
function TodosTable({ todos, onEdit }) {
  const columns = [
    { title: "Title", field: "title" },
    { title: "Author", field: "author" },
    {
      title: "Last edit",
      field: "timestamp",
      render: (e) => new Date(e.timestamp).toLocaleString()
    },
    {
      title: "Action",
      render: (todo) => {
        return /* @__PURE__ */ React.createElement(Button, {
          variant: "contained",
          onClick: () => onEdit(todo)
        }, "Edit");
      }
    }
  ];
  return /* @__PURE__ */ React.createElement(Table, {
    title: "Todos",
    options: { search: false, paging: false },
    columns,
    data: todos
  });
}

const TodoListPage = () => {
  const discoveryApi = useApi(discoveryApiRef);
  const { fetch } = useApi(fetchApiRef);
  const alertApi = useApi(alertApiRef);
  const title = useRef("");
  const [key, refetchTodos] = useReducer((i) => i + 1, 0);
  const [editElement, setEdit] = useState();
  const handleAdd = async () => {
    try {
      const response = await fetch(`${await discoveryApi.getBaseUrl("todolist")}/todos`, {
        method: "POST",
        body: JSON.stringify({ title: title.current }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        const { error } = await response.json();
        alertApi.post({
          message: error.message,
          severity: "error"
        });
        return;
      }
      refetchTodos();
    } catch (e) {
      alertApi.post({ message: e.message, severity: "error" });
    }
  };
  const handleEdit = async (todo) => {
    setEdit(void 0);
    try {
      const response = await fetch(`${await discoveryApi.getBaseUrl("todolist")}/todos`, {
        method: "PUT",
        body: JSON.stringify({ title: todo.title, id: todo.id }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        const { error } = await response.json();
        alertApi.post({
          message: error.message,
          severity: "error"
        });
        return;
      }
      refetchTodos();
    } catch (e) {
      alertApi.post({ message: e.message, severity: "error" });
    }
  };
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "tool"
  }, /* @__PURE__ */ React.createElement(Header, {
    title: "Welcome to todo-list!",
    subtitle: "Just a CRU todo list plugin"
  }, /* @__PURE__ */ React.createElement(HeaderLabel, {
    label: "Owner",
    value: "Team X"
  }), /* @__PURE__ */ React.createElement(HeaderLabel, {
    label: "Lifecycle",
    value: "Alpha"
  })), /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: "Todo List"
  }, /* @__PURE__ */ React.createElement(SupportButton, null, "A description of your plugin goes here.")), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 3,
    direction: "column"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1"
  }, "Add todo"), /* @__PURE__ */ React.createElement(Box, {
    component: "span",
    alignItems: "flex-end",
    display: "flex",
    flexDirection: "row"
  }, /* @__PURE__ */ React.createElement(TextField, {
    placeholder: "Write something here...",
    onChange: (e) => title.current = e.target.value
  }), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    onClick: handleAdd
  }, "Add"))), /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(TodoList, {
    key,
    onEdit: setEdit
  })))), !!editElement && /* @__PURE__ */ React.createElement(EditModal, {
    todo: editElement,
    onSubmit: handleEdit,
    onCancel: () => setEdit(void 0)
  }));
};
function EditModal({
  todo,
  onCancel,
  onSubmit
}) {
  const title = useRef("");
  return /* @__PURE__ */ React.createElement(Dialog, {
    open: true
  }, /* @__PURE__ */ React.createElement(DialogTitle, {
    id: "form-dialog-title"
  }, "Edit item"), /* @__PURE__ */ React.createElement(DialogContent, null, /* @__PURE__ */ React.createElement(TextField, {
    placeholder: "Write something here...",
    defaultValue: (todo == null ? void 0 : todo.title) || "",
    onChange: (e) => title.current = e.target.value,
    margin: "dense",
    fullWidth: true
  })), /* @__PURE__ */ React.createElement(DialogActions, null, /* @__PURE__ */ React.createElement(Button, {
    color: "primary",
    onClick: onCancel
  }, "Cancel"), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => onSubmit({ ...todo, title: title.current }),
    color: "primary"
  }, "Save")));
}

export { TodoListPage };
//# sourceMappingURL=index-174e102a.esm.js.map
