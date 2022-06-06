import React from 'react';
declare type WithLinkProps = {
    url?: string;
    className: string;
    children: React.ReactNode;
};
export declare function isValidUrl(url: string | undefined): url is string;
export declare const WithLink: ({ url, className, children, }: WithLinkProps) => JSX.Element;
export {};
