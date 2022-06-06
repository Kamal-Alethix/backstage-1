import React, { PropsWithChildren } from 'react';
import { DefaultEntityFilters, EntityListContextProps } from '../hooks/useEntityListProvider';
/** @public */
export declare const MockEntityListContextProvider: ({ children, value, }: React.PropsWithChildren<{
    value?: Partial<EntityListContextProps<DefaultEntityFilters>> | undefined;
}>) => JSX.Element;
