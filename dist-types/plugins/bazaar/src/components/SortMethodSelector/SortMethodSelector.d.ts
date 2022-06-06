import { ChangeEvent, ReactNode } from 'react';
declare type Props = {
    sortMethodNbr: number;
    handleSortMethodChange: ((event: ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>, child: ReactNode) => void) | undefined;
};
export declare const SortMethodSelector: ({ sortMethodNbr, handleSortMethodChange, }: Props) => JSX.Element;
export {};
