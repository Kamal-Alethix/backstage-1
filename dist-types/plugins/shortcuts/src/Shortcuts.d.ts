/// <reference types="react" />
import { IconComponent } from '@backstage/core-plugin-api';
/**
 * ShortcutsProps
 * Props for the {@link Shortcuts} component.
 * @public
 */
export interface ShortcutsProps {
    icon?: IconComponent;
}
export declare const Shortcuts: (props: ShortcutsProps) => JSX.Element;
