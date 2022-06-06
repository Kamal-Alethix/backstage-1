import { ReactNode } from 'react';
/** @public */
export declare type DismissableBannerClassKey = 'root' | 'topPosition' | 'icon' | 'content' | 'message' | 'info' | 'error';
/**
 * @public
 * @deprecated This type contained a typo, please use DismissableBannerClassKey instead
 */
export declare type DismissbleBannerClassKey = DismissableBannerClassKey;
export declare type Props = {
    variant: 'info' | 'error' | 'warning';
    message: ReactNode;
    id: string;
    fixed?: boolean;
};
/** @public */
export declare const DismissableBanner: (props: Props) => JSX.Element;
