/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
export declare const SPLUNK_ON_CALL_TEAM = "splunk.com/on-call-team";
export declare const SPLUNK_ON_CALL_ROUTING_KEY = "splunk.com/on-call-routing-key";
export declare const MissingAnnotation: () => JSX.Element;
export declare const InvalidAnnotation: ({ teamName, routingKey, }: {
    teamName: string | undefined;
    routingKey: string | undefined;
}) => JSX.Element;
export declare const MissingEventsRestEndpoint: () => JSX.Element;
export declare const isSplunkOnCallAvailable: (entity: Entity) => boolean;
/** @public */
export declare type EntitySplunkOnCallCardProps = {
    readOnly?: boolean;
};
/** @public */
export declare const EntitySplunkOnCallCard: (props: EntitySplunkOnCallCardProps) => JSX.Element;
