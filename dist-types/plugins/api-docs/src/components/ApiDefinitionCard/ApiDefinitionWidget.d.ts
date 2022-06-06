import React from 'react';
export declare type ApiDefinitionWidget = {
    type: string;
    title: string;
    component: (definition: string) => React.ReactElement;
    rawLanguage?: string;
};
export declare function defaultDefinitionWidgets(): ApiDefinitionWidget[];
