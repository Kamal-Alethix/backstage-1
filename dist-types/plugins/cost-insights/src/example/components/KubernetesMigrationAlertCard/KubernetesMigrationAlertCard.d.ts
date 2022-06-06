/// <reference types="react" />
import { KubernetesMigrationData } from '../../alerts';
declare type KubernetesMigrationAlertProps = {
    data: KubernetesMigrationData;
    title: string;
    subheader: string;
    currentProduct: string;
    comparedProduct: string;
};
export declare const KubernetesMigrationAlertCard: ({ data, title, subheader, currentProduct, comparedProduct, }: KubernetesMigrationAlertProps) => JSX.Element;
export {};
