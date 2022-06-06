/// <reference types="react" />
import { ShortcutApi } from './api';
declare type Props = {
    onClose: () => void;
    anchorEl?: Element;
    api: ShortcutApi;
};
export declare const AddShortcut: ({ onClose, anchorEl, api }: Props) => JSX.Element;
export {};
