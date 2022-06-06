import React from 'react';
interface IErrorPageProps {
    status: string;
    statusMessage: string;
    additionalInfo?: React.ReactNode;
    supportUrl?: string;
}
/** @public */
export declare type ErrorPageClassKey = 'container' | 'title' | 'subtitle';
/**
 * Error page with status and description
 *
 * @public
 *
 */
export declare function ErrorPage(props: IErrorPageProps): JSX.Element;
export {};
