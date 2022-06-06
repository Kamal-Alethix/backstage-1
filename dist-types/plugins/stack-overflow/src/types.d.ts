/**
 * Type representing a stack overflow question
 *
 * @public
 */
export declare type StackOverflowQuestion = {
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
export declare type StackOverflowQuestionsContentProps = {
    requestParams: StackOverflowQuestionsRequestParams;
};
/**
 * Type representing the request parameters accepted by the HomePageStackOverflowQuestions component
 *
 * @public
 */
export declare type StackOverflowQuestionsRequestParams = {
    [key: string]: string | string[] | number;
};
