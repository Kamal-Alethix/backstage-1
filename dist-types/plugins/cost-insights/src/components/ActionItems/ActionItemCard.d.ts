/// <reference types="react" />
import { Alert } from '../../types';
declare type ActionItemCardProps = {
    alert: Alert;
    number?: number;
    avatar?: JSX.Element;
    disableScroll?: boolean;
};
export declare const ActionItemCard: ({ alert, avatar, number, disableScroll, }: ActionItemCardProps) => JSX.Element;
export {};
