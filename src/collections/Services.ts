
import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    group: 'Master Data',
    defaultColumns: ['serviceCode', 'title', 'type', 'destination', 'district', 'status'],
    description: 'Danh mục các dịch vụ tiêu chuẩn theo schema hệ thống',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'serviceCode',
          label: 'Service Code',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            placeholder: 'e.g. CT-SRV-TIC-VN-HAN-0001',
            width: '50%',
          },
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          defaultValue: 'draft',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Inactive', value: 'inactive' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'title',
      label: 'Service Name',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. Water Puppet Show Ticket (standard)',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'richText',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          label: 'Service Type',
          type: 'relationship',
          relationTo: 'service-types',
          required: true,
          admin: { width: '33%' },
        },
        {
          name: 'destination',
          label: 'City/Province',
          type: 'relationship',
          relationTo: 'destinations',
          required: false,
          admin: { width: '33%' },
        },
        {
          name: 'district',
          label: 'District',
          type: 'relationship',
          relationTo: 'districts',
          required: false,
          admin: { width: '34%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'relatedExperiences',
          type: 'relationship',
          relationTo: 'experiences',
          hasMany: true,
          label: 'Related Experiences',
          admin: { width: '50%' }
        },
        {
          name: 'relatedBlogs',
          type: 'relationship',
          relationTo: 'blogs',
          hasMany: true,
          label: 'Related Blogs',
          admin: { width: '50%' }
        },
      ]
    },
    {
      type: 'row',
      fields: [
        {
          name: 'unit',
          label: 'Unit',
          type: 'text',
          admin: { 
            placeholder: 'e.g. per ticket, per person',
            width: '50%' 
          },
        },
        {
          name: 'leadTime',
          label: 'Lead Time',
          type: 'text',
          admin: { 
            placeholder: 'e.g. 24h, 48h',
            width: '50%' 
          },
        },
      ],
    },
    {
      name: 'cancellationPolicy',
      label: 'Cancellation Policy',
      type: 'textarea',
      admin: {
          description: 'e.g. Non-refundable after booking'
      }
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'richText',
    },
  ],
}

export default Services
