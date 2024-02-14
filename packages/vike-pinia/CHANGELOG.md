## [0.0.2](vikejs/vike-vue/compare/vike-pinia@0.0.1...vike-pinia@0.0.2) (2024-02-14)


### Bug Fixes

* export config at `/config` instead of `/` ([82a535f](vikejs/vike-vue/commits/82a535fa848df7d7d99df0bab60a647309666aa9))
* fix broken `import type` in `ClientOnly` ([bae3e79](vikejs/vike-vue/commits/bae3e79f46d9018de04d7f8edf0ad7b0af2f1fc0))
* set Vike extension name ([61ff29b](vikejs/vike-vue/commits/61ff29be2d3209a11324b2755f3857ece6aec9d1))
* simplify `<head>` management ([39aa1a9](vikejs/vike-vue/commits/39aa1a9c66d49fb0d0fcc529ebb5f7cc679f2e28))


### BREAKING CHANGES

* Update Vike to `0.4.160` or above.
* Replace `import vikeVue from 'vike-vue'`
with `import vikeVue from 'vike-vue/config'`. (Typically
in your `/pages/+config.h.js`.)
* Replace
`import type { OnCreateAppSync } from 'vike-vue'` (or
another available hook type) with
`import type { OnCreateAppSync } from 'vike-vue/types'`
* Fetching data using `pageContext.pageProps` is
deprecated, use `data()` and `useData()` instead,
see https://vike.dev/data-fetching
* Setting the page's title using `pageContext.title`
is deprecated (`pageContext.description` and `pageContext.lang` are
also deprecated), use the settings `title` and `Head` instead,
see https://vike.dev/head



## 0.0.1 (2024-01-15)

Initial version.
