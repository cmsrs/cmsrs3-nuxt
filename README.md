# cmsrs3-nuxt

Nuxt frontend for the **cmsrs3 headless CMS**.

## Setup

Copy the example environment configuration file:

```bash
cp .env.example .env
```

Then edit the .env file and set the domain of your headless API, for example:

```
NUXT_PUBLIC_DOMAIN=http://headless-api.example.com
```

This variable is used by the application to communicate with the CMS API.

Nuxt page:

```
DOMAIN=http://nuxt.example.com
```

Production build and create sitemap

```
npx nuxi generate
ts-node generate-sitemap.ts
```

## More information

For more details about the CMS, visit:

- [cmsrs.pl](https://cmsrs.pl)

- [github cmsrs3](https://github.com/cmsrs/cmsrs3)


# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
