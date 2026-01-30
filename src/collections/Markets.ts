
import type { CollectionConfig } from 'payload'

export const Markets: CollectionConfig = {
  slug: 'markets',
  admin: {
    useAsTitle: 'name',
    group: 'Master Data',
    defaultColumns: ['code', 'name', 'isActive', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Market Code',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Market Name',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active (Y/N)',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
    },
  ],
}

export default Markets
