/// <reference types="react" />
import { TooltipProps } from '@material-ui/core/Tooltip';
import { TextTruncateProps } from 'react-text-truncate';
declare type Props = {
    text: TextTruncateProps['text'];
    line?: TextTruncateProps['line'];
    element?: TextTruncateProps['element'];
    title?: TooltipProps['title'];
    placement?: TooltipProps['placement'];
};
export declare type OverflowTooltipClassKey = 'container';
export declare function OverflowTooltip(props: Props): JSX.Element;
export {};
