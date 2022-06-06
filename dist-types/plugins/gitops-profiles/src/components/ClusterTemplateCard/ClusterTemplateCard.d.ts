/// <reference types="react" />
interface Props {
    platformName: string;
    title: string;
    repository: string;
    description: string;
    index: number;
    onClick: (i: number, repo: string) => void;
    activeIndex: number;
}
declare const ClusterTemplateCard: (props: Props) => JSX.Element;
export default ClusterTemplateCard;
