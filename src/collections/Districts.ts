
import type { CollectionConfig } from 'payload'

export const Districts: CollectionConfig = {
  slug: 'districts',
  admin: {
    useAsTitle: 'name',
    group: 'Locations',
    defaultColumns: ['name', 'country', 'destination', 'updatedAt'],
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
      label: 'District / City Name',
      admin: {
        placeholder: 'e.g. Hanoi, Quang Ninh, Ho Chi Minh'
      }
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
        description: 'Chọn quốc gia của quận/thành phố này'
      },
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
      label: 'Parent Destination',
      admin: {
        position: 'sidebar',
        description: 'Chọn điểm đến chính (Level 2) của quận này'
      },
    },
    {
      name: 'isHub',
      type: 'checkbox',
      label: 'Is Logistics Hub?',
      defaultValue: false,
      admin: {
          position: 'sidebar',
          description: 'Đánh dấu nếu đây là khu vực có trạm trung chuyển lớn'
      }
    },
    {
        name: 'logistics',
        type: 'group',
        label: 'Logistics / Transfer Info',
        fields: [
            {
                type: 'row',
                fields: [
                    {
                        name: 'nearestAirport',
                        type: 'relationship',
                        relationTo: 'transit-hubs',
                        label: 'Nearest Airport',
                        filterOptions: {
                            type: { equals: 'airport' }
                        },
                        admin: { width: '50%' }
                    },
                    {
                        name: 'nearestTrainStation',
                        type: 'relationship',
                        relationTo: 'transit-hubs',
                        label: 'Nearest Train Station',
                        filterOptions: {
                            type: { equals: 'train_station' }
                        },
                        admin: { width: '50%' }
                    }
                ]
            },
            {
                name: 'transferNotes',
                type: 'textarea',
                label: 'Transfer Notes (AI Context)',
                admin: {
                    description: 'VD: 45 min from Airport, 10 min from Train station'
                }
            }
        ]
    }
  ],
}

export default Districts
