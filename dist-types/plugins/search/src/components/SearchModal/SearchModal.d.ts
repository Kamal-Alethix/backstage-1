/// <reference types="react" />
/**
 * @public
 **/
export interface SearchModalChildrenProps {
    /**
     * A function that should be invoked when navigating away from the modal.
     */
    toggleModal: () => void;
}
export interface SearchModalProps {
    /**
     * If true, it renders the modal.
     */
    open?: boolean;
    /**
     * This is supposed to be used together with the open prop.
     * If `hidden` is true, it hides the modal.
     * If `open` is false, the value of `hidden` has no effect on the modal.
     * Use `open` for controlling whether the modal should be rendered or not.
     */
    hidden?: boolean;
    /**
     * a function invoked when a search item is pressed or when the dialog
     * should be closed.
     */
    toggleModal: () => void;
    /**
     * A function that returns custom content to render in the search modal in
     * place of the default.
     */
    children?: (props: SearchModalChildrenProps) => JSX.Element;
}
export declare const Modal: ({ toggleModal }: SearchModalProps) => JSX.Element;
export declare const SearchModal: ({ open, hidden, toggleModal, children, }: SearchModalProps) => JSX.Element;
