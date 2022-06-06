/// <reference types="react" />
import { Shift } from '../../types';
export declare const ShiftOverrideModal: ({ scheduleId, shift, refetchOnCallSchedules, isModalOpened, setIsModalOpened, }: {
    scheduleId: number;
    shift: Shift;
    refetchOnCallSchedules: () => void;
    isModalOpened: boolean;
    setIsModalOpened: (isModalOpened: boolean) => void;
}) => JSX.Element | null;
