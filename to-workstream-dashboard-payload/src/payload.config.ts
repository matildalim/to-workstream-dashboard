// src/payload.config.ts

// 1) Force-load envs before anything else
import { config as loadEnv } from 'dotenv'
import { resolve } from 'path'

// Load .env first, then .env.local (if present) to override for local dev
loadEnv({ path: resolve(process.cwd(), '.env') })
loadEnv({ path: resolve(process.cwd(), '.env.local'), override: true })

// 2) Read DB URL (fail fast if missing)
const DB_URL =
  process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL || ''

if (!DB_URL) {
  throw new Error('DATABASE_URL is missing. Check .env/.env.local at project root.')
}

// ---------------- Your existing imports ----------------
import { postgresAdapter } from '@payloadcms/db-postgres'
// storage-adapter-import-placeholder (leave as-is if you add storage later)

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

// Path helpers
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ---------------- Payload config ----------------
export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },

  // Global/default editor config
  editor: defaultLexical,

  // 3) Postgres (Supabase) adapter
  db: postgresAdapter({
    pool: {
      connectionString: DB_URL,
      // Dev-safe TLS (macOS sometimes flags Supabase chain):
      // Keep this ON in local dev. In prod, you can remove this and
      // use `?sslmode=require` in the URL instead.
      ssl: { rejectUnauthorized: false },
    },
    // Optional: keep in 'public' or choose a dedicated schema:
    schemaName: 'payload',
  }),

  collections: [Pages, Posts, Media, Categories, Users],

  cors: [getServerSideURL()].filter(Boolean),

  globals: [Header, Footer],

  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],

  secret: process.env.PAYLOAD_SECRET,

  sharp,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
