import { Shortcut } from '../types';
import { Observable } from '@backstage/types';
export declare const shortcutsApiRef: import("@backstage/core-plugin-api").ApiRef<ShortcutApi>;
export interface ShortcutApi {
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
