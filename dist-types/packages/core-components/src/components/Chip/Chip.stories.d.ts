/// <reference types="react" />
import { ChipProps } from '@material-ui/core/Chip';
declare const _default: {
    title: string;
    component: import("@material-ui/core/OverridableComponent").OverridableComponent<import("@material-ui/core/Chip").ChipTypeMap<{}, "div">>;
    argTypes: {
        size: {
            options: string[];
            control: {
                type: string;
            };
        };
        variant: {
            options: string[];
            control: {
                type: string;
            };
        };
        icon: {
            options: string[];
            mapping: {
                AddIcon: JSX.Element;
                WarningIcon: JSX.Element;
                EditIcon: JSX.Element;
                None: null;
            };
            control: {
                type: string;
            };
        };
    };
};
export default _default;
export declare const Default: {
    (args: ChipProps): JSX.Element;
    args: {
        label: string;
        size: string;
        variant: string;
        icon: string;
    };
};
export declare const Deleteable: {
    (args: ChipProps): JSX.Element;
    args: {
        label: string;
        size: string;
        variant: string;
        icon: string;
    };
};
