# Next.js eCommerce course result

The code in this repository is the result of following [Basir's NextJS ecommerce course on Youtube](https://www.youtube.com/watch?v=3kYkEVIZNZY) and at the same time adding:

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

you will need MongoDB running somewhere, and you will need to point to it
through a `.env` file that you need to set on the project root. use `.env.sample`
as a template.

