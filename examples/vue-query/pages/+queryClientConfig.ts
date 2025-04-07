export { queryClientConfig }

import type { QueryClientConfig } from '@tanstack/vue-query'

// Query client options - e.g.
const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Don't refetch when window loses or gains focus during development
      refetchOnWindowFocus: import.meta.env.PROD,
      // staleTime: 1000 * 60 * 5,
    },
  },
}
