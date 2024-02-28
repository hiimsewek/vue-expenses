# vue-expenses

Simple progressive web application that allows you to keep track of your expenses.

[Live Demo](https://main--vue-expenses.netlify.app/)

## Tech Stack

- Vue
- Pinia
- TypeScript
- PrimeVue + PrimeIcons
- VitePWA
- Cypress

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Headed Component Tests with [Cypress Component Testing](https://on.cypress.io/component)

```sh
npm run test:unit:dev # or `npm run test:unit` for headless testing
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Screenshots

<p align = "center">
  <img src = "https://github.com/hiimsewek/vue-expenses/assets/62641653/5e9984b4-0539-404a-a946-20166045f8ae"/>
</p>
<p align = "center">
  <img src = "https://github.com/hiimsewek/vue-expenses/assets/62641653/8b5d6f71-a2f7-4864-9d09-c2b5e9a83a1b"/>
</p>
<p align = "center">
  <img src = "https://github.com/hiimsewek/vue-expenses/assets/62641653/663960b0-1641-45e7-8854-8954ab54cd71"/>
</p>
<p align = "center">
  <img src = "https://github.com/hiimsewek/vue-expenses/assets/62641653/0ee98a38-be2a-4971-83ae-06718b0c28c5"/>
</p>
