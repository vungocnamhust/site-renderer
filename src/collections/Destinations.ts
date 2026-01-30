
import type { CollectionConfig } from 'payload'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: {
    useAsTitle: 'name',
    group: 'Locations',
    defaultColumns: ['name', 'country', 'updatedAt'],
    description: 'Quản lý Điểm đến (Level 2 - e.g. Hanoi, Halong Bay, Siem Reap)',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Destination Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly slug (e.g. hanoi)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'latitude',
          type: 'number',
          label: 'Latitude',
          admin: { width: '50%' }
        },
        {
          name: 'longitude',
          type: 'number',
          label: 'Longitude',
          admin: { width: '50%' }
        }
      ]
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
      label: 'Country',
      admin: {
        position: 'sidebar',
      },
    },
    {
        name: 'featuredImage',
        type: 'upload',
        relationTo: 'media',
        label: 'Hero Image',
    },
    {
        name: 'description',
        type: 'richText',
        label: 'Description'
    }
  ],
}

export default Destinations
