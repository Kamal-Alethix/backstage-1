/// <reference types="react" />
/** @public */
export declare type SidebarIntroClassKey = 'introCard' | 'introDismiss' | 'introDismissLink' | 'introDismissText' | 'introDismissIcon';
declare type IntroCardProps = {
    text: string;
    onClose: () => void;
};
/**
 * Closable card with information from Navigation Sidebar
 *
 * @public
 *
 */
export declare function IntroCard(props: IntroCardProps): JSX.Element;
export declare function SidebarIntro(_props: {}): JSX.Element | null;
export {};
