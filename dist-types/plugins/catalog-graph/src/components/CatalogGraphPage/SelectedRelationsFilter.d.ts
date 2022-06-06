/// <reference types="react" />
import { RelationPairs } from '../EntityRelationsGraph';
export declare type Props = {
    relationPairs: RelationPairs;
    value: string[] | undefined;
    onChange: (value: string[] | undefined) => void;
};
export declare const SelectedRelationsFilter: ({ relationPairs, value, onChange, }: Props) => JSX.Element;
