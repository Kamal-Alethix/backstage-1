import { createApiRef, createRouteRef, createPlugin, createApiFactory, discoveryApiRef, identityApiRef, createRoutableExtension, useApi, errorApiRef } from '@backstage/core-plugin-api';
import React, { useMemo } from 'react';
import { Routes, Route } from 'react-router';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Grid, Box, Typography } from '@material-ui/core';
import RetryIcon from '@material-ui/icons/Replay';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import { Table, MissingAnnotationEmptyState } from '@backstage/core-components';

class KafkaBackendClient {
  constructor(options) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }
  async internalGet(path) {
    const url = `${await this.discoveryApi.getBaseUrl("kafka")}${path}`;
    const { token: idToken } = await this.identityApi.getCredentials();
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...idToken && { Authorization: `Bearer ${idToken}` }
      }
    });
    if (!response.ok) {
      const payload = await response.text();
      const message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      throw new Error(message);
    }
    return await response.json();
  }
  async getConsumerGroupOffsets(clusterId, consumerGroup) {
    return await this.internalGet(`/consumers/${clusterId}/${consumerGroup}/offsets`);
  }
}

const kafkaApiRef = createApiRef({
  id: "plugin.kafka.service"
});

const rootCatalogKafkaRouteRef = createRouteRef({
  id: "kafka"
});
const kafkaPlugin = createPlugin({
  id: "kafka",
  apis: [
    createApiFactory({
      api: kafkaApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) => new KafkaBackendClient({ discoveryApi, identityApi })
    })
  ],
  routes: {
    entityContent: rootCatalogKafkaRouteRef
  }
});
const EntityKafkaContent = kafkaPlugin.provide(createRoutableExtension({
  name: "EntityKafkaContent",
  component: () => Promise.resolve().then(function () { return Router$1; }).then((m) => m.Router),
  mountPoint: rootCatalogKafkaRouteRef
}));

const KAFKA_CONSUMER_GROUP_ANNOTATION = "kafka.apache.org/consumer-groups";

const useConsumerGroupsForEntity = () => {
  var _a, _b;
  const { entity } = useEntity();
  const annotation = (_b = (_a = entity.metadata.annotations) == null ? void 0 : _a[KAFKA_CONSUMER_GROUP_ANNOTATION]) != null ? _b : "";
  const consumerList = useMemo(() => {
    return annotation.split(",").map((consumer) => {
      const [clusterId, consumerGroup] = consumer.split("/");
      if (!clusterId || !consumerGroup) {
        throw new Error(`Failed to parse kafka consumer group annotation: got "${annotation}"`);
      }
      return {
        clusterId: clusterId.trim(),
        consumerGroup: consumerGroup.trim()
      };
    });
  }, [annotation]);
  return consumerList;
};

const useConsumerGroupsOffsetsForEntity = () => {
  const consumers = useConsumerGroupsForEntity();
  const api = useApi(kafkaApiRef);
  const errorApi = useApi(errorApiRef);
  const {
    loading,
    value: consumerGroupsTopics,
    retry
  } = useAsyncRetry(async () => {
    try {
      return await Promise.all(consumers.map(async ({ clusterId, consumerGroup }) => {
        const response = await api.getConsumerGroupOffsets(clusterId, consumerGroup);
        return { clusterId, consumerGroup, topics: response.offsets };
      }));
    } catch (e) {
      errorApi.post(e);
      throw e;
    }
  }, [consumers, api, errorApi]);
  return [
    {
      loading,
      consumerGroupsTopics
    },
    {
      retry
    }
  ];
};

const generatedColumns = [
  {
    title: "Topic",
    field: "topic",
    highlight: true,
    render: (row) => {
      var _a;
      return /* @__PURE__ */ React.createElement(React.Fragment, null, (_a = row.topic) != null ? _a : "");
    }
  },
  {
    title: "Partition",
    field: "partitionId",
    render: (row) => {
      var _a;
      return /* @__PURE__ */ React.createElement(React.Fragment, null, (_a = row.partitionId) != null ? _a : "");
    }
  },
  {
    title: "Topic Offset",
    field: "topicOffset",
    render: (row) => {
      var _a;
      return /* @__PURE__ */ React.createElement(React.Fragment, null, (_a = row.topicOffset) != null ? _a : "");
    }
  },
  {
    title: "Group Offset",
    field: "groupOffset",
    render: (row) => {
      var _a;
      return /* @__PURE__ */ React.createElement(React.Fragment, null, (_a = row.groupOffset) != null ? _a : "");
    }
  },
  {
    title: "Lag",
    field: "lag",
    render: (row) => {
      let lag = void 0;
      if (row.topicOffset && row.groupOffset) {
        lag = +row.topicOffset - +row.groupOffset;
      }
      return /* @__PURE__ */ React.createElement(React.Fragment, null, lag != null ? lag : "");
    }
  }
];
const ConsumerGroupOffsets = ({
  loading,
  topics,
  clusterId,
  consumerGroup,
  retry
}) => {
  return /* @__PURE__ */ React.createElement(Table, {
    isLoading: loading,
    actions: [
      {
        icon: () => /* @__PURE__ */ React.createElement(RetryIcon, null),
        tooltip: "Refresh Data",
        isFreeAction: true,
        onClick: () => retry()
      }
    ],
    data: topics != null ? topics : [],
    title: /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(Typography, {
      variant: "h6"
    }, "Consumed Topics for ", consumerGroup, " (", clusterId, ")")),
    columns: generatedColumns
  });
};
const KafkaTopicsForConsumer = () => {
  var _a;
  const [tableProps, { retry }] = useConsumerGroupsOffsetsForEntity();
  return /* @__PURE__ */ React.createElement(Grid, null, (_a = tableProps.consumerGroupsTopics) == null ? void 0 : _a.map((consumerGroup) => /* @__PURE__ */ React.createElement(ConsumerGroupOffsets, {
    ...consumerGroup,
    loading: tableProps.loading,
    retry
  })));
};

const isPluginApplicableToEntity = (entity) => {
  var _a;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[KAFKA_CONSUMER_GROUP_ANNOTATION]);
};
const Router = (_props) => {
  const { entity } = useEntity();
  if (!isPluginApplicableToEntity(entity)) {
    return /* @__PURE__ */ React.createElement(MissingAnnotationEmptyState, {
      annotation: KAFKA_CONSUMER_GROUP_ANNOTATION
    });
  }
  return /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, {
    path: "/",
    element: /* @__PURE__ */ React.createElement(KafkaTopicsForConsumer, null)
  }));
};

var Router$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isPluginApplicableToEntity: isPluginApplicableToEntity,
  Router: Router
});

export { EntityKafkaContent, KAFKA_CONSUMER_GROUP_ANNOTATION, Router, isPluginApplicableToEntity as isKafkaAvailable, isPluginApplicableToEntity, kafkaPlugin, kafkaPlugin as plugin };
//# sourceMappingURL=index.esm.js.map
