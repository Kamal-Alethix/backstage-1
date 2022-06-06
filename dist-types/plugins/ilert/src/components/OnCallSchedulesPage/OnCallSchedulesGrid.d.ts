/// <reference types="react" />
import { Schedule } from '../../types';
export declare const OnCallSchedulesGrid: ({ onCallSchedules, isLoading, refetchOnCallSchedules, }: {
    onCallSchedules: Schedule[];
    isLoading: boolean;
    refetchOnCallSchedules: () => void;
}) => JSX.Element;
