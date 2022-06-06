/// <reference types="react" />
import { Options } from '@material-table/core';
declare type SentryPageProps = {
    statsFor?: '24h' | '14d' | '';
    tableOptions?: Options<never>;
};
export declare const EntitySentryContent: ({ statsFor, tableOptions }: SentryPageProps) => JSX.Element;
export declare const EntitySentryCard: ({ statsFor, tableOptions, }: SentryPageProps) => JSX.Element;
export {};
