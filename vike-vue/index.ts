import config from "./renderer/+config"
import { default as ClientOnly } from "./components/ClientOnly.vue"
import { useData } from "./components/useData"
import { usePageContext } from "./components/usePageContext"
import { onRenderHtml } from "./renderer/onRenderHtml"
import { onRenderClient } from "./renderer/onRenderClient"

export default config
export const components = {
  ClientOnly,
  useData,
  usePageContext
}
export const renderer = {
  onRenderClient,
  onRenderHtml,
}
