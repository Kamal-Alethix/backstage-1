import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export declare type Maybe<T> = T | null;
export declare type InputMaybe<T> = Maybe<T>;
export declare type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
export declare type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export declare type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export declare type RequireFields<T, K extends keyof T> = {
    [X in Exclude<keyof T, K>]?: T[X];
} & {
    [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    JSON: any;
    JSONObject: any;
};
export declare type CatalogEntity = {
    __typename?: 'CatalogEntity';
    apiVersion: Scalars['String'];
    kind: Scalars['String'];
    metadata?: Maybe<EntityMetadata>;
    spec: EntitySpec;
};
export declare type CatalogQuery = {
    __typename?: 'CatalogQuery';
    list: Array<CatalogEntity>;
};
export declare type ComponentEntitySpec = {
    __typename?: 'ComponentEntitySpec';
    lifecycle: Scalars['String'];
    owner: Scalars['String'];
    type: Scalars['String'];
};
export declare type ComponentMetadata = EntityMetadata & {
    __typename?: 'ComponentMetadata';
    annotation?: Maybe<Scalars['JSON']>;
    annotations: Scalars['JSONObject'];
    etag: Scalars['String'];
    label?: Maybe<Scalars['JSON']>;
    labels: Scalars['JSONObject'];
    name: Scalars['String'];
    relationships?: Maybe<Scalars['String']>;
    uid: Scalars['String'];
};
export declare type ComponentMetadataAnnotationArgs = {
    name: Scalars['String'];
};
export declare type ComponentMetadataLabelArgs = {
    name: Scalars['String'];
};
export declare type DefaultEntityMetadata = EntityMetadata & {
    __typename?: 'DefaultEntityMetadata';
    annotation?: Maybe<Scalars['JSON']>;
    annotations: Scalars['JSONObject'];
    etag: Scalars['String'];
    label?: Maybe<Scalars['JSON']>;
    labels: Scalars['JSONObject'];
    name: Scalars['String'];
    uid: Scalars['String'];
};
export declare type DefaultEntityMetadataAnnotationArgs = {
    name: Scalars['String'];
};
export declare type DefaultEntityMetadataLabelArgs = {
    name: Scalars['String'];
};
export declare type DefaultEntitySpec = {
    __typename?: 'DefaultEntitySpec';
    raw?: Maybe<Scalars['JSONObject']>;
};
export declare type EntityMetadata = {
    annotation?: Maybe<Scalars['JSON']>;
    annotations: Scalars['JSONObject'];
    etag: Scalars['String'];
    label?: Maybe<Scalars['JSON']>;
    labels: Scalars['JSONObject'];
    name: Scalars['String'];
    uid: Scalars['String'];
};
export declare type EntityMetadataAnnotationArgs = {
    name: Scalars['String'];
};
export declare type EntityMetadataLabelArgs = {
    name: Scalars['String'];
};
export declare type EntitySpec = ComponentEntitySpec | DefaultEntitySpec | TemplateEntitySpec;
export declare type Query = {
    __typename?: 'Query';
    catalog: CatalogQuery;
};
export declare type TemplateEntitySpec = {
    __typename?: 'TemplateEntitySpec';
    path?: Maybe<Scalars['String']>;
    schema: Scalars['JSONObject'];
    templater: Scalars['String'];
    type: Scalars['String'];
};
export declare type TemplateMetadata = EntityMetadata & {
    __typename?: 'TemplateMetadata';
    annotation?: Maybe<Scalars['JSON']>;
    annotations: Scalars['JSONObject'];
    etag: Scalars['String'];
    label?: Maybe<Scalars['JSON']>;
    labels: Scalars['JSONObject'];
    name: Scalars['String'];
    uid: Scalars['String'];
    updatedBy?: Maybe<Scalars['String']>;
};
export declare type TemplateMetadataAnnotationArgs = {
    name: Scalars['String'];
};
export declare type TemplateMetadataLabelArgs = {
    name: Scalars['String'];
};
export declare type WithIndex<TObject> = TObject & Record<string, any>;
export declare type ResolversObject<TObject> = WithIndex<TObject>;
export declare type ResolverTypeWrapper<T> = Promise<T> | T;
export declare type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export declare type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;
export declare type ResolverFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<TResult> | TResult;
export declare type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;
export declare type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<{
        [key in TKey]: TResult;
    }, TParent, TContext, TArgs>;
    resolve?: SubscriptionResolveFn<TResult, {
        [key in TKey]: TResult;
    }, TContext, TArgs>;
}
export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
    resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}
