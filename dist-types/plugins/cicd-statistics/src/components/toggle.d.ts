import { PropsWithChildren } from 'react';
export interface ToggleProps {
    checked: boolean;
    setChecked: (checked: boolean) => void;
}
export declare function Toggle({ checked, setChecked, children, }: PropsWithChildren<ToggleProps>): JSX.Element;
