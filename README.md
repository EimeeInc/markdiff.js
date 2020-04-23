# markdiff.js

![markdiff CI](https://github.com/EimeeInc/markdiff.js/workflows/markdiff%20CI/badge.svg)

JavaScript port of [r7kamura/markdiff](https://github.com/r7kamura/markdiff).

## Demo

https://eimeeinc.github.com/markdiff.js

## Install

Please login to GitHub Packages referring to the following URL.  
https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#authenticating-to-github-packages

```sh
$ npm login --registry=https://npm.pkg.github.com
```

In the same directory as your package.json file, create or edit an .npmrc file.

```
@eimeeinc:registry=https://npm.pkg.github.com/EimeeInc
```

Install:muscle:

```sh
$ npm install @eimeeinc/markdiff
```

## Usage

```ts
import markdiff from "@eimeeinc/markdiff"

// Pass Markdown edit histories
const diff = markdiff("<p>a</p>", "<p>b</p>")

// You get the HTML diff between the two points.
console.log(diff)
```
