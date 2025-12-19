export { vikeVueClientOnly }

import type { Plugin } from 'vite'
import { transformCode, type TransformOptions } from './babelTransformer.js'

const skipNodeModules = 'node_modules'

const filterFunction = (id: string) => {
  if (id.includes(skipNodeModules)) return false
  return true
}

/* TODO/ai: modify defaultOptions and transformCode in order to remove `default` from `ssrRenderComponent($setup["ClientOnly"], null, { default })`

import { defineComponent as _defineComponent } from "vue";
import { ClientOnly } from "vike-vue/ClientOnly";
import ClientOnlyComponent from "./ClientOnlyComponent.vue";
const _sfc_main = _defineComponent({
  __name: "+Page",
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = { get ClientOnly() {
      return ClientOnly;
    }, ClientOnlyComponent };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
import { withCtx as _withCtx, createVNode as _createVNode } from "vue";
import { ssrRenderComponent as _ssrRenderComponent } from "vue/server-renderer";
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<!--[--><h1 data-v-c63e5769>ClientOnly</h1><h2 data-v-c63e5769>Using <code data-v-c63e5769>&lt;ClientOnly&gt;</code> component</h2><h3 data-v-c63e5769>Basic example with fallback</h3>`);
  _push(_ssrRenderComponent($setup["ClientOnly"], null, {
    fallback: _withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<p data-v-c63e5769${_scopeId}>Loading client-only component...</p>`);
      } else {
        return [
          _createVNode("p", null, "Loading client-only component...")
        ];
      }
    }),
    default: _withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<p data-v-c63e5769${_scopeId}>Some text before</p>`);
        _push2(_ssrRenderComponent($setup["ClientOnlyComponent"], { msg: "hello" }, null, _parent2, _scopeId));
        _push2(`<p data-v-c63e5769${_scopeId}>Some text after</p>`);
      } else {
        return [
          _createVNode("p", null, "Some text before"),
          _createVNode($setup["ClientOnlyComponent"], { msg: "hello" }),
          _createVNode("p", null, "Some text after")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<h3 data-v-c63e5769>Without fallback</h3>`);
  _push(_ssrRenderComponent($setup["ClientOnly"], null, {
    default: _withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(_ssrRenderComponent($setup["ClientOnlyComponent"], { msg: "bonjour" }, null, _parent2, _scopeId));
      } else {
        return [
          _createVNode($setup["ClientOnlyComponent"], { msg: "bonjour" })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<!--]-->`);
}

*/

// Default rules for vike-vue
const defaultOptions: TransformOptions = {
  rules: [
    // h() and related functions: slots are in third argument
    {
      env: 'server',
      call: {
        match: {
          // function: ['import:vue:h', 'import:vue:createVNode'],
          function: ['import:vue/server-renderer:ssrRenderComponent'],
          args: {
            0: {
              call: 'import:vue:unref',
              args: {
                0: 'import:vike-vue/ClientOnly:ClientOnly',
              },
            },
          },
        },
        remove: { arg: 2, prop: 'default' },
      },
    },
    {
      env: 'server',
      call: {
        match: {
          function: 'import:vike-vue/useHydrated:useHydrated',
        },
        replace: { with: false },
      },
    },
  ],
}

/**
 * Vite plugin that transforms Vue components on server-side:
 * - Strips specified slots (e.g., default) from components
 * - Removes unreferenced imports that result from the stripping
 */
function vikeVueClientOnly() {
  const plugins: Plugin[] = [
    {
      name: 'vike-vue:client-only',
      enforce: 'post',
      transform: {
        // order: 'pre',
        async handler(code, id, options) {
          // Only transform for SSR (server-side)
          if (!options?.ssr) return null
          if (!filterFunction(id)) return null
          const env = 'ssr'
          if (code.includes('ClientOnly')) {
            console.log('id', id)
            console.log('code', code)
          }
          return await transformCode({ code, id, env, options: defaultOptions })
        },
      },
    },
  ]

  return plugins
}
