import React from 'react';
import { GCalendarEvent } from '../..';
declare type Props = {
    handleAuthClick: React.MouseEventHandler<HTMLElement>;
    events?: GCalendarEvent[];
};
export declare const SignInContent: ({ handleAuthClick, events, }: Props) => JSX.Element;
export {};
