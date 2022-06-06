import React, { createContext } from 'react';
import { Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import upperFirst from 'lodash/upperFirst';

const Context = createContext(void 0);
const getNewJoke = (type) => fetch(`https://official-joke-api.appspot.com/jokes${type !== "any" ? `/${type}` : ""}/random`).then((res) => res.json()).then((data) => Array.isArray(data) ? data[0] : data);
const ContextProvider = (props) => {
  const { children, defaultCategory } = props;
  const [loading, setLoading] = React.useState(true);
  const [joke, setJoke] = React.useState({
    setup: "",
    punchline: ""
  });
  const [type, setType] = React.useState(defaultCategory || "programming");
  const rerollJoke = React.useCallback(() => {
    setLoading(true);
    getNewJoke(type).then((newJoke) => setJoke(newJoke));
  }, [type]);
  const handleChangeType = (newType) => {
    setType(newType);
  };
  React.useEffect(() => {
    setLoading(false);
  }, [joke]);
  React.useEffect(() => {
    rerollJoke();
  }, [rerollJoke]);
  const value = {
    loading,
    joke,
    type,
    rerollJoke,
    handleChangeType
  };
  return /* @__PURE__ */ React.createElement(Context.Provider, {
    value
  }, children);
};
const useRandomJoke = () => {
  const value = React.useContext(Context);
  if (value === void 0) {
    throw new Error("useRandomJoke must be used within a RandomJokeProvider");
  }
  return value;
};

const Actions = () => {
  const { rerollJoke } = useRandomJoke();
  return /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "primary",
    onClick: () => rerollJoke()
  }, "Reroll");
};

const Content = () => {
  const { joke, loading } = useRandomJoke();
  if (loading)
    return /* @__PURE__ */ React.createElement("p", null, "Loading...");
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, joke.setup), /* @__PURE__ */ React.createElement("p", null, joke.punchline));
};

const Settings = () => {
  const { type, handleChangeType } = useRandomJoke();
  const JOKE_TYPES = ["any", "programming"];
  return /* @__PURE__ */ React.createElement(FormControl, {
    component: "fieldset"
  }, /* @__PURE__ */ React.createElement(FormLabel, {
    component: "legend"
  }, "Joke Type"), /* @__PURE__ */ React.createElement(RadioGroup, {
    "aria-label": "joke type",
    value: type,
    onChange: (e) => handleChangeType(e.target.value)
  }, JOKE_TYPES.map((t) => /* @__PURE__ */ React.createElement(FormControlLabel, {
    key: t,
    value: t,
    control: /* @__PURE__ */ React.createElement(Radio, null),
    label: upperFirst(t)
  }))));
};

export { Actions, Content, ContextProvider, Settings };
//# sourceMappingURL=index-2cd1ac3a.esm.js.map
