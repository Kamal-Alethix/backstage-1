import React from 'react';
import { Theme, WithStyles } from '@material-ui/core';
import { Stats } from './Stats';
interface DialogTitleProps extends WithStyles<typeof styles> {
    children: React.ReactNode;
    setShowStats: React.ComponentProps<typeof Stats>['setShowStats'];
}
declare const styles: (theme: Theme) => import("@material-ui/styles").StyleRules<{}, "root" | "closeButton">;
export declare const DialogTitle: React.ComponentType<Pick<DialogTitleProps, "children" | "setShowStats"> & import("@material-ui/core").StyledComponentProps<"root" | "closeButton">>;
export {};
