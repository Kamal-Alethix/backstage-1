/// <reference types="react" />
declare type Props = {
    team: string;
    showDialog: boolean;
    handleDialog: () => void;
    onIncidentCreated: () => void;
};
export declare const TriggerDialog: ({ team, showDialog, handleDialog, onIncidentCreated: onIncidentCreated, }: Props) => JSX.Element;
export {};
