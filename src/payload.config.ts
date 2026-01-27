import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tenants } from './collections/Tenants'
import { Tours } from './collections/Tours'
import { Experiences } from './collections/Experiences'
import { Blogs } from './collections/Blogs'
import { TourCategories } from './collections/TourCategories'
import { Countries } from './collections/Countries'
import { Destinations } from './collections/Destinations'
import { FAQs } from './collections/FAQs'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Check if R2 storage is configured
const isR2Configured = !!(
  process.env.R2_BUCKET_NAME &&
  process.env.R2_ENDPOINT &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY
)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | Capella Web Engine',
    },
  },
  cors: '*',
  csrf: [], // Disable CSRF for easier local dev or configure properly later
  collections: [Users, Media, Tenants, Tours, TourCategories, Blogs, Experiences, Countries, Destinations, Tags, FAQs],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    // Only enable S3 storage if R2 is configured
    ...(isR2Configured
      ? [
          s3Storage({
            collections: {
              media: true,
            },
            bucket: process.env.R2_BUCKET_NAME!,
            config: {
              endpoint: process.env.R2_ENDPOINT,
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID!,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
              },
              region: 'auto',
            },
          }),
        ]
      : []),
  ],
})
