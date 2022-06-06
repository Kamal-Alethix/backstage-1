/// <reference types="react" />
import 'graphiql/graphiql.css';
import { GraphQLEndpoint } from '../../lib/api';
declare type GraphiQLBrowserProps = {
    endpoints: GraphQLEndpoint[];
};
export declare const GraphiQLBrowser: (props: GraphiQLBrowserProps) => JSX.Element;
export {};
