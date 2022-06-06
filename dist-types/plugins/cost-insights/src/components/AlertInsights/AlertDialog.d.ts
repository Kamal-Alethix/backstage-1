/// <reference types="react" />
import { Alert, AlertStatus, Maybe } from '../../types';
declare type AlertDialogProps = {
    open: boolean;
    group: string;
    alert: Maybe<Alert>;
    status: Maybe<AlertStatus>;
    onClose: () => void;
    onSubmit: (data: any) => void;
};
export declare const AlertDialog: ({ open, group, alert, status, onClose, onSubmit, }: AlertDialogProps) => JSX.Element;
export {};
