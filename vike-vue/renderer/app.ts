import { createSSRApp, h, Fragment } from 'vue'
import type { PageContext } from './types'

export { createApp }

function createApp(pageContext: PageContext) {
  const { Page, pageProps } = pageContext

  const PageWithLayout = !pageContext.config.Layout
    ? Page
    : {
        render() {
          return h(
            pageContext.config.Layout as any,
            {},
            {
              default: () => {
                return h(Page, pageProps || {})
              }
            }
          )
        }
      }

  const app = createSSRApp(PageWithLayout)

  return app
}
