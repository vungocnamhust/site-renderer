
import type { CollectionConfig } from 'payload'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    group: 'Content',
    defaultColumns: ['question', 'order', 'updatedAt'],
    description: 'Frequently Asked Questions',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      label: 'Question',
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
          description: 'Auto-generated from question',
      },
      hooks: {
          beforeValidate: [
              ({ value, data }) => {
                  if (!value && data?.question) {
                      return data.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                  }
                  return value;
              }
          ]
      }
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      label: 'Answer',
    },
    {
      name: 'countries',
      type: 'relationship',
      relationTo: 'countries',
      hasMany: true,
      label: 'Related Countries',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'districts',
      type: 'relationship',
      relationTo: 'districts',
      hasMany: true,
      label: 'Related Districts / Cities',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: 'Related Tags',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tour_categories',
      type: 'relationship',
      relationTo: 'tour-categories',
      hasMany: true,
      label: 'Related Tour Categories',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'is_general',
      type: 'checkbox',
      label: 'Show on Home Page / General FAQ',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Check this if the FAQ is generic and should appear on the Home Page.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

export default FAQs
