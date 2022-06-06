import React from 'react';
export declare function ListItemText(props: {
    primary: React.ReactNode;
    secondary?: React.ReactNode;
}): JSX.Element;
export declare function ListSubheader(props: {
    children?: React.ReactNode;
}): JSX.Element;
export declare function Container(props: {
    title: React.ReactNode;
    helpLink?: string;
    children: React.ReactNode;
}): JSX.Element;
export declare function KeyValueListItem(props: {
    indent?: boolean;
    entry: [string, string];
}): JSX.Element;
export declare function HelpIcon(props: {
    to: string;
}): JSX.Element;
