<p align="center">
    <img src="http://www.cmsrs.pl/images/cms/logo_cmsrs.png"><br/>
    Modern CMS for websites and galleries, and even stores, without the chaos.
</p>

<br />
<br />


# cmsrs3-nuxt

Nuxt frontend for the **cmsrs3 headless CMS**.

## Setup

Copy the example environment configuration file:

```bash
cp .env.example .env
```

Next, edit the .env file and set the domains for your headless API and Nuxt frontend. For example:

```
NUXT_PUBLIC_DOMAIN=http://headless-api.example.com
DOMAIN=http://nuxt.example.com
```

Install and start the Nuxt development server:

```
npm install && npm run dev
```

Build for production and generate the sitemap:

```
npx nuxi generate
ts-node generate-sitemap.ts
```

## Server code 

https://github.com/cmsrs/cmsrs3