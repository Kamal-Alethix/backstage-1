import { E as EntityPicker, l as EntityNamePicker, m as entityNamePickerValidation, n as EntityTagsPicker, R as RepoUrlPicker, o as repoPickerValidation, O as OwnerPicker, p as OwnedEntityPicker } from './index-b64713a1.esm.js';

const DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS = [
  {
    component: EntityPicker,
    name: "EntityPicker"
  },
  {
    component: EntityNamePicker,
    name: "EntityNamePicker",
    validation: entityNamePickerValidation
  },
  {
    component: EntityTagsPicker,
    name: "EntityTagsPicker"
  },
  {
    component: RepoUrlPicker,
    name: "RepoUrlPicker",
    validation: repoPickerValidation
  },
  {
    component: OwnerPicker,
    name: "OwnerPicker"
  },
  {
    component: OwnedEntityPicker,
    name: "OwnedEntityPicker"
  }
];

export { DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS as D };
//# sourceMappingURL=default-554cb9ad.esm.js.map
