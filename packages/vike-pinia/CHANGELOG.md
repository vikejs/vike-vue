## 0.0.1 (2024-01-15)


### Bug Fixes

* actually support config.meta.ssr = false ([3ee182a](vikejs/vike-vue/commits/3ee182a814df2c8d8d5144ef1b9bbd79b18a4a5e))
* Fix 'Error: Cannot find module' ([6b35d81](vikejs/vike-vue/commits/6b35d8138aa943a717d621de68f66bdc97cfc73d))
* Fix `__name is not defined` ([11417ca](vikejs/vike-vue/commits/11417cac897d4405af393ff5312ae746e5ce1662))
* further ensure Vue doesn't swallow errors ([1a0acc0](vikejs/vike-vue/commits/1a0acc03de36e32ee137c480e9e761726001ddaf))
* improve error message ([233070a](vikejs/vike-vue/commits/233070a37d37e970ec6ef85d5386003717566550))
* migrate to `vike` ([79d5da9](vikejs/vike-vue/commits/79d5da9b535f082e3c58d4d5b37aa8d45fda9002))
* possibly unset document title on client routing ([984cb76](vikejs/vike-vue/commits/984cb760cf6f36984de5e3f1174005f21cf9e697)), closes [vikejs/vike-react#27](vikejs/vike-react/issues/27)
* properly handle render error upon client-side navigation ([e784c36](vikejs/vike-vue/commits/e784c36b76d29792a8eb00ab900dc95d8fe4728e))
* use latest version of the Vike V1 design ([70f02b7](vikejs/vike-vue/commits/70f02b72c9f2f30030d703ed9f70229ebe36fd5f))


### Features

* add Head config option ([75cd700](vikejs/vike-vue/commits/75cd70081e530392c93be07944fb063c42092a9f))
* add link to repo to SSR shell ([d63c9d3](vikejs/vike-vue/commits/d63c9d3e3b0dce8318a8a8c14bb62115d4949318)), closes [vikejs/vike-react#32](vikejs/vike-react/issues/32) [vikejs/vike-solid#32](vikejs/vike-solid/issues/32)
* Add vuePlugins config option // [#16](null/vikejs/vike-vue/issues/16) ([4a1dddd](vikejs/vike-vue/commits/4a1ddddcd1f33bd2755b6ccb91ad7f1d6d0942c6))
* useData() ([7409c4e](vikejs/vike-vue/commits/7409c4ead9f185c5c95bb871375683a7d4fe1a45))


### BREAKING CHANGES

* use npm package `vike` instead of `vite-plugin-ssr`,
see https://vite-plugin-ssr.com/vike