export declare type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> = SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs> | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;
export declare type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> = ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>) | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;
export declare type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (parent: TParent, context: TContext, info: GraphQLResolveInfo) => Maybe<TTypes> | Promise<Maybe<TTypes>>;
export declare type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;
export declare type NextResolverFn<T> = () => Promise<T>;
export declare type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (next: NextResolverFn<TResult>, parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
/** Mapping between all available schema types and the resolvers types */
export declare type ResolversTypes = ResolversObject<{
    Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>;
    CatalogEntity: ResolverTypeWrapper<Partial<Omit<CatalogEntity, 'spec'> & {
        spec: ResolversTypes['EntitySpec'];
    }>>;
    CatalogQuery: ResolverTypeWrapper<Partial<CatalogQuery>>;
    ComponentEntitySpec: ResolverTypeWrapper<Partial<ComponentEntitySpec>>;
    ComponentMetadata: ResolverTypeWrapper<Partial<ComponentMetadata>>;
    DefaultEntityMetadata: ResolverTypeWrapper<Partial<DefaultEntityMetadata>>;
    DefaultEntitySpec: ResolverTypeWrapper<Partial<DefaultEntitySpec>>;
    EntityMetadata: ResolversTypes['ComponentMetadata'] | ResolversTypes['DefaultEntityMetadata'] | ResolversTypes['TemplateMetadata'];
    EntitySpec: Partial<ResolversTypes['ComponentEntitySpec'] | ResolversTypes['DefaultEntitySpec'] | ResolversTypes['TemplateEntitySpec']>;
    Int: ResolverTypeWrapper<Partial<Scalars['Int']>>;
    JSON: ResolverTypeWrapper<Partial<Scalars['JSON']>>;
    JSONObject: ResolverTypeWrapper<Partial<Scalars['JSONObject']>>;
    Query: ResolverTypeWrapper<{}>;
    String: ResolverTypeWrapper<Partial<Scalars['String']>>;
    TemplateEntitySpec: ResolverTypeWrapper<Partial<TemplateEntitySpec>>;
    TemplateMetadata: ResolverTypeWrapper<Partial<TemplateMetadata>>;
}>;
/** Mapping between all available schema types and the resolvers parents */
export declare type ResolversParentTypes = ResolversObject<{
    Boolean: Partial<Scalars['Boolean']>;
    CatalogEntity: Partial<Omit<CatalogEntity, 'spec'> & {
        spec: ResolversParentTypes['EntitySpec'];
    }>;
    CatalogQuery: Partial<CatalogQuery>;
    ComponentEntitySpec: Partial<ComponentEntitySpec>;
    ComponentMetadata: Partial<ComponentMetadata>;
    DefaultEntityMetadata: Partial<DefaultEntityMetadata>;
    DefaultEntitySpec: Partial<DefaultEntitySpec>;
    EntityMetadata: ResolversParentTypes['ComponentMetadata'] | ResolversParentTypes['DefaultEntityMetadata'] | ResolversParentTypes['TemplateMetadata'];
    EntitySpec: Partial<ResolversParentTypes['ComponentEntitySpec'] | ResolversParentTypes['DefaultEntitySpec'] | ResolversParentTypes['TemplateEntitySpec']>;
    Int: Partial<Scalars['Int']>;
    JSON: Partial<Scalars['JSON']>;
    JSONObject: Partial<Scalars['JSONObject']>;
    Query: {};
    String: Partial<Scalars['String']>;
    TemplateEntitySpec: Partial<TemplateEntitySpec>;
    TemplateMetadata: Partial<TemplateMetadata>;
}>;
export declare type CatalogEntityResolvers<ContextType = any, ParentType = ResolversParentTypes['CatalogEntity']> = ResolversObject<{
    apiVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    kind?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    metadata?: Resolver<Maybe<ResolversTypes['EntityMetadata']>, ParentType, ContextType>;
    spec?: Resolver<ResolversTypes['EntitySpec'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type CatalogQueryResolvers<ContextType = any, ParentType = ResolversParentTypes['CatalogQuery']> = ResolversObject<{
    list?: Resolver<Array<ResolversTypes['CatalogEntity']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type ComponentEntitySpecResolvers<ContextType = any, ParentType = ResolversParentTypes['ComponentEntitySpec']> = ResolversObject<{
    lifecycle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    owner?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type ComponentMetadataResolvers<ContextType = any, ParentType = ResolversParentTypes['ComponentMetadata']> = ResolversObject<{
    annotation?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<ComponentMetadataAnnotationArgs, 'name'>>;
    annotations?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
    etag?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    label?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<ComponentMetadataLabelArgs, 'name'>>;
    labels?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
    name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    relationships?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    uid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type DefaultEntityMetadataResolvers<ContextType = any, ParentType = ResolversParentTypes['DefaultEntityMetadata']> = ResolversObject<{
    annotation?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<DefaultEntityMetadataAnnotationArgs, 'name'>>;
    annotations?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
    etag?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    label?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<DefaultEntityMetadataLabelArgs, 'name'>>;
    labels?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
    name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    uid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type DefaultEntitySpecResolvers<ContextType = any, ParentType = ResolversParentTypes['DefaultEntitySpec']> = ResolversObject<{
    raw?: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type EntityMetadataResolvers<ContextType = any, ParentType = ResolversParentTypes['EntityMetadata']> = ResolversObject<{
    __resolveType: TypeResolveFn<'ComponentMetadata' | 'DefaultEntityMetadata' | 'TemplateMetadata', ParentType, ContextType>;
    annotation?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<EntityMetadataAnnotationArgs, 'name'>>;
    annotations?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
    etag?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    label?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<EntityMetadataLabelArgs, 'name'>>;
    labels?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
    name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    uid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;
export declare type EntitySpecResolvers<ContextType = any, ParentType = ResolversParentTypes['EntitySpec']> = ResolversObject<{
    __resolveType: TypeResolveFn<'ComponentEntitySpec' | 'DefaultEntitySpec' | 'TemplateEntitySpec', ParentType, ContextType>;
}>;
export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
    name: 'JSON';
}
export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
    name: 'JSONObject';
}
export declare type QueryResolvers<ContextType = any, ParentType = ResolversParentTypes['Query']> = ResolversObject<{
    catalog?: Resolver<ResolversTypes['CatalogQuery'], ParentType, ContextType>;
}>;
export declare type TemplateEntitySpecResolvers<ContextType = any, ParentType = ResolversParentTypes['TemplateEntitySpec']> = ResolversObject<{
    path?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    schema?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
    templater?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type TemplateMetadataResolvers<ContextType = any, ParentType = ResolversParentTypes['TemplateMetadata']> = ResolversObject<{
    annotation?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<TemplateMetadataAnnotationArgs, 'name'>>;
    annotations?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
    etag?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    label?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<TemplateMetadataLabelArgs, 'name'>>;
    labels?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
    name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    uid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    updatedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export declare type Resolvers<ContextType = any> = ResolversObject<{
    CatalogEntity?: CatalogEntityResolvers<ContextType>;
    CatalogQuery?: CatalogQueryResolvers<ContextType>;
    ComponentEntitySpec?: ComponentEntitySpecResolvers<ContextType>;
    ComponentMetadata?: ComponentMetadataResolvers<ContextType>;
    DefaultEntityMetadata?: DefaultEntityMetadataResolvers<ContextType>;
    DefaultEntitySpec?: DefaultEntitySpecResolvers<ContextType>;
    EntityMetadata?: EntityMetadataResolvers<ContextType>;
    EntitySpec?: EntitySpecResolvers<ContextType>;
    JSON?: GraphQLScalarType;
    JSONObject?: GraphQLScalarType;
    Query?: QueryResolvers<ContextType>;
    TemplateEntitySpec?: TemplateEntitySpecResolvers<ContextType>;
    TemplateMetadata?: TemplateMetadataResolvers<ContextType>;
}>;
