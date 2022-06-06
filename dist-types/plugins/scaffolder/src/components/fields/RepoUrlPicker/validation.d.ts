import { FieldValidation } from '@rjsf/core';
import { ApiHolder } from '@backstage/core-plugin-api';
/**
 * The validation function for the `repoUrl` that is returned from the
 * field extension. Ensures that you have all the required fields filled for
 * the different providers that exist.
 *
 * @public
 */
export declare const repoPickerValidation: (value: string, validation: FieldValidation, context: {
    apiHolder: ApiHolder;
}) => void;
