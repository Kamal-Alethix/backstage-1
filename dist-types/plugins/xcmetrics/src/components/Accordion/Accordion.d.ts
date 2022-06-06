import { PropsWithChildren } from 'react';
interface AccordionProps {
    id: string;
    heading: string;
    secondaryHeading?: string | number;
    disabled?: boolean;
    unmountOnExit?: boolean;
}
export declare const Accordion: (props: PropsWithChildren<AccordionProps>) => JSX.Element;
export {};
