/// <reference types="react" />
interface Props {
    shortName: string;
    title: string;
    repository: string;
    description: string;
    index: number;
    onClick: (i: number, repository: string) => void;
    selections: Set<number>;
}
declare const ProfileCard: (props: Props) => JSX.Element;
export default ProfileCard;
