/// <reference types="react" />
import { IconComponent } from '@backstage/core-plugin-api';
interface ExtraContextMenuItem {
    title: string;
    Icon: IconComponent;
    onClick: () => void;
}
interface contextMenuOptions {
    disableUnregister: boolean;
}
interface EntityContextMenuProps {
    UNSTABLE_extraContextMenuItems?: ExtraContextMenuItem[];
    UNSTABLE_contextMenuOptions?: contextMenuOptions;
    onUnregisterEntity: () => void;
    onInspectEntity: () => void;
}
export declare function EntityContextMenu(props: EntityContextMenuProps): JSX.Element;
export {};
