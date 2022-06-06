/// <reference types="react" />
import { ShortcutApi } from './api';
import { Shortcut } from './types';
declare type Props = {
    shortcut: Shortcut;
    api: ShortcutApi;
};
export declare const ShortcutItem: ({ shortcut, api }: Props) => JSX.Element;
export {};
