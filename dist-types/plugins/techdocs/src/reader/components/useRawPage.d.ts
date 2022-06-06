import { CompoundEntityRef } from '@backstage/catalog-model';
import { AsyncState } from 'react-use/lib/useAsync';
export declare type RawPage = {
    content: string;
    path: string;
    entityId: CompoundEntityRef;
};
export declare function useRawPage(path: string, kind: string, namespace: string, name: string): AsyncState<RawPage> & {
    retry(): void;
};
