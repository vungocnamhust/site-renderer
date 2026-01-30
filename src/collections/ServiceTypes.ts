
import type { CollectionConfig } from 'payload'

export const ServiceTypes: CollectionConfig = {
  slug: 'service-types',
  admin: {
    useAsTitle: 'name',
    group: 'Master Data',
    defaultColumns: ['code', 'name', 'defaultUnit', 'isActive'],
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
      label: 'Service Type Code',
      admin: {
          description: 'e.g. TRF, GUI, HTL'
      }
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Service Type Name',
    },
    {
      name: 'defaultUnit',
      type: 'text',
      label: 'Default Unit',
      admin: {
          description: 'e.g. per vehicle, per day'
      }
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
    },
  ],
}

export default ServiceTypes
