import React from 'react';
import { User, Shift } from '../types';
export declare const useShiftOverride: (s: Shift, isModalOpened: boolean) => readonly [{
    readonly shift: Shift;
    readonly users: User[];
    readonly user: User;
    readonly start: string;
    readonly end: string;
    readonly error: Error | undefined;
    readonly isLoading: boolean;
}, {
    readonly retry: (() => void) | (() => void) | (() => void) | (() => void);
    readonly setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    readonly setUser: (user: User) => void;
    readonly setStart: (start: string) => void;
    readonly setEnd: (end: string) => void;
}];
