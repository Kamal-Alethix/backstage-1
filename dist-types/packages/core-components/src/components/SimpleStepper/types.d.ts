import React from 'react';
export declare type StepActions = {
    showNext?: boolean;
    canNext?: () => boolean;
    onNext?: () => void;
    nextStep?: (current: number, last: number) => number;
    nextText?: string;
    showBack?: boolean;
    backText?: string;
    onBack?: () => void;
    showRestart?: boolean;
    canRestart?: () => boolean;
    onRestart?: () => void;
    restartText?: string;
};
export declare type StepProps = {
    title: string;
    children: React.ReactElement;
    end?: boolean;
    actions?: StepActions;
};
