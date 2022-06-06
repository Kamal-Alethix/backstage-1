import type { Config } from '@backstage/config';
import { UseFormRegisterReturn } from 'react-hook-form';
/**
 * A helper that converts the result of a render('name', opts) to make it compatible with material-ui.
 *
 * See also https://github.com/react-hook-form/react-hook-form/issues/4629#issuecomment-815840872
 * TODO: remove when updating to material-ui v5 (https://github.com/mui-org/material-ui/pull/23174)
 *
 * @param renderResult - the result of a render('name', opts)
 */
export declare function asInputRef(renderResult: UseFormRegisterReturn): {
    onChange: import("react-hook-form").ChangeHandler;
    onBlur: import("react-hook-form").ChangeHandler;
    name: string;
    min?: string | number | undefined;
    max?: string | number | undefined;
    maxLength?: number | undefined;
    minLength?: number | undefined;
    pattern?: string | undefined;
    required?: boolean | undefined;
    disabled?: boolean | undefined;
    inputRef: import("react-hook-form").RefCallBack;
};
export declare function getCatalogFilename(config: Config): string;
export declare function getBranchName(config: Config): string;
