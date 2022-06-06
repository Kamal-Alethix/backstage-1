/// <reference types="react" />
declare type Props = {
    refreshIncidents: boolean;
    team: string;
    readOnly: boolean;
};
export declare const Incidents: ({ readOnly, refreshIncidents, team }: Props) => JSX.Element;
export {};
