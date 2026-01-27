import { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'tag_name',
    defaultColumns: ['tag_code', 'tag_name', 'active'],
  },
  fields: [
    {
      name: 'tag_code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Tag Code',
    },
    {
      name: 'tag_name',
      type: 'text',
      required: true,
      label: 'Tag Name',
    },
    {
      name: 'active',
      type: 'select',
      options: [
        { label: 'Y', value: 'Y' },
        { label: 'N', value: 'N' },
      ],
      defaultValue: 'Y',
      label: 'Active (Y/N)',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
    },
  ],
}
