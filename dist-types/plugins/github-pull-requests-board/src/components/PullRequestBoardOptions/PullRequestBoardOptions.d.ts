import { ReactNode, FunctionComponent } from 'react';
import { PRCardFormating } from '../../utils/types';
declare type Option = {
    icon: ReactNode;
    value: string;
    ariaLabel: string;
};
declare type Props = {
    value: string[];
    onClickOption: (selectedOptions: PRCardFormating[]) => void;
    options: Option[];
};
declare const PullRequestBoardOptions: FunctionComponent<Props>;
export default PullRequestBoardOptions;
