export { queryClientConfig }

import type { QueryClientConfig } from '@tanstack/vue-query'

// set query client options - e.g. not refetching when window loses or gains focus during development
const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: import.meta.env.PROD,
      // staleTime: 1000 * 60 * 5,
    },
  },
}
