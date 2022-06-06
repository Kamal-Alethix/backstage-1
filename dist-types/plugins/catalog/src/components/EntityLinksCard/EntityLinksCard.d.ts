/// <reference types="react" />
import { ColumnBreakpoints } from './types';
import { InfoCardVariants } from '@backstage/core-components';
/** @public */
export interface EntityLinksCardProps {
    cols?: ColumnBreakpoints | number;
    variant?: InfoCardVariants;
}
export declare function EntityLinksCard(props: EntityLinksCardProps): JSX.Element;
