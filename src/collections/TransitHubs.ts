
import type { CollectionConfig } from 'payload'

export const TransitHubs: CollectionConfig = {
  slug: 'transit-hubs',
  admin: {
    useAsTitle: 'name',
    group: 'Locations',
    defaultColumns: ['name', 'code', 'type', 'district', 'updatedAt'],
    description: 'Quản lý các trạm trung chuyển, đầu mối giao thông (Sân bay, Ga tàu, Bến cảng)',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Hub Name',
      admin: {
          placeholder: 'e.g. Noi Bai International Airport'
      }
    },
    {
      type: 'row',
      fields: [
        {
          name: 'code',
          type: 'text',
          label: 'IATA/Station Code',
          admin: { 
            width: '50%',
            placeholder: 'e.g. HAN, SGN'
          }
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          label: 'Hub Type',
          options: [
            { label: 'Airport', value: 'airport' },
            { label: 'Train Station', value: 'train_station' },
            { label: 'Pier / Port', value: 'pier' },
            { label: 'Bus Station', value: 'bus_station' },
          ],
          admin: { width: '50%' }
        },
      ]
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
      type: 'row',
      fields: [
        {
          name: 'district',
          type: 'relationship',
          relationTo: 'districts',
          required: true,
          label: 'District (Location)',
          admin: { width: '50%' }
        },
        {
          name: 'country',
          type: 'relationship',
          relationTo: 'countries',
          required: true,
          label: 'Country',
          admin: { width: '50%' }
        },
      ]
    },
    {
        name: 'description',
        type: 'textarea',
        label: 'Description / Notes'
    }
  ],
}

export default TransitHubs
