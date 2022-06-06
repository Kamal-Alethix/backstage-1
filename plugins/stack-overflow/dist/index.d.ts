/// <reference types="react" />
import * as _backstage_plugin_home from '@backstage/plugin-home';
import * as react from 'react';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';

/**
 * Type representing a stack overflow question
 *
 * @public
 */
declare type StackOverflowQuestion = {
    title: string;
    link: string;
    owner: Record<string, string>;
    tags: string[];
    answer_count: number;
};
/**
 * Props for HomePageStackOverflowQuestions
 *
 * @public
 */
declare type StackOverflowQuestionsContentProps = {
    requestParams: StackOverflowQuestionsRequestParams;
};
/**
 * Type representing the request parameters accepted by the HomePageStackOverflowQuestions component
 *
 * @public
 */
declare type StackOverflowQuestionsRequestParams = {
    [key: string]: string | string[] | number;
};

/**
 * The Backstage plugin that holds stack overflow specific components
 *
 * @public
 */
declare const stackOverflowPlugin: _backstage_core_plugin_api.BackstagePlugin<{}, {}>;
/**
 * A component to display a stack overflow search result
 *
 * @public
 */
declare const StackOverflowSearchResultListItem: (props: {
    result: any;
    icon?: react.ReactNode;
}) => JSX.Element;
/**
 * A component to display a list of stack overflow questions on the homepage.
 *
 * @public
 */
declare const HomePageStackOverflowQuestions: (props: _backstage_plugin_home.ComponentRenderer & {
    title?: string | undefined;
} & StackOverflowQuestionsContentProps) => JSX.Element;

export { HomePageStackOverflowQuestions, StackOverflowQuestion, StackOverflowQuestionsContentProps, StackOverflowQuestionsRequestParams, StackOverflowSearchResultListItem, stackOverflowPlugin };
