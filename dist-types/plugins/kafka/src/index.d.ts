/**
 * A Backstage plugin that integrates towards Kafka
 *
 * @packageDocumentation
 */
export { kafkaPlugin, kafkaPlugin as plugin, EntityKafkaContent, } from './plugin';
export { KAFKA_CONSUMER_GROUP_ANNOTATION } from './constants';
export { Router, isPluginApplicableToEntity, isPluginApplicableToEntity as isKafkaAvailable, } from './Router';
