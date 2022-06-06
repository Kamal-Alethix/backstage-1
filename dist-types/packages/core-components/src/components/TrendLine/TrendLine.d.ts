/// <reference types="react" />
import { SparklinesLineProps, SparklinesProps } from 'react-sparklines';
export declare function TrendLine(props: SparklinesProps & Pick<SparklinesLineProps, 'color'> & {
    title?: string;
}): JSX.Element | null;
