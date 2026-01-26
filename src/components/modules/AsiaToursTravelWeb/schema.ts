import type { Field } from 'payload'

export const moduleKey = 'asia-tours-travel-web'
export const moduleLabel = 'Asia Tours Travel Website'

export const fields: Field[] = [
  // === SITE SETTINGS ===
  {
    name: 'siteSettings',
    type: 'group',
    label: 'Site Settings',
    fields: [
      {
        name: 'siteName',
        type: 'text',
        defaultValue: 'Asia Tours',
        required: true,
      },
      {
        name: 'logo',
        type: 'upload',
        relationTo: 'media',
        label: 'Site Logo',
      },
      {
        name: 'contactPhone',
        type: 'text',
        label: 'Phone Number',
      },
      {
        name: 'contactEmail',
        type: 'email',
        label: 'Email Address',
      },
    ],
  },

  // === HERO SECTION (Homepage) ===
  {
    name: 'heroSection',
    type: 'group',
    label: 'Homepage Hero',
    fields: [
      {
        name: 'slides',
        type: 'array',
        label: 'Hero Slides',
        minRows: 1,
        fields: [
            {
                name: 'image',
                type: 'upload',
                relationTo: 'media',
                required: true,
            },
            {
                name: 'title',
                type: 'text',
                defaultValue: 'Discover the Essence of Asia',
            },
            {
                name: 'subtitle',
                type: 'textarea',
            },
            {
                name: 'link',
                type: 'text',
                label: 'Button Link (Optional)',
            },
            {
                name: 'linkText',
                type: 'text',
                label: 'Button Text',
                defaultValue: 'Explore Now',
            }
        ]
      },
    ],
  },

  // === NAVIGATION ===
  {
    name: 'navigation',
    type: 'array',
    label: 'Main Navigation',
    fields: [
      {
        name: 'label',
        type: 'text',
        required: true,
      },
      {
        name: 'href',
        type: 'text',
        required: true,
      },
      {
        name: 'children',
        type: 'array',
        label: 'Sub Menu',
        fields: [
          {
            name: 'label',
            type: 'text',
          },
          {
            name: 'href',
            type: 'text',
          },
        ],
      },
    ],
  },

  // === MULTI-COUNTRY TOURS (Relationship with Quick Input) ===
  {
    name: 'multiCountryTours',
    type: 'relationship',
    relationTo: 'tours',
    hasMany: true,
    label: 'Multi-Country Tours',
    admin: {
      allowCreate: true,
      description: 'Select tours for the Multi-Country Grid section (Category: Multi-Country)',
    },
    filterOptions: ({ data }) => {
      // Optional: Add filter for category later if needed
      return true
    },
  },

  // === FEATURED TOURS (Vertical List Layout) ===
  {
    name: 'featuredTours',
    type: 'relationship',
    relationTo: 'tours',
    hasMany: true,
    label: 'Featured Tours (Vertical Layout)',
    admin: {
      allowCreate: true, 
      description: 'Select tours to display in the vertical wide-card list (e.g. "Featured Tours")',
    },
  },

  // === FEATURED BLOGS (Relationship with Quick Input) ===
  {
    name: 'featuredBlogs',
    type: 'relationship',
    relationTo: 'blogs',
    hasMany: true,
    label: 'Featured Blogs',
    admin: {
      allowCreate: true, // Allow creating new blog inline
      description: 'Select blogs to display on homepage',
    },
  },

  // === BEST SUPPORT SECTION ===
  {
    name: 'bestSupport',
    type: 'array',
    label: 'Best Support / Why Us',
    fields: [
      {
        name: 'icon',
        type: 'upload',
        relationTo: 'media',
        label: 'Icon',
      },
      {
        name: 'title',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        type: 'textarea',
      },
    ],
  },

  // === TOUR STYLES ===
  {
    name: 'tourStyles',
    type: 'array',
    label: 'Asia Tours by Styles',
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        required: true,
      },
      {
        name: 'description',
        type: 'textarea',
      },
      {
        name: 'link',
        type: 'text',
      }
    ]
  },

  // === UNIQUE EXPERIENCES ===
  {
    name: 'uniqueExperiences',
    type: 'array',
    label: 'Unique Experiences',
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
      },
      {
        name: 'location',
        type: 'text',
      },
      {
        name: 'country',
        type: 'text',
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        required: true,
      },
      {
        name: 'description',
        type: 'textarea',
      },
      {
        name: 'link',
        type: 'text',
      }
    ]
  },

  // === FAQs ===
  {
    name: 'faqs',
    type: 'array',
    label: 'FAQs',
    fields: [
      {
        name: 'question',
        type: 'text',
        required: true,
      },
      {
        name: 'answer',
        type: 'textarea',
        required: true,
      }
    ]
  },

  // === RECENT TRAVEL EXPERIENCE ===
  {
    name: 'recentTravels',
    type: 'array',
    label: 'Recent Travel Experiences',
    fields: [
      {
        name: 'title',
        type: 'text',
      },
      {
        name: 'location',
        type: 'text',
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        required: true,
      },
      {
        name: 'link',
        type: 'text',
      }
    ]
  },

  // === LOCAL EXPERIENCES (Crowd) ===
  {
    name: 'locExp',
    type: 'group',
    label: 'Local Experiences (Stats & Crowd)',
    fields: [
      {
        name: 'stats',
        type: 'group',
        fields: [
          // @ts-ignore
          { name: 'countries', type: 'text', defaultValue: '18', dbName: 'ctry' },
          // @ts-ignore
          { name: 'destinations', type: 'text', defaultValue: '316', dbName: 'dest' },
          // @ts-ignore
          { name: 'experiences', type: 'text', defaultValue: '900+', dbName: 'exp' },
          // @ts-ignore
          { name: 'reviews', type: 'text', defaultValue: '98%', dbName: 'rev' },
          // @ts-ignore
          { name: 'guests', type: 'text', defaultValue: '20,000+', dbName: 'guest' },
        ]
      },
      {
        name: 'gallery',
        type: 'array',
        label: 'Crowd Gallery',
        dbName: 'le_gal',
        fields: [
          {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
          },
          {
            name: 'name',
            type: 'text',
          },
          {
            name: 'size',
            type: 'select',
            dbName: 'le_gal_size',
            options: ['crow-size-1', 'crow-size-2', 'crow-size-3'],
            defaultValue: 'crow-size-1',
          }
        ]
      }
    ]
  },

  // === FOOTER ===
  {
    name: 'footer',
    type: 'group',
    label: 'Footer Content',
    fields: [
      {
        name: 'aboutText',
        type: 'textarea',
        label: 'About Text',
      },
      {
        name: 'copyright',
        type: 'text',
        defaultValue: '© 2024 Asia Tours. All rights reserved.',
      },
      {
        name: 'socialLinks',
        type: 'array',
        fields: [
          {
            name: 'platform',
            type: 'select',
            dbName: 'social_platform',
            options: ['facebook', 'twitter', 'instagram', 'youtube', 'tripadvisor'],
          },
          {
            name: 'url',
            type: 'text',
          },
        ],
      },
      {
          name: 'footerPartners',
          type: 'array',
          label: 'Footer Partners (Logos)',
          fields: [
              {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
              },
              {
                  name: 'name',
                  type: 'text',
              },
              {
                  name: 'link',
                  type: 'text',
              }
          ]
      }
    ],
  },
]
