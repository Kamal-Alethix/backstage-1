import React from 'react';
import { Link, Progress, MissingAnnotationEmptyState, ErrorPanel, EmptyState, InfoCard } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { c as codeClimateApiRef, C as CODECLIMATE_REPO_ID_ANNOTATION } from './index-375070b2.esm.js';
import 'luxon';
import 'humanize-duration';
import { makeStyles, Typography, Box } from '@material-ui/core';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';

const letterStyle = {
  color: "white",
  border: 0,
  borderRadius: "3px",
  fontSize: "40px",
  padding: "5px 20px"
};
const fontSize = {
  fontSize: "25px"
};
const letterColor = (letter) => {
  if (letter === "A") {
    return "#45d298";
  } else if (letter === "B") {
    return "#a5d86e";
  } else if (letter === "C") {
    return "#f1ce0c";
  } else if (letter === "D") {
    return "#f29141";
  } else if (letter === "F") {
    return "#df5869";
  }
  return "#45d298";
};
const useStyles = makeStyles({
  spaceAround: {
    display: "flex",
    justifyContent: "space-around"
  },
  spaceBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  maintainabilityLetterColor: {
    ...letterStyle,
    backgroundColor: (props) => letterColor(props.maintainabilityLetter)
  },
  testCoverageLetterColor: {
    ...letterStyle,
    backgroundColor: (props) => letterColor(props.testCoverageLetter)
  },
  fontSize: {
    ...fontSize
  },
  letterDetails: {
    ...fontSize,
    paddingLeft: "10px"
  },
  paddingSides20: {
    padding: "0px 20px"
  }
});
const CodeClimateTable = ({
  codeClimateData
}) => {
  const {
    repoID,
    maintainability: {
      letter: maintainabilityLetter,
      value: maintainabilityValue
    },
    testCoverage: { letter: testCoverageLetter, value: testCoverageValue },
    numberOfCodeSmells,
    numberOfDuplication,
    numberOfOtherIssues
  } = codeClimateData;
  const classes = useStyles({ maintainabilityLetter, testCoverageLetter });
  if (!codeClimateData) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: classes.spaceAround
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6",
    component: "p"
  }, "Maintainability"), /* @__PURE__ */ React.createElement("div", {
    className: classes.spaceBetween
  }, /* @__PURE__ */ React.createElement(Typography, {
    className: classes.maintainabilityLetterColor,
    variant: "body2",
    component: "p"
  }, maintainabilityLetter), /* @__PURE__ */ React.createElement(Link, {
    to: `https://codeclimate.com/repos/${repoID}`
  }, /* @__PURE__ */ React.createElement(Typography, {
    className: classes.letterDetails,
    variant: "body2",
    component: "p"
  }, maintainabilityValue)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6",
    component: "p"
  }, "Test Coverage"), /* @__PURE__ */ React.createElement("div", {
    className: classes.spaceBetween
  }, /* @__PURE__ */ React.createElement(Typography, {
    className: classes.testCoverageLetterColor,
    variant: "body2",
    component: "p"
  }, testCoverageLetter), /* @__PURE__ */ React.createElement(Link, {
    to: `https://codeclimate.com/repos/${repoID}`
  }, /* @__PURE__ */ React.createElement(Typography, {
    className: classes.letterDetails,
    variant: "body2",
    component: "p"
  }, testCoverageValue, "%"))))), /* @__PURE__ */ React.createElement(Box, {
    className: classes.spaceAround,
    paddingTop: "30px"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6",
    component: "p"
  }, "Code Smells:"), /* @__PURE__ */ React.createElement(Link, {
    to: `https://codeclimate.com/repos/${repoID}/issues?category%5B%5D=complexity&status%5B%5D=&status%5B%5D=open&status%5B%5D=confirmed`
  }, /* @__PURE__ */ React.createElement(Typography, {
    className: classes.fontSize,
    variant: "body2",
    component: "p"
  }, numberOfCodeSmells))), /* @__PURE__ */ React.createElement(Box, {
    paddingLeft: "20",
    paddingRight: "20"
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6",
    component: "p"
  }, "Duplication:"), /* @__PURE__ */ React.createElement(Link, {
    to: `https://codeclimate.com/repos/${repoID}/issues?category%5B%5D=duplication&status%5B%5D=&status%5B%5D=open&status%5B%5D=confirmed`
  }, /* @__PURE__ */ React.createElement(Typography, {
    className: classes.fontSize,
    variant: "body2",
    component: "p"
  }, numberOfDuplication))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6",
    component: "p"
  }, "Other Issues:"), /* @__PURE__ */ React.createElement(Link, {
    to: `https://codeclimate.com/repos/${repoID}/issues?category%5B%5D=bugrisk&status%5B%5D=&status%5B%5D=open&status%5B%5D=confirmed`
  }, /* @__PURE__ */ React.createElement(Typography, {
    className: classes.fontSize,
    variant: "body2",
    component: "p"
  }, numberOfOtherIssues)))));
};

const CodeClimateCardContents = () => {
  var _a, _b;
  const { entity } = useEntity();
  const codeClimateApi = useApi(codeClimateApiRef);
  const repoID = (_b = (_a = entity == null ? void 0 : entity.metadata.annotations) == null ? void 0 : _a[CODECLIMATE_REPO_ID_ANNOTATION]) != null ? _b : "";
  const { loading, value, error } = useAsync(() => codeClimateApi.fetchData(repoID), [codeClimateApi, repoID]);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (!repoID) {
    return /* @__PURE__ */ React.createElement(MissingAnnotationEmptyState, {
      annotation: CODECLIMATE_REPO_ID_ANNOTATION
    });
  } else if (error) {
    return /* @__PURE__ */ React.createElement(ErrorPanel, {
      error
    });
  } else if (!value) {
    return /* @__PURE__ */ React.createElement(EmptyState, {
      missing: "info",
      title: "No information to display",
      description: `There is no Code Climate repo setup with id '${repoID}'.`
    });
  }
  return /* @__PURE__ */ React.createElement(CodeClimateTable, {
    codeClimateData: value
  });
};

const CodeClimateCard = () => /* @__PURE__ */ React.createElement(InfoCard, {
  title: "Code Climate Summary"
}, /* @__PURE__ */ React.createElement(CodeClimateCardContents, null));

export { CodeClimateCard };
//# sourceMappingURL=index-04844540.esm.js.map
