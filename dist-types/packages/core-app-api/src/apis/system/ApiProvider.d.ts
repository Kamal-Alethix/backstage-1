import { ReactNode, PropsWithChildren } from 'react';
import PropTypes from 'prop-types';
import { ApiHolder } from '@backstage/core-plugin-api';
/**
 * Prop types for the ApiProvider component.
 * @public
 */
export declare type ApiProviderProps = {
    apis: ApiHolder;
    children: ReactNode;
};
/**
 * Provides an {@link @backstage/core-plugin-api#ApiHolder} for consumption in
 * the React tree.
 *
 * @public
 */
export declare const ApiProvider: {
    (props: PropsWithChildren<ApiProviderProps>): JSX.Element;
    propTypes: {
        apis: PropTypes.Validator<PropTypes.InferProps<{
            get: PropTypes.Validator<(...args: any[]) => any>;
        }>>;
        children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
    };
};
