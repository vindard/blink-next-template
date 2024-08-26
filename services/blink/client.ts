import { env } from "@/env";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const createApolloClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      headers: {
        ["X-API-KEY"]: env.API_TOKEN,
      },
      uri: env.CORE_URL,
      fetchOptions: { cache: "default" },
      fetch: (uri, options) => {
        return fetch(uri, {
          ...options,
          headers: options?.headers || {},
        });
      },
    }),
  });
