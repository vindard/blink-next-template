import { env } from "@/env";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const createApolloClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: env.NEXT_PUBLIC_BLINK_HTTP_ENDPOINT,
      fetchOptions: { cache: "default" },
      fetch: (uri, options) => {
        return fetch(uri, {
          ...options,
          headers: options?.headers || {},
        });
      },
    }),
  });
