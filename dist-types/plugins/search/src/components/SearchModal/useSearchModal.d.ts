import { ReactNode } from 'react';
/**
 * The state of the search modal, as well as functions for changing the modal's
 * visibility.
 *
 * @public
 */
export declare type SearchModalValue = {
    state: {
        hidden: boolean;
        open: boolean;
    };
    toggleModal: () => void;
    setOpen: (open: boolean) => void;
};
/**
 * Props for the SearchModalProvider.
 * @public
 */
export declare type SearchModalProviderProps = {
    /**
     * Children which should have access to the SearchModal context and the
     * associated useSearchModal() hook.
     */
    children: ReactNode;
    /**
     * Pass true if the modal should be rendered initially.
     */
    showInitially?: boolean;
};
/**
 * A context provider responsible for storing and managing state related to the
 * search modal.
 *
 * @remarks
 * If you need to control visibility of the search toggle outside of the modal
 * itself, you can optionally place this higher up in the react tree where your
 * custom code and the search modal share the same context.
 *
 * @example
 * ```tsx
 * import {
 *   SearchModalProvider,
 *   SidebarSearchModal,
 * } from '@backstage/plugin-search';
 *
 * // ...
 *
 * <SearchModalProvider>
 *   <KeyboardShortcutSearchToggler />
 *   <SidebarSearchModal>
 *     {({ toggleModal }) => <SearchModal toggleModal={toggleModal} />}
 *   </SidebarSearchModal>
 * </SearchModalProvider>
 * ```
 *
 * @public
 */
export declare const SearchModalProvider: ({ children, showInitially, }: SearchModalProviderProps) => JSX.Element;
/**
 * Use this hook to manage the state of {@link SearchModal}
 * and change its visibility.
 *
 * @public
 *
 * @param initialState - pass `true` to make the modal initially visible
 * @returns an object containing the state of the modal together with
 * functions for changing the visibility of the modal.
 */
export declare function useSearchModal(initialState?: boolean): SearchModalValue;
