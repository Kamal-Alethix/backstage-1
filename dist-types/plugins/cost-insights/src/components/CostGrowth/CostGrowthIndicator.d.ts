/// <reference types="react" />
import { TypographyProps } from '@material-ui/core';
import { ChangeStatistic, Maybe } from '../../types';
export declare type CostGrowthIndicatorProps = TypographyProps & {
    change: ChangeStatistic;
    formatter?: (change: ChangeStatistic) => Maybe<string>;
};
export declare const CostGrowthIndicator: ({ change, formatter, className, ...props }: CostGrowthIndicatorProps) => JSX.Element;
