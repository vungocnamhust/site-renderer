
import type { CollectionConfig } from 'payload'

export const Countries: CollectionConfig = {
  slug: 'countries',
  admin: {
    useAsTitle: 'name',
    group: 'Locations',
    defaultColumns: ['name', 'code', 'region', 'updatedAt'],
    description: 'Quản lý danh sách quốc gia',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: 'Country Name',
    },
    {
        name: 'slug',
        type: 'text', 
        required: true,
        unique: true,
        admin: {
            description: 'URL slug (e.g. vietnam)',
        },
        hooks: {
            beforeValidate: [
                ({ value, data }) => {
                    if (!value && data?.name) {
                        return data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                    }
                    return value;
                }
            ]
        }
    },
    {
      name: 'code',
      type: 'text',
      label: 'ISO Code (e.g. VN)',
      admin: {
          width: '50%'
      }
    },
    {
      name: 'region',
      type: 'select',
      options: [
        { label: 'Southeast Asia', value: 'southeast-asia' },
        { label: 'East Asia', value: 'east-asia' },
        { label: 'South Asia', value: 'south-asia' },
      ],
      admin: {
          width: '50%'
      }
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description/Overview',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Image',
    },
  ],
}

export default Countries
