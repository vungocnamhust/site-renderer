
import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'location', 'country', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Experience Title',
    },
    {
      name: 'duration',
      type: 'text',
      label: 'Duration (e.g. 2-3 hours, Full Day)',
      admin: {
        position: 'sidebar'
      },
      hooks: {
        beforeValidate: [
            ({ value }: any) => {
                if (typeof value !== 'string') return undefined; // Return undefined if not string to allow optional/null
                return value;
            }
        ]
      }
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
          description: 'URL-friendly identifier',
      },
      hooks: {
          beforeValidate: [
              ({ value, data }) => {
                  if (!value && data?.title) {
                      return data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                  }
                  return value;
              }
          ]
      }
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Featured Image',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Image Gallery',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
            name: 'caption',
            type: 'text',
        }
      ]
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags/Badges (e.g. Swimming, Heritage)',
      fields: [
          {
              name: 'label',
              type: 'text',
              required: true,
          },
          {
              name: 'icon',
              type: 'text',
              label: 'Icon Class (e.g. icon-swimming)',
          }
      ]
    },
    {
      name: 'short_description',
      type: 'textarea',
      label: 'Short Description (Hero)',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Listing Description (Card)',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Detailed Content',
      editor: lexicalEditor({
        features: ({ defaultFeatures }: { defaultFeatures: any[] }) => [
          ...defaultFeatures,
          // Ensure we have common features enabled to avoid parsing errors with existing data
        ]
      })
    },
    {
      type: 'row',
      fields: [
          {
            name: 'latitude',
            type: 'number',
            label: 'Latitude (Level 0)',
            admin: { width: '50%' }
          },
          {
            name: 'longitude',
            type: 'number',
            label: 'Longitude (Level 0)',
            admin: { width: '50%' }
          }
      ]
    },
    {
      type: 'row',
      fields: [
          {
            name: 'country',
            type: 'relationship',
            relationTo: 'countries',
            admin: { width: '50%' }
          },
          {
            name: 'district',
            type: 'relationship',
            relationTo: 'districts',
            hasMany: false,
            label: 'District / City',
            filterOptions: ({ data }: any) => {
                if (data?.country) {
                    const countryId = typeof data.country === 'object' ? data.country.id : data.country;
                    return {
                        country: {
                            equals: countryId
                        }
                    }
                }
                return true
            },
            admin: { width: '50%' }
          }
      ]
    },
  ],
}
