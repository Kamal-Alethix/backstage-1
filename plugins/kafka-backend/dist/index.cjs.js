'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var express = require('express');
var Router = require('express-promise-router');
var errors = require('@backstage/errors');
var kafkajs = require('kafkajs');
var _ = require('lodash');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var ___default = /*#__PURE__*/_interopDefaultLegacy(_);

class KafkaJsApiImpl {
  constructor(options) {
    options.logger.debug(`creating kafka client with clientId=${options.clientId} and brokers=${options.brokers}`);
    this.kafka = new kafkajs.Kafka(options);
    this.logger = options.logger;
  }
  async fetchTopicOffsets(topic) {
    this.logger.debug(`fetching topic offsets for ${topic}`);
    const admin = this.kafka.admin();
    await admin.connect();
    try {
      return KafkaJsApiImpl.toPartitionOffsets(await admin.fetchTopicOffsets(topic));
    } finally {
      await admin.disconnect();
    }
  }
  async fetchGroupOffsets(groupId) {
    this.logger.debug(`fetching consumer group offsets for ${groupId}`);
    const admin = this.kafka.admin();
    await admin.connect();
    try {
      const groupOffsets = await admin.fetchOffsets({ groupId });
      return groupOffsets.map((topicOffset) => ({
        topic: topicOffset.topic,
        partitions: KafkaJsApiImpl.toPartitionOffsets(topicOffset.partitions)
      }));
    } finally {
      await admin.disconnect();
    }
  }
  static toPartitionOffsets(result) {
    return result.map((seekEntry) => ({
      id: seekEntry.partition,
      offset: seekEntry.offset
    }));
  }
}

function getClusterDetails(config) {
  return config.map((clusterConfig) => {
    const clusterDetails = {
      name: clusterConfig.getString("name"),
      brokers: clusterConfig.getStringArray("brokers")
    };
    const ssl = clusterConfig.getOptional("ssl");
    const sasl = clusterConfig.getOptional("sasl");
    return {
      ...clusterDetails,
      ...ssl ? { ssl } : {},
      ...sasl ? { sasl } : {}
    };
  });
}

const makeRouter = (logger, kafkaApis) => {
  const router = Router__default["default"]();
  router.use(express__default["default"].json());
  const kafkaApiByClusterName = ___default["default"].keyBy(kafkaApis, (item) => item.name);
  router.get("/consumers/:clusterId/:consumerId/offsets", async (req, res) => {
    const clusterId = req.params.clusterId;
    const consumerId = req.params.consumerId;
    const kafkaApi = kafkaApiByClusterName[clusterId];
    if (!kafkaApi) {
      const candidates = Object.keys(kafkaApiByClusterName).map((n) => `"${n}"`).join(", ");
      throw new errors.NotFoundError(`Found no configured cluster "${clusterId}", candidates are ${candidates}`);
    }
    logger.info(`Fetch consumer group ${consumerId} offsets from cluster ${clusterId}`);
    const groupOffsets = await kafkaApi.api.fetchGroupOffsets(consumerId);
    const groupWithTopicOffsets = await Promise.all(groupOffsets.map(async ({ topic, partitions }) => {
      const topicOffsets = ___default["default"].keyBy(await kafkaApi.api.fetchTopicOffsets(topic), (partition) => partition.id);
      return partitions.map((partition) => ({
        topic,
        partitionId: partition.id,
        groupOffset: partition.offset,
        topicOffset: topicOffsets[partition.id].offset
      }));
    }));
    res.json({ consumerId, offsets: groupWithTopicOffsets.flat() });
  });
  return router;
};
async function createRouter(options) {
  const logger = options.logger;
  logger.info("Initializing Kafka backend");
  const clientId = options.config.getString("kafka.clientId");
  const clusters = getClusterDetails(options.config.getConfigArray("kafka.clusters"));
  const kafkaApis = clusters.map((cluster) => ({
    name: cluster.name,
    api: new KafkaJsApiImpl({ clientId, logger, ...cluster })
  }));
  return makeRouter(logger, kafkaApis);
}

exports.createRouter = createRouter;
//# sourceMappingURL=index.cjs.js.map
