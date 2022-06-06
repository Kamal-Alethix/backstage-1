/// <reference types="react" />
export interface DurationSliderProps {
    header: string;
    value: number;
    setValue: (value: number) => void;
}
export declare function DurationSlider(props: DurationSliderProps): JSX.Element;
