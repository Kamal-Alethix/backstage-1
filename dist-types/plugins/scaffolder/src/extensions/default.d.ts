/// <reference types="react" />
/// <reference types="@rjsf/core" />
export declare const DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS: ({
    component: (props: import("./types").FieldExtensionComponentProps<string, import("../components/fields/EntityPicker/EntityPicker").EntityPickerUiOptions>) => JSX.Element;
    name: string;
    validation?: undefined;
} | {
    component: (props: import("./types").FieldExtensionComponentProps<string[], import("../components/fields/EntityTagsPicker/EntityTagsPicker").EntityTagsPickerUiOptions>) => JSX.Element;
    name: string;
    validation?: undefined;
} | {
    component: (props: import("./types").FieldExtensionComponentProps<string, import("../components/fields/RepoUrlPicker/RepoUrlPicker").RepoUrlPickerUiOptions>) => JSX.Element;
    name: string;
    validation: (value: string, validation: import("@rjsf/core").FieldValidation, context: {
        apiHolder: import("@backstage/core-plugin-api").ApiHolder;
    }) => void;
})[];
