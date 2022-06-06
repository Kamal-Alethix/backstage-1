import React from 'react';
import { AlertFormProps, Entity } from '../../types';
import { KubernetesMigrationAlert } from '../alerts';
export declare type KubernetesMigrationDismissFormData = {
    services: Entity[];
};
export declare type KubernetesMigrationDismissFormProps = AlertFormProps<KubernetesMigrationAlert, KubernetesMigrationDismissFormData>;
export declare const KubernetesMigrationDismissForm: React.ForwardRefExoticComponent<KubernetesMigrationDismissFormProps & React.RefAttributes<HTMLFormElement>>;
