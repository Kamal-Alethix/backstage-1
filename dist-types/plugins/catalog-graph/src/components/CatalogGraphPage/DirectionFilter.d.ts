/// <reference types="react" />
import { Direction } from '../EntityRelationsGraph';
export declare type Props = {
    value: Direction;
    onChange: (value: Direction) => void;
};
export declare const DirectionFilter: ({ value, onChange }: Props) => JSX.Element;
