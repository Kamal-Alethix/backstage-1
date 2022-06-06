/// <reference types="react" />
import { Shortcut } from './types';
import { ShortcutApi } from './api';
declare type Props = {
    shortcut: Shortcut;
    onClose: () => void;
    anchorEl?: Element;
    api: ShortcutApi;
};
export declare const EditShortcut: ({ shortcut, onClose, anchorEl, api }: Props) => JSX.Element;
export {};
