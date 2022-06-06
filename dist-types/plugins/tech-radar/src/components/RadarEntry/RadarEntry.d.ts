import React from 'react';
export declare type Props = {
    x: number;
    y: number;
    value: number;
    color: string;
    url?: string;
    moved?: number;
    description?: string;
    title?: string;
    onMouseEnter?: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
    onMouseLeave?: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
    onClick?: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
};
declare const RadarEntry: (props: Props) => JSX.Element;
export default RadarEntry;
