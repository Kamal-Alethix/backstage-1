/// <reference types="react" />
declare type Props = {
    showDialog: boolean;
    handleDialog: () => void;
    onIncidentCreated?: () => void;
};
export declare const TriggerDialog: ({ showDialog, handleDialog, onIncidentCreated: onIncidentCreated, }: Props) => JSX.Element;
export {};
