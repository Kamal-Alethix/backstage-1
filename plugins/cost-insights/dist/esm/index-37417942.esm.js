import React from 'react';
import { Typography, Box } from '@material-ui/core';
import { aj as AlertInstructionsLayout } from './index-ab932d56.esm.js';
import { Link, CodeSnippet } from '@backstage/core-components';
import '@backstage/core-plugin-api';
import 'pluralize';
import '@material-ui/icons/AccessTime';
import '@material-ui/icons/Check';
import '@material-ui/icons/Delete';
import 'classnames';
import '@material-ui/icons/MonetizationOn';
import '@material-ui/icons/Whatshot';
import '@material-ui/icons/Settings';
import '@material-ui/icons/AccountTree';
import '@material-ui/icons/Storage';
import '@material-ui/icons/Search';
import '@material-ui/icons/CloudQueue';
import '@material-ui/icons/School';
import '@material-ui/icons/ViewHeadline';
import '@material-ui/lab';
import 'react-router-dom';
import 'qs';
import 'yup';
import 'luxon';
import '@backstage/catalog-model';
import '@material-ui/lab/Alert';
import '@material-ui/icons/Close';
import '@material-ui/icons/ExpandMore';
import '@material-ui/icons/ChevronLeft';
import 'recharts';
import '@material-ui/icons/ChevronRight';
import '@material-ui/icons/Lens';
import '@material-ui/icons/HelpOutlineOutlined';
import 'react-use/lib/useCopyToClipboard';
import '@material-ui/icons/AssignmentOutlined';
import '@material-ui/icons/AssignmentTurnedInOutlined';
import '@material-ui/icons/SentimentVeryDissatisfied';
import '@material-ui/icons/ArrowDropUp';
import '@material-ui/icons/ArrowDropDown';
import 'react-use/lib/useAsync';
import '@material-ui/icons/Fullscreen';
import 'regression';

const LabelDataflowInstructionsPage = () => {
  return /* @__PURE__ */ React.createElement(AlertInstructionsLayout, {
    title: "Investigating Growth"
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h1"
  }, "Labeling Dataflow Jobs"), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "Labels in Google Cloud Platform are key-value pairs that can be added to most types of cloud resources. Since these labels are also exported in billing data, adding labels allows a granular breakdown of cloud cost by software entity."), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "In Cloud Dataflow, labels can be added to a job either programmatically or via the command-line when launching a job. Note that GCP has", " ", /* @__PURE__ */ React.createElement(Link, {
    to: "https://cloud.google.com/compute/docs/labeling-resources#restrictions"
  }, "restrictions"), " ", "on the length and characters that can be used in labels."), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "Labels are not retroactive, so cost tracking is only possible from when the labels are first added to a Dataflow job."), /* @__PURE__ */ React.createElement(Box, {
    mt: 4
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h3"
  }, "DataflowPipelineOptions"), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "Dataflow jobs using Beam's", " ", /* @__PURE__ */ React.createElement(Link, {
    to: "https://beam.apache.org/releases/javadoc/2.3.0/org/apache/beam/runners/dataflow/options/DataflowPipelineOptions.html"
  }, "DataflowPipelineOptions"), " ", "directly can use the ", /* @__PURE__ */ React.createElement("b", null, "setLabels"), " function to add one or more labels:", /* @__PURE__ */ React.createElement(CodeSnippet, {
    language: "java",
    text: `private DataflowPipelineOptions options = PipelineOptionsFactory.fromArgs(args).as(DataflowPipelineOptionsImpl.class); 
options.setLabels(ImmutableMap.of("job-id", "my-dataflow-job"));`
  })), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "Dataflow jobs using Scio can similarly set options on the ScioContext:", /* @__PURE__ */ React.createElement(CodeSnippet, {
    language: "scala",
    text: `val (sc: ScioContext, args: Args) = ContextAndArgs(cmdLineArgs)
sc.optionsAs[DataflowPipelineOptions].setLabels(Map("job-id" -> "my-dataflow-job").asJava)`
  }))), /* @__PURE__ */ React.createElement(Box, {
    mt: 4
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h3"
  }, "Command-line"), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "Dataflow jobs launched from the command-line can add labels as an argument:", /* @__PURE__ */ React.createElement(CodeSnippet, {
    language: "shell",
    text: `--labels={"job-id": "my-dataflow-job", "date-argument": "2020-09-16"}`
  })), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "For more information on specifying options, see the", " ", /* @__PURE__ */ React.createElement(Link, {
    to: "https://cloud.google.com/dataflow/docs/guides/specifying-exec-params"
  }, "Dataflow documentation"), " ", "or", " ", /* @__PURE__ */ React.createElement(Link, {
    to: "https://spotify.github.io/scio/api/com/spotify/scio/ScioContext.html"
  }, "Scio Scaladoc"), ".")));
};

export { LabelDataflowInstructionsPage };
//# sourceMappingURL=index-37417942.esm.js.map
