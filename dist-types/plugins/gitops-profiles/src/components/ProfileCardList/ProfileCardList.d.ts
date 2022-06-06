/// <reference types="react" />
interface Props {
    profileTemplates: {
        shortName: string;
        title: string;
        repository: string;
        description: string;
    }[];
}
declare const ProfileCardList: (props: Props) => JSX.Element;
export default ProfileCardList;
