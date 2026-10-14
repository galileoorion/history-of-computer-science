# A History of Computer Science

An Astro blog by Attila Kulik, adapted from the existing philosophy blog's Astro setup. The first post explores the history of hash tables through a parking-lot analogy.

## Preview

Requires Node.js 22.12 or newer (matching the inherited Astro setup).

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 4321 --background
```

Open http://127.0.0.1:4321. Manage the background server with `npm run astro -- dev status` and `npm run astro -- dev stop`.

Build the static site with `npm run build`. Output is in `dist/`.

## Content

The first article is in `src/content/blog/how-a-parking-lot-explains-the-hash-table.md`. Its title and subtitle are in the metadata at the top; the page template displays them once.

To add a post, create a Markdown file in `src/content/blog/` using `templates/post.md` as a guide. The filename becomes its URL. Set a unique `sequence` number; higher numbers appear first. Drafts are excluded from pages, RSS, and the sitemap. Cover images are optional. Put images in `public/images/` and use a path beginning `/images/`.

Set `pubDate: YYYY-MM-DD` on each post when it is published; the article layout and RSS feed use it.

## Design and structure

- Site title and description: `src/consts.ts`
- Colours, type, mobile layout: `src/styles/global.css`
- Homepage: `src/pages/index.astro`
- Article layout: `src/pages/[slug].astro`
- About page is currently removed. Its source is kept in `templates/about.astro` for possible restoration.
- Metadata and canonical URLs: `src/components/BaseHead.astro`
- Feed: `src/pages/rss.xml.js`
- GitHub Pages address: `astro.config.mjs`

The homepage parking diagram is an original SVG component. No external fonts, image generation, tracking, or third-party scripts are required.

## Publishing

The `.github/workflows/deploy.yml` workflow builds the site and deploys it when `main` is updated. In repository Settings → Pages, select **GitHub Actions** as the source. The existing user site gives this project site an initial address of `https://attilakulik.com/history-of-computer-science/`.

Connecting `tech.attilakulik.com` is a separate step: set that custom domain in GitHub Pages, add the DNS record, update `site` in `astro.config.mjs`, and remove its `base` path. GitHub Pages ignores a `CNAME` file when publishing through a custom Actions workflow.

## Origin

Uses the existing Astro/MDX, RSS, sitemap, metadata, and date-formatting setup from `galileoorion/galileoorion.github.io`. The layout and content configuration have been adapted for this separate series.
