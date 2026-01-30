
import type { CollectionConfig } from 'payload'

export const Districts: CollectionConfig = {
  slug: 'districts',
  admin: {
    useAsTitle: 'name',
    group: 'Locations',
    defaultColumns: ['name', 'country', 'updatedAt'],
    description: 'Quản lý Quận/Huyện (Districts)',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'District Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly slug (e.g. hoan-kiem)',
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
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
      label: 'Country',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

export default Districts
