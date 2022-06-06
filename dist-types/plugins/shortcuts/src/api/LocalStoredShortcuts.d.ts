import ObservableImpl from 'zen-observable';
import { ShortcutApi } from './ShortcutApi';
import { Shortcut } from '../types';
import { StorageApi } from '@backstage/core-plugin-api';
/**
 * Implementation of the ShortcutApi that uses the StorageApi to store shortcuts.
 */
export declare class LocalStoredShortcuts implements ShortcutApi {
    private readonly storageApi;
    constructor(storageApi: StorageApi);
    shortcut$(): ObservableImpl<Shortcut[]>;
    add(shortcut: Omit<Shortcut, 'id'>): Promise<void>;
    remove(id: string): Promise<void>;
    update(shortcut: Shortcut): Promise<void>;
    getColor(url: string): string;
    private subscribers;
    private readonly observable;
    private readonly THEME_MAP;
    private get;
    private notify;
}
