import type { Plugin } from 'vue'

// TODO: use a real plugin instead of this dummy plugin for this example
const myPlugin: Plugin = {
  install(app, options) {
    console.log('myPlugin.install():', options)
  }
}

// List of Vue plugins to install.
export default [
  {
    plugin: myPlugin,
    options: { foo: 'bar' }
  }
]
