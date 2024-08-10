import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

import { env } from "@/env";

export const createApolloClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      headers: {
        ["X-API-KEY"]: env.API_TOKEN,
      },
      uri: env.CORE_URL,
      fetchOptions: { cache: "no-store" },
      fetch: (uri, options) => {
        return fetch(uri, {
          ...options,
          headers: options?.headers || {},
        });
      },
    }),
  });
