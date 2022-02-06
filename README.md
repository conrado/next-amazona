# Next.js eCommerce course result

The code in this repository is the result of following [Bassir's NextJS ecommerce course on Youtube](https://www.youtube.com/watch?v=3kYkEVIZNZY) and at the same time adding:

- typescript
- recoil
- recoil-persist

An initial [Typescript + MaterialUI boilerplate](https://github.com/mui-org/material-ui/tree/master/examples/nextjs-with-typescript) was taken from the MUI team
themselves. Some code by them has been left behind. Please be sure to check out
their excellent example.

## How to use

Download the example [or clone the repo](https://github.com/conrado/next-amazona):

<!-- #default-branch-switch -->

```sh
curl -sL https://github.com/conrado/next-amazona/archive/refs/heads/main.tar.gz | tar xvz next-amazona-main
cd next-amazona-main
```

Install it and run:

```sh
yarn
yarn dev
```

### Setup

- mongodb

  you will need MongoDB running somewhere, and you will need to point to it
  through `.env.local` file that you need to set on the project root. use
  `.env.sample` as a template. On mac I'm using the official
  [mongodb tap](https://github.com/mongodb/homebrew-brew). A nice hint from
  Bassir was also to use [mongodb compass](https://formulae.brew.sh/cask/mongodb-compass)

- paypal

  Paypal payment was added on vid30. `.env.sample` has the environment varialble
  name will need to set in `.env.local` with the sandbox credentials for it
  paypal to work correctly. get your own account from
  [developer.paypal.com](https://developer.paypal.com)

## Latest changes:

### 2022/02/05

- as off of vid33 the code is no longer being followed on youtube as videos
  are only available on Udemy from here on.

  The code is being translated from the commits of [Bassir's next-amazona
  repository available on github](https://github.com/basir/next-amazona).
