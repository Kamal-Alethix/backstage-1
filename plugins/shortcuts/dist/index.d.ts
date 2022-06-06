/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { IconComponent, StorageApi } from '@backstage/core-plugin-api';
import ObservableImpl from 'zen-observable';
import { Observable } from '@backstage/types';

/**
 * ShortcutsProps
 * Props for the {@link Shortcuts} component.
 * @public
 */
interface ShortcutsProps {
    icon?: IconComponent;
}

declare const shortcutsPlugin: _backstage_core_plugin_api.BackstagePlugin<{}, {}>;
declare const Shortcuts: (props: ShortcutsProps) => JSX.Element;

declare type Shortcut = {
    id: string;
    url: string;
    title: string;
};

declare const shortcutsApiRef: _backstage_core_plugin_api.ApiRef<ShortcutApi>;
interface ShortcutApi {
    /**
     * Returns an Observable that will subscribe to changes.
     */
    shortcut$(): Observable<Shortcut[]>;
    /**
     * Generates a unique id for the shortcut and then saves it.
     */
    add(shortcut: Omit<Shortcut, 'id'>): Promise<void>;
    /**
     * Removes the shortcut.
     */
    remove(id: string): Promise<void>;
    /**
     * Finds an existing shortcut that matches the ID of the
     * supplied shortcut and updates its values.
     */
    update(shortcut: Shortcut): Promise<void>;
    /**
     * Each shortcut should get a color for its icon based on the url.
     *
     * Preferably using some abstraction between the url and the actual
     * color value.
     */
    getColor(url: string): string;
}

/**
 * Implementation of the ShortcutApi that uses the StorageApi to store shortcuts.
 */
declare class LocalStoredShortcuts implements ShortcutApi {
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

export { LocalStoredShortcuts, Shortcut, ShortcutApi, Shortcuts, ShortcutsProps, shortcutsApiRef, shortcutsPlugin };
