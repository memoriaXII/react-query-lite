import React, { FC, ReactNode } from 'react';

import { IQueryContext } from '../types/query.type';

export const QueryContext = React.createContext<Partial<IQueryContext>>({});

interface Props {
  // any props that come into the component
  children?: ReactNode;
  client: any;
}

export const QueryClientProvider: FC<Props> = ({ children, client }) => {
  return <QueryContext.Provider value={client}>{children}</QueryContext.Provider>;
};

export class QueryClient {}

export function useQuery() {
  return {
    status: 'loading',
    isFetching: true,
    data: undefined,
    error: undefined
  };
}

export function ReactQueryDevTools() {
  return null;
}
