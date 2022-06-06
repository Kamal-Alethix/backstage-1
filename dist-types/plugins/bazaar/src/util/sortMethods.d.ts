import { BazaarProject, Member } from '../types';
export declare const sortMembers: (m1: Member, m2: Member) => number;
export declare const sortByDate: (a: BazaarProject, b: BazaarProject) => number;
export declare const sortByName: (a: BazaarProject, b: BazaarProject) => 1 | 0 | -1;
export declare const sortByMembers: (a: BazaarProject, b: BazaarProject) => number;
