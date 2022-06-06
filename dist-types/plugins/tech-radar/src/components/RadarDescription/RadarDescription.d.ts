/// <reference types="react" />
export declare type Props = {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    url?: string;
};
declare const RadarDescription: (props: Props) => JSX.Element;
export { RadarDescription };
