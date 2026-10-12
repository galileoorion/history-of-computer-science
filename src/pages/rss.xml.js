import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { sitePath } from '../sitePath';
export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort((a, b) => b.data.sequence - a.data.sequence);
  return rss({
    title: SITE_TITLE, description: SITE_DESCRIPTION, site: new URL(sitePath(), context.site),
    items: posts.map(post => ({
      title: post.data.title, description: post.data.description,
      pubDate: post.data.pubDate, link: sitePath(`${post.id}/`),
    })),
    customData: '<language>en</language>',
  });
}
