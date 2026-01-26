# Capella Web Engine (v5.0)

**Modular Hybrid Web Factory** built with **Next.js 15**, **Payload CMS 3.0**, and **PostgreSQL**.

This project serves as the core rendering engine for multiple travel websites (e.g., [asiatours.com](https://asiatours.com), [capellatravel.com](https://capellatravel.com)). It utilizes a **modular architecture** ("Prism") where UI components and business logic are encapsulated into reusable self-describing modules.

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org)
- **CMS**: [Payload CMS 3.0](https://payloadcms.com)
- **Database**: PostgreSQL
- **Language**: TypeScript
- **Storage**: S3 / Cloudflare R2 (for media assets)
- **Styling**: TailwindCSS / SCSS Modules (Migration in progress)

## Project Structure

The codebase is organized to support modularity and multi-tenancy:

```
src/
├── app/                  # Next.js App Router
│   ├── (payload)/        # Payload CMS Admin Routes (/admin)
│   ├── (frontend)/       # Default Public Routes
│   └── sites/            # Tenant-specific Dispatcher (Multi-tenant Routing)
├── collections/          # Payload CMS Collection Definitions (Database Schema)
│   ├── Users.ts          # Admin users
│   ├── Tenants.ts        # Site Configurations (Multi-tenancy)
│   ├── Tours.ts          # Tour product data
│   └── ...
├── components/
│   └── modules/          # Core "Prism" Modules (Self-contained UI + Logic)
│       └── AsiaToursTravelWeb/ # Example Theme Module
│           ├── index.tsx       # Internal Router
│           ├── schema.ts       # Module Configuration
│           ├── pages/          # Module-specific Pages (Layouts)
│           └── components/     # Atomic UI Components
├── scripts/              # Maintenance and data migration scripts
└── payload.config.ts     # Main CMS Configuration (DB, Plugins, Editor)
```

## Engine Mechanics (Prism Architecture)

The system works by decoupling the **Domain/Tenant** from the **UI logic** through a dynamic dispatching system.

### 1. Request Routing (Middleware)
When a request comes in (e.g., `capella.privatetour.asia`), the `middleware.ts` intercepts it and rewrites the path to an internal route:
`capella.privatetour.asia/vietnam/tours` -> `/sites/capella/vietnam/tours`

### 2. Tenant Dispatcher
The file `src/app/sites/[site]/[[...slug]]/page.tsx` acts as the central brain. It performs the following steps:
1.  **Identify Tenant**: Queries the `tenants` collection to find the config for `site` (e.g., "capella").
2.  **Select Template**: Reads the `templateId` from the tenant record (e.g., `AsiaToursTravelWeb`).
3.  **Load Module**: Uses the Registry (`src/components/modules/registry.ts`) to load the corresponding React Component.
4.  **Inject Data**: Passes two key props to the Module:
    -   `data`: The specific content settings for this tenant (logo, colors, footer links).
    -   `slug`: The remaining URL path (e.g., `['vietnam', 'tours']`).

### 3. Module Execution
The Module (e.g., `AsiaToursTravelWeb/index.tsx`) takes over. It acts as a **sub-application**. It checks the `slug` to decide which internal page to render:
-   `slug = []` -> Renders `HomePage`
-   `slug = ['vietnam', 'tours']` -> Renders `CountryToursPage`
-   `slug = ['blog', '...']` -> Renders `BlogPostPage`

## Theme Development Guide (Example: AsiaTours)

A "Theme" in this engine is just a Module. To create `AsiaToursTravelWeb`, we followed 3 steps:

### Step 1: Define Data Schema
We created `src/components/modules/AsiaToursTravelWeb/schema.ts` to tell the CMS what data this theme needs.

```typescript
// schema.ts
export const fields: Field[] = [
  {
    name: 'siteSettings', // Group for logo, phone, email...
    type: 'group',
    fields: [ ... ]
  },
  {
    name: 'heroSection',  // Homepage hero banner
    type: 'group',
    fields: [ ... ]
  },
  {
    name: 'featuredTours', // Relationship to pick tours from DB
    type: 'relationship',
    relationTo: 'tours',
    hasMany: true
  }
]
```

### Step 2: Build Internal Router
We created `index.tsx` to handle routing within the theme. This allows the theme to support multiple pages without cluttering the main Next.js App Router.

```tsx
// index.tsx
export function AsiaToursTravelWeb({ data, slug = [] }: ModuleProps) {
  // 1. Homepage
  if (slug.length === 0) {
    return <HomePage data={data} />
  }

  // 2. Country Pages (e.g., /vietnam/tours)
  if (slug.length === 2 && slug[1] === 'tours') {
    return <CountryToursPage data={data} country={slug[0]} />
  }
  
  // 3. Blog Posts
  if (slug[0] === 'blog') {
    return <BlogPostPage data={data} slug={slug[1]} />
  }

  return notFound()
}
```

### Step 3: Implement Page Components
We built standard React components in `pages/` that accept the `data` prop.

```tsx
// pages/HomePage.tsx
export function HomePage({ data }) {
  const { heroSection, featuredTours } = data;
  
  return (
    <main>
      <Hero 
         title={heroSection.title} 
         bgImage={heroSection.backgroundImage} 
      />
      <TourGrid tours={featuredTours} />
    </main>
  )
}
```

## Composition & Data Flow Strategy

We strictly follow the **Atomic Layout Composition** pattern to ensure themes are scalable and reusable.

### Concept

-   **Atoms**: Small, dumb UI components (e.g., `TourCard`, `Button`, `Banner`). They have no idea about the database or routing. They just receive **Configuration Data** (props) and render HTML.
-   **Param Data**: The raw content injected from the Database/CMS (Module Settings + URL Params).
-   **Layout (Page)**: The conductor. It decides *which* Atoms to use and *how* to arrange them. It feeds the Param Data into the Atoms.

### Logic Flow

1.  **Define Atoms**:
    We create independent components in `components/` folder of the module.
    *Example (`TourCard.tsx`):*
    ```tsx
    export function TourCard({ tour }) {
      return (
         <div className="card">
           <img src={tour.image} />
           <h1>{tour.title}</h1>
         </div>
      )
    }
    ```

2.  **Define Layout**:
    In the `pages/` folder (e.g., `HomePage.tsx`), we compose the page using these atoms.
    ```tsx
    // The Layout "Arrangement"
    export function HomePage({ data }) {
      return (
        <div className="home-layout">
           {/* Atom 1: Hero */}
           <Hero data={data.heroSection} />

           {/* Atom 2: Grid System */}
           <div className="grid">
              {data.featuredTours.map(tour => (
                 // Reuse Atom 3: TourCard
                 <TourCard key={tour.id} tour={tour} />
              ))}
           </div>
        </div>
      )
    }
    ```

### Why this works?

*   **Separation of Concerns**: `TourCard` only cares about displaying a tour. It doesn't care if it's on the Homepage, Country Page, or Search Result.
*   **Reusability**: We can use `TourCard` in `AsiaToursTravelWeb` and `CapellaTravelWeb` (if they share the module) or simply copy the Atom to a new module and style it differently.
*   **Data-Driven**: Changing the `data` (via CMS) instantly repopulates the Atoms without changing code.

## Case Study: Capella Travel

**Goal**: Setup `capellatravel.com` using the existing `AsiaTours` theme.

**Why it works:**
1.  **Reusability**: We don't copy-paste code. The `AsiaToursTravelWeb` module is a generic "Travel Agency Website" definition.
2.  **Configuration**: In the Admin Panel, we create a new **Tenant** record:
    -   **Name**: Capella Travel
    -   **Subdomain**: `capella`
    -   **Template**: `AsiaToursTravelWeb`
    -   **Content**: Upload Capella's logo, set brand colors, and configure the menu.
3.  **Result**:
    -   The system reuses the *logic* of AsiaTours (routing, layout, tour cards).
    -   It applies the *brand/content* of Capella (data injected via props).
    -   Both sites run on the same codebase but look different and share the same database of Tours (`tours` collection).

## Getting Started

### Prerequisites

- **Node.js**: v18.20.2+ or v20.9.0+
- **pnpm**: v9+ or v10+
- **PostgreSQL**: Local instance or via Docker

### 1. Installation

```bash
git clone <repository-url>
cd site-renderer
pnpm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update your `.env` file with your PostgreSQL connection string and secrets:

```bash
# Database
DATABASE_URI="postgres://postgres:postgres@localhost:5432/capella_web_engine"

# Payload Encryption
PAYLOAD_SECRET="your-super-secret-key-at-least-32-chars"
```

### 3. Database Setup

You can run a local PostgreSQL instance using Docker:

```bash
docker-compose up -d
```

Initialize the database (if needed):
```bash
pnpm db:init
```

### 4. Development

Start the development server:

```bash
pnpm dev
```

- **Website**: [http://localhost:3000](http://localhost:3000)
- **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)
