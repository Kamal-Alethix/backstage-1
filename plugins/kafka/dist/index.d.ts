/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';

declare const kafkaPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    entityContent: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const EntityKafkaContent: (_props: {}) => JSX.Element;

declare const KAFKA_CONSUMER_GROUP_ANNOTATION = "kafka.apache.org/consumer-groups";

declare const isPluginApplicableToEntity: (entity: Entity) => boolean;
declare type Props = {};
declare const Router: (_props: Props) => JSX.Element;

export { EntityKafkaContent, KAFKA_CONSUMER_GROUP_ANNOTATION, Router, isPluginApplicableToEntity as isKafkaAvailable, isPluginApplicableToEntity, kafkaPlugin, kafkaPlugin as plugin };
