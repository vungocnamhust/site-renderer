
import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    group: 'Master Data',
    defaultColumns: ['serviceCode', 'title', 'type', 'level', 'district', 'status'],
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
      type: 'row',
      fields: [
         {
          name: 'level',
          label: 'Service Level',
          type: 'select',
          options: [
            { label: 'Economy / 3-Star', value: 'economy' },
            { label: 'Deluxe / 4-Star', value: 'deluxe' },
            { label: 'Luxury / 5-Star', value: 'luxury' }
          ],
          admin: { width: '50%' }
         },
         {
             name: 'description',
             label: 'Description',
             type: 'richText',
             admin: { width: '50%' }
         }
      ]
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
          label: 'Destination / City (Level 2)',
          type: 'relationship',
          relationTo: 'destinations',
          required: true,
          admin: { 
            width: '33%',
            description: 'Điểm đến lớn (e.g. Hanoi, Halong Bay)'
          },
        },
        {
          name: 'district',
          label: 'District / Area (Level 1)',
          type: 'relationship',
          relationTo: 'districts',
          required: false,
          admin: { 
            width: '33%',
            description: 'Khu vực cụ thể (e.g. Hoan Kiem, Bai Chay)'
          },
          filterOptions: ({ data }: any) => {
              if (data?.destination) {
                  const destId = typeof data.destination === 'object' ? data.destination.id : data.destination;
                  return {
                      destination: {
                          equals: destId
                      }
                  }
              }
              return true;
          }
        },
        {
             name: 'dummy',
             type: 'ui',
             admin: { width: '34%' },
             label: 'Location Details'
        }
      ],
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
            width: '33%' 
          },
        },
        {
          name: 'leadTime',
          label: 'Lead Time',
          type: 'text',
          admin: { 
            placeholder: 'e.g. 24h, 48h',
            width: '33%' 
          },
        },
        {
          name: 'markets',
          label: 'Target Markets',
          type: 'relationship',
          relationTo: 'markets',
          hasMany: true,
          admin: { width: '34%' }
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
