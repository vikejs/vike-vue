import type { OnCreateAppSync } from "vike-vue"

// callback that is invoked right after creating the app - useful for registering plugins, etc.
const onCreateApp: OnCreateAppSync = ({ app }): ReturnType<OnCreateAppSync> => {
  console.log(`Vue version: ${app.version}`)
}

export default onCreateApp
