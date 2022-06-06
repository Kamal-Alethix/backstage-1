/// <reference types="react" />
declare type Props = {
    open: boolean;
    handleClose: () => void;
    message: (string | JSX.Element)[];
    type: 'delete' | 'unlink';
    handleSubmit: () => void;
};
export declare const ConfirmationDialog: ({ open, handleClose, message, type, handleSubmit, }: Props) => JSX.Element;
export {};
