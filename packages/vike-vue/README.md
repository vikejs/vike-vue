<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[<img src="https://vike.dev/vike-readme.svg" align="right" height="90">](https://vike.dev)
[![npm version](https://img.shields.io/npm/v/vike-vue)](https://www.npmjs.com/package/vike-vue)

# `vike-vue`

Vue integration for Vike, see [vike.dev/vue](https://vike.dev/vue).

- [Documentation](https://vike.dev/vike-vue)
- [Examples](https://github.com/vikejs/vike-vue/tree/main/examples)
- [Changelog](https://github.com/vikejs/vike-vue/blob/main/packages/vike-vue/CHANGELOG.md)

## Introduction

[UI framework Vike extensions](https://vike.dev/extensions) like `vike-vue`:
* implement Vike Core [hooks](https://vike.dev/hooks) (e.g. [`onRenderHtml()`](https://vike.dev/onRenderHtml)) on your
  behalf,
* set Vike Core [settings](https://vike.dev/settings) on your behalf,
* introduce new hooks for you to implement if needed,
* introduce new settings for you to set if needed,
* introduce new components and component hooks.

## Scaffold new app

Use [Bati](https://batijs.github.io/) to scaffold a Vike app using `vike-vue`.

## Add to existing app

To add `vike-vue` to an existing Vike app:

1. Install the `vike-vue` npm package in your project:

```bash
npm install vike-vue
```

2. Extend your existing Vike config files with `vike-vue`:

```diff
 // /pages/+config.js

+import vikeVue from 'vike-vue/config'
+
 export default {
   // Existing Vike Core settings
   // ...
+
+  // New setting introduced by vike-vue:
+  title: 'My Vike + Vue App',
+
+  extends: vikeVue
 }
```

## Hooks

`vike-vue` implements the [`onRenderHtml()`](https://vike.dev/onRenderHtml) and
[`onRenderClient()`](https://vike.dev/onRenderClient) hooks on your behalf, which are essentially the glue code between
Vike and Vue.
All hooks are [cumulative](https://vike.dev/meta#api), so you can add your own hooks without overriding the default ones.

`vike-vue` introduces the following new hooks:

* [`onCreateApp()`](https://vike.dev/onCreateApp): Allows you to extend the Vue app, typically for registering a Vue
  plugin.
* `onAfterRenderHtml()`: Called right after rendering the app on the server. Usually used for dehydration of state management libraries.
* `onBeforeRenderClient()`: Called before mounting the app on the client. Usually used for hydration of state management libraries.
* `bodyHtmlStart()`: Called on the server and client. Allows you to add content at the start of the `<body>` tag.
* `bodyHtmlEnd()`: Called on the server and client. Defaults to `<div id="teleported"></div>`. Allows you to add content at the end of the `<body>` tag.

## Settings

`vike-vue` sets the following Vike Core settings on your behalf:

* [`clientRouting=true`](https://vike.dev/clientRouting): Enable [Client Routing](https://vike.dev/client-routing).
* [`hydrationCanBeAborted=true`](https://vike.dev/hydrationCanBeAborted): Vue allows the
  [hydration](https://vike.dev/hydration) to be aborted.

`vike-vue` introduces the following new settings:

* [`Head`](https://vike.dev/head): **Component** Component to be rendered inside the `<head>` tag.
* [`title`](https://vike.dev/head): **string** `<title>...</title>` tag.
* [`favicon`](https://vike.dev/head): **string** `<link rel="icon" href="..." />` attribute.
* [`lang`](https://vike.dev/lang): **string** `<html lang="...">` attribute.
* [`ssr`](https://vike.dev/ssr): **boolean** Enable/disable Server-Side Rendering
  ([SSR](https://vike.dev/render-modes)).
* [`stream`](https://vike.dev/stream): **boolean** Enable/disable [HTML streaming](https://vike.dev/streaming).
* [`Layout`](https://vike.dev/Layout): **Component** Wrapper for your [Page component](https://vike.dev/Page).

## Component hooks

`vike-vue` introduces the following new component hooks:

* [`useData()`](https://vike.dev/useData): Access the data that is returned by a [`data()` hook](https://vike.dev/data)
  from any component.
* [`usePageContext()`](https://vike.dev/usePageContext): Access the [`pageContext` object](https://vike.dev/pageContext)
  from any component.

## Helpers

`vike-vue` introduces the following new helpers:

* [`clientOnly()`](https://vike.dev/clientOnly): load and render a component only on the client-side.

## Teleports

Teleports work out of the box with `vike-vue` when using `<Teleport to="teleported">` as we inject an empty div with `id="teleported"` by default. You can add more targets by using a custom `bodyHtmlEnd()` hook.
