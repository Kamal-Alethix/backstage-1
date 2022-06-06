/// <reference types="react" />
import { ReportIssueTemplate, Repository } from './types';
declare type IssueLinkProps = {
    template: ReportIssueTemplate;
    repository: Repository;
};
export declare const IssueLink: ({ template, repository }: IssueLinkProps) => JSX.Element;
export {};
