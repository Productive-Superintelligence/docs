# prosi.io

The site of Productive Superintelligence, home of
[LLLM](https://github.com/Productive-Superintelligence/lllm): a single page
with the logo and links. Older paths (`/hub`, `/docs`, `/projects`, `/blog`,
`/about`) redirect to [lllm.one](https://lllm.one).

Built with Astro and deployed to GitHub Pages by `.github/workflows/astro.yml`
on every push to `main`. The workflow also builds `psi_docs/` into `/docs`,
which is now a single page that redirects to lllm.one.

```bash
npm ci
npm run dev
```
