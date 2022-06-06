/// <reference types="react" />
interface EditorIntroProps {
    style?: JSX.IntrinsicElements['div']['style'];
    onSelect?: (option: 'local' | 'form') => void;
}
export declare function TemplateEditorIntro(props: EditorIntroProps): JSX.Element;
export {};
