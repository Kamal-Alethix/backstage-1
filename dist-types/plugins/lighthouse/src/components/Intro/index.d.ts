/// <reference types="react" />
export declare const LIGHTHOUSE_INTRO_LOCAL_STORAGE = "@backstage/lighthouse-plugin/intro-dismissed";
export interface Props {
    onDismiss?: () => void;
}
export default function LighthouseIntro({ onDismiss }: Props): JSX.Element | null;
