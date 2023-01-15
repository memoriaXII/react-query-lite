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

export class QueryClient {
  queries: any[];
  constructor() {
    this.queries = [];
  }
  //get a existing in the list, or create one and add to it (creating/getting)
  public getQuery = (options: any) => {
    const queryHash = JSON.stringify(options.queryKey);
    let query = this.queries.find((d: any) => d.queryHash === queryHash);
    //check if the query is already exists
    if (!query) {
      query = createQuery(this, options);
    }
    return query;
  };
}

export function useQuery({ queryKey, queryFn }: any) {
  const client = React.useContext(QueryContext);
  //force component to re render
  const [, rerender] = React.useReducer((i) => i + 1, 0);

  //observer logic
  const observerRef: any = React.useRef();
  if (!observerRef.current) {
    observerRef.current = createQueryObserver(client, {
      queryKey,
      queryFn
    });
  }
  console.log(observerRef.current, 'observerRef.current');
  React.useEffect(() => {
    return observerRef.current.subscribe(rerender);
  }, []);
  return observerRef.current.getResult();
}

export function ReactQueryDevTools() {
  return null;
}

export const createQuery = (client: any, { queryKey, queryFn }: any) => {
  console.log(client, 'client');
  let query: any = {
    queryKey,
    queryFn: JSON.stringify(queryFn),
    promise: null,
    subscribers: [],
    state: {
      status: 'loading',
      isFetching: false,
      data: undefined,
      error: undefined
    },
    subscribe: (subscriber: any) => {
      query.subscribers.push(subscriber);
      //unsubscribe
      return () => {
        query.subscribers = query.subscribers.filter((d: any) => d !== subscriber);
      };
    },
    setState: (updater: any) => {
      //more like a reducer
      query.state = updater(query.state);
      // whenever we call setState, we notify all subscribers
      query.subscribers.forEach((subscriber: any) => subscriber.notify());
    },
    fetch: async () => {
      if (!query.promise) {
        //immediately call this async function with IIFE
        query.promise = (async () => {
          query.setState((old: any) => ({
            ...old,
            isFetching: true,
            error: undefined
          }));
          try {
            const data = await queryFn();
            query.setState((old: any) => ({
              ...old,
              status: 'success',
              data
            }));
          } catch (error) {
            query.setState((old: any) => ({
              ...old,
              status: 'error',
              error
            }));
          } finally {
            query.promise = null;
            query.setState((old: any) => ({
              ...old,
              isFetching: false
            }));
          }
        })();
      }
      return query.promise;
    }
  };
  return query;
};

//coordinate all and observer make sure it only create query once
function createQueryObserver(
  client: any,
  {
    queryKey,
    queryFn
  }: {
    queryKey: any;
    queryFn: any;
  }
) {
  const query = client.getQuery({ queryKey, queryFn });
  const observer = {
    notify: () => {},
    getResult: () => query.state,
    subscribe: (callback: () => void) => {
      observer.notify = callback;
      const unsubscribe = query.subscribe(observer);
      query.fetch();
      return unsubscribe;
    }
  };
  return observer;
}
