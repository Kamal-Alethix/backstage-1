/// <reference types="react" />
interface Props {
    template: {
        platformName: string;
        title: string;
        repository: string;
        description: string;
    }[];
}
declare const ClusterTemplateCardList: (props: Props) => JSX.Element;
export default ClusterTemplateCardList;
