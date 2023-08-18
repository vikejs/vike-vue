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

You can then test your modifications against an example, e.g. `examples/basic/`:

```bash
cd examples/basic/
pnpm dev
```
