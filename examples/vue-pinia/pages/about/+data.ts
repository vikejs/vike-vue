// Environment: server
export { data }

import { useConfig } from 'vike-vue/useConfig'

function data() {
  const config = useConfig()
  config({
    title: 'About via useConfig() - My Vike + Vue App',
  })
  return {}
}
