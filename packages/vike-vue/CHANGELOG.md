## [0.8.6](https://github.com/vikejs/vike-vue/compare/vike-vue@0.8.5...vike-vue@0.8.6) (2024-12-10)


### Bug Fixes

* improve JSDoc ([5b4be67](https://github.com/vikejs/vike-vue/commit/5b4be67761bbb568636c07fbee410be3ec5c0e2c))
* improve stream setting type ([2770f98](https://github.com/vikejs/vike-vue/commit/2770f98d4fb8df0b32d7569147eae8c07a0b7f5b))
* optimistic peer dependencies ([f1e8ba6](https://github.com/vikejs/vike-vue/commit/f1e8ba69d732d5786dbda8ce5a0d37562f75f998))
* simplify JSDocs for stream setting ([9ddce6b](https://github.com/vikejs/vike-vue/commit/9ddce6bd3897d44b9fd5104d718b470169226fa1))



## [0.8.5](https://github.com/vikejs/vike-vue/compare/vike-vue@0.8.4...vike-vue@0.8.5) (2024-09-12)


### Bug Fixes

* make pageContext.app available upon client-side navigation ([1c0b6fb](https://github.com/vikejs/vike-vue/commit/1c0b6fb74a92274afb779726056fefc4ed664447))
* more precise peer dependencies ([b3c77f0](https://github.com/vikejs/vike-vue/commit/b3c77f0eee7cec39f52b125e40d98a9dd7d8a7e4))
* simplify vike-vue-{query,pinia} integration ([08b612f](https://github.com/vikejs/vike-vue/commit/08b612f689545e54e42cfd7ed2639680c182f7fb))



## [0.8.4](https://github.com/vikejs/vike-vue/compare/vike-vue@0.8.3...vike-vue@0.8.4) (2024-09-10)


### Bug Fixes

* ensure pageContext.ssrContext is always defined ([1c0b011](https://github.com/vikejs/vike-vue/commit/1c0b0118b723216e516acc82e99fd46384f957e6))
* improve JSDocs ([d0ba07e](https://github.com/vikejs/vike-vue/commit/d0ba07eed5a6833fb61d65279460f5cbbaea6527))
* properly export config (fix [#194](https://github.com/vikejs/vike-vue/issues/194)) ([c01f129](https://github.com/vikejs/vike-vue/commit/c01f129a77a75222c39d123beba0f31c87625d28))
* return undefined instead of throw error upon missing pageContext (fix vikejs/vike-react[#147](https://github.com/vikejs/vike-vue/issues/147)) ([103f30b](https://github.com/vikejs/vike-vue/commit/103f30b57c97aba2e25a43c7db1b3547c5624a3e))



## [0.8.3](https://github.com/vikejs/vike-vue/compare/vike-vue@0.8.2...vike-vue@0.8.3) (2024-08-24)


### Bug Fixes

* add JSDocs ([3552702](https://github.com/vikejs/vike-vue/commit/35527026d90847cf4be86bcb18fa248b5d1490e1))
* call onBeforeRenderHtml() right before rendering ([#141](https://github.com/vikejs/vike-vue/issues/141)) ([ca7fdfd](https://github.com/vikejs/vike-vue/commit/ca7fdfd8acb4e78437dcf09b6eee608b5dc98ae5))
* make useConfig() work for vike-vue hooks ([#141](https://github.com/vikejs/vike-vue/issues/141)) ([47ac2d6](https://github.com/vikejs/vike-vue/commit/47ac2d68f77a0de043680760d92beb86afe86b4f))
* remove unused types export ([0728c10](https://github.com/vikejs/vike-vue/commit/0728c10f9df2599b6b9d5496f95e89e598b1ed24))
* use vike@0.4.191 ([efed97a](https://github.com/vikejs/vike-vue/commit/efed97a186b55c787322de07722f345ea40749c5))


### Features

* add pageContext.pageHtml{String,Stream} ([6c63604](https://github.com/vikejs/vike-vue/commit/6c636040479e8dbc60e3a7adfe4d57ae7c8c43fc))
* pageContext.isRenderingHead ([#183](https://github.com/vikejs/vike-vue/issues/183)) ([9ffa550](https://github.com/vikejs/vike-vue/commit/9ffa5504c7f82838b329be56619855b1c0f1831c))


### BREAKING CHANGES

* Update to `vike@0.4.191` or above.



## [0.8.2](https://github.com/vikejs/vike-vue/compare/vike-vue@0.8.1...vike-vue@0.8.2) (2024-08-17)


### Bug Fixes

* enable useConfig() after hydration ([#179](https://github.com/vikejs/vike-vue/issues/179)) ([ff02b23](https://github.com/vikejs/vike-vue/commit/ff02b23b6a4b03e8fe5e9716d6f7145cfe25c12f))
* fix `useConfig()` for `{body,html}Attributes` (fix [#180](https://github.com/vikejs/vike-vue/issues/180)) ([f25015b](https://github.com/vikejs/vike-vue/commit/f25015bb177dc81aa734af3d5081a9ea28c2873c))
* fix JSDoc ([7277d83](https://github.com/vikejs/vike-vue/commit/7277d83f22b467272b444f34747255bff10cc97f))
* fix pageContext._headAlreadySet (fix [#181](https://github.com/vikejs/vike-vue/issues/181)) ([aaa3ea9](https://github.com/vikejs/vike-vue/commit/aaa3ea90ff9e0ba6f87cb3428e2d967cb275223c))
* fix useConfig() upon client-side navigation (fix [#178](https://github.com/vikejs/vike-vue/issues/178)) ([67962ee](https://github.com/vikejs/vike-vue/commit/67962ee9f6b3e8bd91eaf16ee77bc8b61c093197))
* make useConfig() reactive (fix [#187](https://github.com/vikejs/vike-vue/issues/187)) ([#186](https://github.com/vikejs/vike-vue/issues/186)) ([846c4cd](https://github.com/vikejs/vike-vue/commit/846c4cd1723890dabc44d6372d2403c35a07a731))
* make useConfig() respect cumulativeness (fix [#182](https://github.com/vikejs/vike-vue/issues/182)) ([11aff82](https://github.com/vikejs/vike-vue/commit/11aff82a8effdbc018e7260faa791e0d1b9f65c5))
* support callable cumulative configs ([daf9514](https://github.com/vikejs/vike-vue/commit/daf9514d6749e7b8375c81888f967bd6a09f1884))
* update lang upon useConfig() ([ff901d8](https://github.com/vikejs/vike-vue/commit/ff901d887fc905081856474131a12f05d7735197))


### Features

* new [components `<Head>` and `<Config>`](https://vike.dev/useConfig#config-head) (closes [#175](https://github.com/vikejs/vike-vue/issues/175)) ([#174](https://github.com/vikejs/vike-vue/issues/174)) ([ca92f98](https://github.com/vikejs/vike-vue/commit/ca92f98be2bc51e55d1c6eefdd047159e0347aca))
* new [hook `onBeforeRenderHtml()`](https://vike.dev/onBeforeRenderHtml) (closes [#141](https://github.com/vikejs/vike-vue/issues/141)) ([4184bec](https://github.com/vikejs/vike-vue/commit/4184bec954d1a182cda52f8ffe43a1fe38b01d13))



## [0.8.1](https://github.com/vikejs/vike-vue/compare/vike-vue@0.8.0...vike-vue@0.8.1) (2024-08-12)


### Bug Fixes

* don't unnecessarily pass useConfig() values to client-side ([1dc1f48](https://github.com/vikejs/vike-vue/commit/1dc1f48dd36c36799b4618f8c0b193e4b41a66a7))


### Features

* support setting `{body,html}Attributes` based on `pageContext` ([3bdcd98](https://github.com/vikejs/vike-vue/commit/3bdcd9891b7b27dfcfe10f61f110681e46ff2193))



# [0.8.0](https://github.com/vikejs/vike-vue/compare/vike-vue@0.7.6...vike-vue@0.8.0) (2024-08-06)


### Bug Fixes

* avoid the default of title/lang setting to override Head setting ([24fe7c5](https://github.com/vikejs/vike-vue/commit/24fe7c52d38c2b0f1c274f8fa22c167cc26d6053))
* export Vike config only at /config ([39a4e71](https://github.com/vikejs/vike-vue/commit/39a4e711b3eced16391b3afdad316602c8167392))
* fix type Config['title'] ([de30e67](https://github.com/vikejs/vike-vue/commit/de30e67837b51adb277a65c54472de6a28e62fdd))
* improve JSDocs ([676c9ca](https://github.com/vikejs/vike-vue/commit/676c9ca9aeb38265053615a88cf1dc66cd0bd54a))
* make bodyHtml{Start,End} a global setting (fix [#146](https://github.com/vikejs/vike-vue/issues/146)) ([#147](https://github.com/vikejs/vike-vue/issues/147)) ([ae9792e](https://github.com/vikejs/vike-vue/commit/ae9792e14e79cfd6b8643dd956d5541174da6c85))
* make favicon setting global ([85d2656](https://github.com/vikejs/vike-vue/commit/85d2656253f01fd2f23653f8ef6d9378fb72eeca))
* make Head setting cumulative ([2afa2d7](https://github.com/vikejs/vike-vue/commit/2afa2d769a990a476ca0d36fb73feb1bc6865ef4))
* make title setting generate <meta property="og:title"> ([17a3325](https://github.com/vikejs/vike-vue/commit/17a33253a6afb58b51c145f70f71aa4981c9e19c))
* remove <ClientOnly> component ([4059091](https://github.com/vikejs/vike-vue/commit/405909162103fccf44e6026b62857355acaf3735))
* remove deprecated vuePlugins setting ([27041c8](https://github.com/vikejs/vike-vue/commit/27041c8009d12a8d65184a8bdfef6897a7f641d5))


### Features

* [useConfig()](https://vike.dev/useConfig) ([82bd56e](https://github.com/vikejs/vike-vue/commit/82bd56e153d5264859856c899eff296b9101aed1))
* new hook [`onAfterRenderClient`](https://vike.dev/onAfterRenderClient) ([3a59de3](https://github.com/vikejs/vike-vue/commit/3a59de3f6f5f2bef923bc6272bdb8536dbd0f431))
* new setting `viewport` ([6f30ccf](https://github.com/vikejs/vike-vue/commit/6f30ccf73e39662401cbf43c1fe25605bd17ff66))
* new settings [`description`](https://vike.dev/description) ([c9b9be0](https://github.com/vikejs/vike-vue/commit/c9b9be0ccd73d0e94328c84111f05227e279d0c9))
* new settings [`htmlAttributes`](https://vike.dev/htmlAttributes) and [`bodyAttributes`](https://vike.dev/bodyAttributes) ([#169](https://github.com/vikejs/vike-vue/issues/169)) ([efead0d](https://github.com/vikejs/vike-vue/commit/efead0d18748cca77403f239aadc331f3fb76f79))
* new settings [`image`](https://vike.dev/image) ([5bf8ae6](https://github.com/vikejs/vike-vue/commit/5bf8ae67e784b7cb4241fe33be5e8b54fc27e525))


### BREAKING CHANGES

* The `Head` setting is now cumulative https://vike.dev/Head#cumulative
* make sure you import types from vike/types (if you
don't already). For example:

```diff
- import type { OnCreateAppSync } from 'vike-vue'
+ import type { OnCreateAppSync } from 'vike-vue/types'
```
* component `<ClientOnly>` removed: use `clientOnly()` helper instead https://vike.dev/clientOnly
* +vuePlugins is removed: use +onCreateApp instead https://vike.dev/onCreateApp
* The responsive viewport tag is now injected by default (`<meta name="viewport" content="width=device-width,initial-scale=1">`). If you already inject `<meta name="viewport">` then remove it or set the `viewport` setting to `null`, see https://vike.dev/viewport.
* The setting `favicon` now only accepts one global
value, see https://vike.dev/favicon#global
* The [`title` setting](https://vike.dev/title) now also adds the `<meta property="og:title">` tag; if you generate it yourself then make sure to remove it.
* the [bodyHtml{Start,End} settings](https://vike.dev/bodyHtmlEnd) are now global:
you cannot use [config inheritance](https://vike.dev/config#inheritance) for them anymore,
and make sure to define them at a global location such as `pages/+config.js`.



## [0.7.6](https://github.com/vikejs/vike-vue/compare/vike-vue@0.7.5...vike-vue@0.7.6) (2024-06-25)


### Features

* Add streaming support for Web Stream ([e781aea](https://github.com/vikejs/vike-vue/commit/e781aeae9cb923eefdc003fc482052d301bf81e0))



## [0.7.5](https://github.com/vikejs/vike-vue/compare/vike-vue@0.7.4...vike-vue@0.7.5) (2024-06-17)


### Bug Fixes

* rename bodyHtmlStart => bodyHtmlBegin ([#133](https://github.com/vikejs/vike-vue/issues/133)) ([71aaeed](https://github.com/vikejs/vike-vue/commit/71aaeedbe6402eada02a84362e158363eaf86cb4))


### BREAKING CHANGES

* Setting `bodyHtmlStart` renamed to `bodyHtmlBegin`.



## [0.7.4](https://github.com/vikejs/vike-vue/compare/vike-vue@0.7.3...vike-vue@0.7.4) (2024-06-17)


### Features

* `clientOnly()` helper ([#110](https://github.com/vikejs/vike-vue/issues/110), [#132](https://github.com/vikejs/vike-vue/issues/132), fix [#82](https://github.com/vikejs/vike-vue/issues/82)) ([c6bb074](https://github.com/vikejs/vike-vue/commit/c6bb074885a1e59630ed007b354f107ce814c68e))



## [0.7.3](https://github.com/vikejs/vike-vue/compare/vike-vue@0.7.2...vike-vue@0.7.3) (2024-06-14)


### Bug Fixes

* optimistic peerDependencies ([83dc44b](https://github.com/vikejs/vike-vue/commit/83dc44b30226fdd6b9fb344da11beb2f71cc3e11))


### Features

* make Layout setting cumulative ([#129](https://github.com/vikejs/vike-vue/issues/129)) ([d9f584b](https://github.com/vikejs/vike-vue/commit/d9f584b489c9b6279cf41b1f47ae157e4e3541f2))


### BREAKING CHANGES

* The `Layout` setting cannot be overriden anymore because it's now cumulative, see:
   - https://vike.dev/Layout#multiple-layouts
   - https://vike.dev/Layout#nested-layouts



## [0.7.2](https://github.com/vikejs/vike-vue/compare/vike-vue@0.7.1...vike-vue@0.7.2) (2024-06-06)


### Bug Fixes

* cleanup old keys and use shallowReactive instead of reactive for dataReactive and pageContextReactive  ([#120](https://github.com/vikejs/vike-vue/issues/120), fix [#116](https://github.com/vikejs/vike-vue/issues/116), fix [#121](https://github.com/vikejs/vike-vue/issues/121)) ([421f927](https://github.com/vikejs/vike-vue/commit/421f927ed2f5caad6a86e4a031c2434cba473e3f))
* enforce peer dependencies ([802f02e](https://github.com/vikejs/vike-vue/commit/802f02e32c2aa3e92f5816d121c4b28a243aede2))


### BREAKING CHANGES

* data from `+data` hook must be a non-array object (if you need to return a list wrap it in an object)
* both `useData` and `usePageContext` return `shallowReactive` instead of `reactive`

Co-authored-by: Romuald Brillout <git@brillout.com>



## [0.7.1](https://github.com/vikejs/vike-vue/compare/vike-vue@0.7.0...vike-vue@0.7.1) (2024-06-04)


### Features

* support teleports, add bodyHtml{Start,End} hooks ([#88](https://github.com/vikejs/vike-vue/issues/88), fix [#87](https://github.com/vikejs/vike-vue/issues/87))) ([71d33a4](https://github.com/vikejs/vike-vue/commit/71d33a4a3cb69f813c33e984c28b03d17e8af6c5))



# [0.7.0](https://github.com/vikejs/vike-vue/compare/vike-vue@0.6.8...vike-vue@0.7.0) (2024-06-04)


### Bug Fixes

* Improve Hooks ([#96](https://github.com/vikejs/vike-vue/issues/96)) ([32f06aa](https://github.com/vikejs/vike-vue/commit/32f06aa1d2ca72e0c935c05bee814f031f41554a))


### BREAKING CHANGES

* All vike-vue packages need to be updated simultaneously.
rename `onBeforeMountApp` to `onBeforeRenderClient` and `onAfterRenderSSRApp` to `onAfterRenderHtml`



## [0.6.8](https://github.com/vikejs/vike-vue/compare/vike-vue@0.6.7...vike-vue@0.6.8) (2024-06-02)


### Bug Fixes

* hard require vike@0.4.172 or above ([ee6157a](https://github.com/vikejs/vike-vue/commit/ee6157a9210ef3e867857050caac010756d9cca7))


### BREAKING CHANGES

* update to `vike@0.4.172` or above



## [0.6.7](https://github.com/vikejs/vike-vue/compare/vike-vue@0.6.6...vike-vue@0.6.7) (2024-06-02)


### Bug Fixes

* remove counterproductive assert() (vikejs/vike-react[#115](https://github.com/vikejs/vike-vue/issues/115)) ([daccd7e](https://github.com/vikejs/vike-vue/commit/daccd7e191a7d705380066eac5763a72d4c6e690))
* simpler and more robust `useData()` implementation ([a29d481](https://github.com/vikejs/vike-vue/commit/a29d481dd81a8095ccb0dd5432e31a1844e35037))


### BREAKING CHANGES

* Return value of `data()` should be an object, `undefined`, or `null`.



## [0.6.6](https://github.com/vikejs/vike-vue/compare/vike-vue@0.6.5...vike-vue@0.6.6) (2024-05-17)


### Bug Fixes

* rename root ID `#vue-root` => `#app` ([3f30f69](https://github.com/vikejs/vike-vue/commit/3f30f6922daa91f14dd457dbbd7f8ab70953ff67))



## [0.6.5](https://github.com/vikejs/vike-vue/compare/vike-vue@0.6.4...vike-vue@0.6.5) (2024-04-21)

### Features

* add `vike-vue-query`[#83](https://github.com/vikejs/vike-vue/pull/83)


## [0.6.4](https://github.com/vikejs/vike-vue/compare/vike-vue@0.6.3...vike-vue@0.6.4) (2024-04-17)


### Bug Fixes

* add type export for NodeNext module resolution ([4a12e4c](https://github.com/vikejs/vike-vue/commit/4a12e4c517b9a34225d1d95aeb9c944fca557d36))
* fix ClientOnly d.ts export ([8e57590](https://github.com/vikejs/vike-vue/commit/8e575902ecad01e63e14df2e5917898a334b91ff))
* improve JSDoc ([71c985f](https://github.com/vikejs/vike-vue/commit/71c985f1f52f96df7c657ec16f4cbb8c5363c46a))
* make <Head> reactive ([240fb58](https://github.com/vikejs/vike-vue/commit/240fb58cf5a22722ecfad11ffc22f43fdb59e38e))
* narrow ref from pageContext.config to pageContext.config.Layout ([b3dc940](https://github.com/vikejs/vike-vue/commit/b3dc9408f191f0d05167d697099c76acd250ccf3))


### Features

* rewrite root comp to use composition api ([4ba8e19](https://github.com/vikejs/vike-vue/commit/4ba8e19bbf519c8b1d746b49a44f201f2cee8af8))



## [0.6.3](https://github.com/vikejs/vike-vue/compare/vike-vue@0.6.2...vike-vue@0.6.3) (2024-02-20)


### Bug Fixes

* respect Vue's inject rule (fix [#79](https://github.com/vikejs/vike-vue/issues/79)) ([a5f189a](https://github.com/vikejs/vike-vue/commit/a5f189a984ff72422b818e468601ff990463c210))



## [0.6.2](https://github.com/vikejs/vike-vue/compare/vike-vue@0.6.1...vike-vue@0.6.2) (2024-02-14)


### Bug Fixes

* fix broken `import type` in `ClientOnly` ([bae3e79](https://github.com/vikejs/vike-vue/commit/bae3e79f46d9018de04d7f8edf0ad7b0af2f1fc0))
* set Vike extension name ([61ff29b](https://github.com/vikejs/vike-vue/commit/61ff29be2d3209a11324b2755f3857ece6aec9d1))



## [0.6.1](https://github.com/vikejs/vike-vue/compare/vike-vue@0.6.0...vike-vue@0.6.1) (2024-01-28)


### Bug Fixes

* export config at `/config` instead of `/` ([82a535f](https://github.com/vikejs/vike-vue/commit/82a535fa848df7d7d99df0bab60a647309666aa9))


### BREAKING CHANGES

* Update Vike to `0.4.160` or above.
* Replace `import vikeVue from 'vike-vue'`
with `import vikeVue from 'vike-vue/config'`. (Typically
in your `/pages/+config.js`.)
* Replace
`import type { OnCreateAppSync } from 'vike-vue'` (or
another available hook type) with
`import type { OnCreateAppSync } from 'vike-vue/types'`



# [0.6.0](https://github.com/vikejs/vike-vue/compare/vike-vue@0.5.4...vike-vue@0.6.0) (2024-01-22)


### Bug Fixes

* simplify `<head>` management ([39aa1a9](https://github.com/vikejs/vike-vue/commit/39aa1a9c66d49fb0d0fcc529ebb5f7cc679f2e28))


### BREAKING CHANGES

* Fetching data using `pageContext.pageProps` is
deprecated, use `data()` and `useData()` instead,
see https://vike.dev/data-fetching
* Setting the page's title using `pageContext.title`
is deprecated (`pageContext.description` and `pageContext.lang` are
also deprecated), use the settings `title` and `Head` instead,
see https://vike.dev/head



## [0.5.4](https://github.com/vikejs/vike-vue/compare/v0.5.3...vike-vue@0.5.4) (2024-01-15)


### Bug Fixes

* improve error message ([233070a](https://github.com/vikejs/vike-vue/commit/233070a37d37e970ec6ef85d5386003717566550))
* properly handle render error upon client-side navigation ([e784c36](https://github.com/vikejs/vike-vue/commit/e784c36b76d29792a8eb00ab900dc95d8fe4728e))
* Update `lang` on client-side navigation ([#58](https://github.com/vikejs/vike-vue/pull/58))


### Features

* `onCreateApp()` hook for registering Vue plugins ([#63](https://github.com/vikejs/vike-vue/pull/63))
* `onAfterRenderSSR()` and `onBeforeMountApp()` hooks for integrating stores and data-fetching tools ([#65](https://github.com/vikejs/vike-vue/pull/65))
* [`<ClientOnly>`](https://vike.dev/ClientOnly) component



## [0.5.3](https://github.com/vikejs/vike-vue/compare/v0.5.2...v0.5.3) (2023-12-28)

### Features

* useData() ([7409c4e](https://github.com/vikejs/vike-vue/commit/7409c4ead9f185c5c95bb871375683a7d4fe1a45))



## [0.5.2](https://github.com/vikejs/vike-vue/compare/v0.5.1...v0.5.2) (2023-12-25)


### Bug Fixes

* further ensure Vue doesn't swallow errors ([1a0acc0](https://github.com/vikejs/vike-vue/commit/1a0acc03de36e32ee137c480e9e761726001ddaf))



## [0.5.1](https://github.com/vikejs/vike-vue/compare/v0.5.0...v0.5.1) (2023-12-07)

### Features

* add `stream` setting ([#30](https://github.com/vikejs/vike-vue/pull/30))



# [0.5.0](https://github.com/vikejs/vike-vue/compare/v0.4.0...v0.5.0) (2023-11-17)

### Bug Fixes

- possibly unset document title on client routing ([984cb76](https://github.com/vikejs/vike-vue/commit/984cb760cf6f36984de5e3f1174005f21cf9e697)), similar to [vikejs/vike-react#27](https://github.com/vikejs/vike-react/issues/27)
- use latest version of the Vike V1 design ([70f02b7](https://github.com/vikejs/vike-vue/commit/70f02b72c9f2f30030d703ed9f70229ebe36fd5f))

### Features

- add link to repo to SSR shell ([d63c9d3](https://github.com/vikejs/vike-vue/commit/d63c9d3e3b0dce8318a8a8c14bb62115d4949318)), similar to [vikejs/vike-react#32](https://github.com/vikejs/vike-react/issues/32) and [vikejs/vike-solid#32](https://github.com/vikejs/vike-solid/issues/32)
- TypeScript support for hooks, see e.g. https://vike.dev/onBeforeRender#typescript

# [0.4.0](https://github.com/vikejs/vike-vue/compare/v0.3.0...v0.4.0) (2023-09-24)

### BREAKING CHANGES

- The dependency `vite-plugin-ssr` has been renamed to `vike` ([79d5da9](https://github.com/vikejs/vike-vue/commit/79d5da9b535f082e3c58d4d5b37aa8d45fda9002))

# [0.3.0](https://github.com/vikejs/vike-vue/compare/v0.2.5...v0.3.0) (2023-09-22)

### Features

- Add vuePlugins config option // [#16](https://github.com/vikejs/vike-vue/issues/16) ([4a1dddd](https://github.com/vikejs/vike-vue/commit/4a1ddddcd1f33bd2755b6ccb91ad7f1d6d0942c6))

## [0.2.5](https://github.com/vikejs/vike-vue/compare/v0.2.4...v0.2.5) (2023-09-18)

- Minor README improvements.

## [0.2.4](https://github.com/vikejs/vike-vue/compare/v0.2.3...v0.2.4) (2023-09-18)

- Minor README improvements.

## [0.2.3](https://github.com/vikejs/vike-vue/compare/v0.2.2...v0.2.3) (2023-09-08)

### Bug Fixes

- Fix `__name is not defined` ([11417ca](https://github.com/vikejs/vike-vue/commit/11417cac897d4405af393ff5312ae746e5ce1662))

## [0.2.2](https://github.com/vikejs/vike-vue/compare/v0.2.1...v0.2.2) (2023-09-05)

### Bug Fixes

- Fix 'Error: Cannot find module' ([6b35d81](https://github.com/vikejs/vike-vue/commit/6b35d8138aa943a717d621de68f66bdc97cfc73d))

## [0.2.1](https://github.com/vikejs/vike-vue/compare/v0.2.0...v0.2.1) (2023-08-29)

- Fix peer dependency on `vite-plugin-ssr`.

## [0.2.0](https://github.com/vikejs/vike-vue/compare/v0.1.1...v0.2.0) (2023-08-28)

### Bug Fixes

- Actually support `config.meta.ssr = false` ([3ee182a](https://github.com/vikejs/vike-vue/commit/3ee182a814df2c8d8d5144ef1b9bbd79b18a4a5e))

### Features

- Add `Head` config option ([75cd700](https://github.com/vikejs/vike-vue/commit/75cd70081e530392c93be07944fb063c42092a9f))

## [0.1.1](https://github.com/vikejs/vike-vue/compare/v0.1.0...v0.1.1) (2023-08-20)

- Add README content to [npm package](https://www.npmjs.com/package/vike-vue)

## 0.1.0 (2023-08-20)

- Initial version
