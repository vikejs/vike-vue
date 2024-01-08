import type { OnCreateAppSync } from "vike-vue"

// callback that is invoked right after creating the app - useful for registering plugins, etc.
const onCreateApp: OnCreateAppSync = (app, pageContext): ReturnType<OnCreateAppSync> => {
  console.log('onCreateApp')
}

export default onCreateApp
