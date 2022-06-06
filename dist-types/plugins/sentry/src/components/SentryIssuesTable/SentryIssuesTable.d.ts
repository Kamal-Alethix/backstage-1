/// <reference types="react" />
import { SentryIssue } from '../../api';
import { Options } from '@material-table/core';
declare type SentryIssuesTableProps = {
    sentryIssues: SentryIssue[];
    statsFor: '24h' | '14d' | '';
    tableOptions: Options<never>;
};
declare const SentryIssuesTable: ({ sentryIssues, statsFor, tableOptions, }: SentryIssuesTableProps) => JSX.Element;
export default SentryIssuesTable;
