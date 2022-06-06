/// <reference types="react" />
import { StackOverflowQuestionsContentProps } from './types';
/**
 * The Backstage plugin that holds stack overflow specific components
 *
 * @public
 */
export declare const stackOverflowPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{}, {}>;
/**
 * A component to display a stack overflow search result
 *
 * @public
 */
export declare const StackOverflowSearchResultListItem: (props: {
    result: any;
    icon?: import("react").ReactNode;
}) => JSX.Element;
/**
 * A component to display a list of stack overflow questions on the homepage.
 *
 * @public
 */
export declare const HomePageStackOverflowQuestions: (props: import("@backstage/plugin-home").ComponentRenderer & {
    title?: string | undefined;
} & StackOverflowQuestionsContentProps) => JSX.Element;
