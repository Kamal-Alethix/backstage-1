/// <reference types="react" />
import { User } from '../types';
declare type Props = {
    users: {
        [key: string]: User;
    };
    team: string;
};
export declare const EscalationPolicy: ({ users, team }: Props) => JSX.Element;
export {};
