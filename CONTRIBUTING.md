# Contributing

## Building

Build `vike-vue`:

```bash
git clone git@github.com:vikejs/vike-vue
cd vike-vue/ && pnpm install
pnpm build
```

> Note that:
>
> - You'll need [pnpm](https://pnpm.io/) which you can install with `$ npm install -g pnpm`.
> - Windows may or may not work.
>
> These requirements only hold for developing `vike-vue`: the npm package `vike-vue` can be used with Windows and any package manager.

## Validating

### Running the examples

You can then test your modifications against an example, e.g. `examples/basic/`:

```bash
cd examples/basic/
pnpm dev
```

## Releasing

Choose the next version number according to the rules of
[Semantic Versioning](https://semver.org/). Let's assume you are releasing
version `1.2.3`, run:

```bash
pnpm exec release-me v1.2.3
```

This will:

- update the version number and dependencies in `package.json`,
- extend [`CHANGELOG.md`](CHANGELOG.md),
- update the `pnpm-lock.yaml` file,
- create a `release: v1.2.3` git commit and push it,
- create a `v1.2.3` git tag and push it,
- build the package and publish it to npm.
