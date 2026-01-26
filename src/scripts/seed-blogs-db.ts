import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const DATA_PATH = path.resolve(dirname, 'data/blogs_data.json')

// Basic type for raw content
interface RawContentItem {
  type: 'h1' | 'h2' | 'h3' | 'p';
  text: string;
}

interface BlogData {
  title: string;
  slug: string;
  author: string;
  publishDate: string;
  excerpt: string;
  category: string;
  tags: string[];
  contentRaw: RawContentItem[];
}

function convertRawToLexical(rawContent: RawContentItem[]) {
  const children = rawContent.map(item => {
    const textNode = {
      detail: 0,
      format: 0,
      mode: 'normal',
      style: '',
      text: item.text,
      type: 'text',
      version: 1,
    };

    if (item.type === 'p') {
      return {
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [textNode],
      };
    } else {
      // Heading
      return {
        type: 'heading',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        tag: item.type,
        children: [textNode],
      };
    }
  });

  return {
    root: {
      type: 'root',
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children: children,
    },
  };
}

async function seed() {
  console.log('Starting blog seed...');
  const payload = await getPayload({ config })

  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Data file not found: ${DATA_PATH}`)
    process.exit(1)
  }

  const blogs: BlogData[] = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  console.log(`Found ${blogs.length} blogs to seed.`);

  // Get a default tenant (usually there's at least one, e.g. 'Asia Tours' or ID 1)
  const tenantQuery = await payload.find({
    collection: 'tenants',
    limit: 1,
  });

  let tenantId = null;
  if (tenantQuery.totalDocs > 0) {
    tenantId = tenantQuery.docs[0].id;
    console.log(`Using Tenant: ${tenantQuery.docs[0].name} (ID: ${tenantId})`);
  } else {
    console.warn('No tenants found. Blogs will be created without a tenant (if allowed) or might fail.');
  }

  for (const blog of blogs) {
    console.log(`Processing: ${blog.title}`);

    try {
      // Check for existing
      const existing = await payload.find({
        collection: 'blogs',
        where: {
          slug: { equals: blog.slug }
        }
      });

      const lexicalContent = convertRawToLexical(blog.contentRaw);

      const data: any = {
        title: blog.title,
        slug: blog.slug,
        author: blog.author,
        publishDate: blog.publishDate,
        excerpt: blog.excerpt,
        category: blog.category,
        tags: blog.tags.map(tag => ({ tag })), // Array of objects structure from schema
        content: lexicalContent,
        isPublished: true,
      };

      if (tenantId) {
        data.tenant = tenantId;
      }

      if (existing.totalDocs > 0) {
        console.log(`  Updating existing blog...`);
        await payload.update({
          collection: 'blogs',
          id: existing.docs[0].id,
          data: data,
        });
      } else {
        console.log(`  Creating new blog...`);
        await payload.create({
          collection: 'blogs',
          data: data,
        });
      }

    } catch (e: any) {
      console.error(`  Error processing ${blog.slug}:`, e.message);
    }
  }

  console.log('Seeding complete.')
  process.exit(0)
}

seed();
