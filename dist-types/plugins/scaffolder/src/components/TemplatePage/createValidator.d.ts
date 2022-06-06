import { CustomFieldValidator } from '../../extensions';
import { FormValidation } from '@rjsf/core';
import { JsonObject } from '@backstage/types';
import { ApiHolder } from '@backstage/core-plugin-api';
export declare const createValidator: (rootSchema: JsonObject, validators: Record<string, undefined | CustomFieldValidator<unknown>>, context: {
    apiHolder: ApiHolder;
}) => (formData: JsonObject, errors: FormValidation) => FormValidation;
