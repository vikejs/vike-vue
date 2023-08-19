#!/usr/bin/env bash
# LA_TEMP

set -xe

pnpm reset
cd examples/with-vue-plugin/
pnpm run test
pnpm run dev
