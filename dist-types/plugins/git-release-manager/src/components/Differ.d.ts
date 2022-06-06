import { ReactNode } from 'react';
interface DifferProps {
    icon: 'tag' | 'branch' | 'github' | 'slack' | 'versioning';
    current?: string;
    next?: string | ReactNode;
}
export declare const Differ: ({ current, next, icon }: DifferProps) => JSX.Element;
export {};
