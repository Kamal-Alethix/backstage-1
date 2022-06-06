import { JsonObject } from '@backstage/types';
import { FormProps } from '@rjsf/core';
export declare function transformSchemaToProps(inputSchema: JsonObject): {
    schema: FormProps<any>['schema'];
    uiSchema: FormProps<any>['uiSchema'];
};
