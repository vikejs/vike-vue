## [0.1.2](https://github.com/vikejs/vike-vue/compare/vike-vue-pinia@0.1.1...vike-vue-pinia@0.1.2) (2024-09-12)


### Bug Fixes

* enforce peer dependencies ([802f02e](https://github.com/vikejs/vike-vue/commit/802f02e32c2aa3e92f5816d121c4b28a243aede2))
* make bodyHtml{Start,End} a global setting (fix [#146](https://github.com/vikejs/vike-vue/issues/146)) ([#147](https://github.com/vikejs/vike-vue/issues/147)) ([ae9792e](https://github.com/vikejs/vike-vue/commit/ae9792e14e79cfd6b8643dd956d5541174da6c85))
* optimistic peerDependencies ([83dc44b](https://github.com/vikejs/vike-vue/commit/83dc44b30226fdd6b9fb344da11beb2f71cc3e11))
* simplify peerDependencies ([4a674a6](https://github.com/vikejs/vike-vue/commit/4a674a67bf19c19f111afdeb648629539a165e97))
* simplify vike-vue-{query,pinia} integration ([08b612f](https://github.com/vikejs/vike-vue/commit/08b612f689545e54e42cfd7ed2639680c182f7fb))
* try to read pageContext.pinia only if needed ([#193](https://github.com/vikejs/vike-vue/issues/193)) ([d97fc6f](https://github.com/vikejs/vike-vue/commit/d97fc6fac4984c95d922248ec660ae2b0226cbfe))
* use vike@0.4.191 ([efed97a](https://github.com/vikejs/vike-vue/commit/efed97a186b55c787322de07722f345ea40749c5))


### BREAKING CHANGES

* Update to `vike@0.4.191` or above.
* the [bodyHtml{Start,End} settings](https://vike.dev/bodyHtmlEnd) are now global:
you cannot use [config inheritance](https://vike.dev/config#inheritance) for them anymore,
and make sure to define them at a global location such as `pages/+config.js`.



## [0.1.1](https://github.com/vikejs/vike-vue/compare/vike-vue-pinia@0.1.0...vike-vue-pinia@0.1.1) (2024-06-04)


### Bug Fixes

* update peerDependencies for packages ([5417fef](https://github.com/vikejs/vike-vue/commit/5417fefb1f4951da3b701164f8d2a51178c012e7))



# [0.1.0](https://github.com/vikejs/vike-vue/compare/vike-vue-pinia@0.0.5...vike-vue-pinia@0.1.0) (2024-06-04)


### Bug Fixes

* Improve Hooks ([#96](https://github.com/vikejs/vike-vue/issues/96)) ([32f06aa](https://github.com/vikejs/vike-vue/commit/32f06aa1d2ca72e0c935c05bee814f031f41554a))


### BREAKING CHANGES

* All vike-vue packages need to be updated simultaneously.
rename `onBeforeMountApp` to `onBeforeRenderClient` and `onAfterRenderSSRApp` to `onAfterRenderHtml`



## [0.0.5](https://github.com/vikejs/vike-vue/compare/vike-pinia@0.0.4...vike-vue-pinia@0.0.5) (2024-06-03)


### Bug Fixes

* rename `vike-pinia` to `vike-vue-pinia` ([222b1fd](https://github.com/vikejs/vike-vue/commit/222b1fd5f7530837755ab0798becfea9ba0261bd))
* export Vike configuration at /config for vike-pinia ([c2baf03](https://github.com/vikejs/vike-vue/commit/c2baf039279f73bdfecb9d1227ce6703ec3b75d4))


### BREAKING CHANGES

* all references to `vike-pinia` should be replaced with `vike-vue-pinia`
b3c0c
* use `import vikePinia from 'vike-pinia/config'` in `+config` files



## [0.0.4](https://github.com/vikejs/vike-vue/compare/vike-pinia@0.0.3...vike-pinia@0.0.4) (2024-04-23)

### Bug Fixes

* Fix peer dependencies ([dcfc981](https://github.com/vikejs/vike-vue/commit/dcfc981a43c2c2a98d3dc13fb4f10354245fcd17))


## [0.0.3](https://github.com/vikejs/vike-vue/compare/vike-pinia@0.0.2...vike-pinia@0.0.3) (2024-04-21)

### Bug Fixes

* Fix links in `CHANGELOG.md` by using absolute URLs

### Features

* make vike-pinia work with other vike plugins by not overwriting `onCreateApp` ([607feac](https://github.com/vikejs/vike-vue/commit/607feac13997685e1ae20d067643ec2815ffab00))


## [0.0.2](https://github.com/vikejs/vike-vue/compare/vike-pinia@0.0.1...vike-pinia@0.0.2) (2024-02-14)


### Bug Fixes

* set Vike extension name ([61ff29b](https://github.com/vikejs/vike-vue/commits/61ff29be2d3209a11324b2755f3857ece6aec9d1))



## 0.0.1 (2024-01-15)

Initial version.
