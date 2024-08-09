export { Head }

import { defineComponent } from 'vue'

/**
 * Does nothing on client side.
 *
 * https://vike.dev/Head
 */

const Head = /* @__PURE__ */ defineComponent({
  name: 'Head',
  inheritAttrs: false,
  render() {},
})
