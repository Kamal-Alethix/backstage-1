/// <reference types="react" />
import { BuildFilters } from '../../api';
interface FiltersProps {
    initialValues: BuildFilters;
    onFilterChange: (filters: BuildFilters) => void;
}
export declare const BuildListFilter: ({ onFilterChange, initialValues, }: FiltersProps) => JSX.Element;
export {};
