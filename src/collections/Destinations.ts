
import type { CollectionConfig } from 'payload'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: {
    useAsTitle: 'name',
    group: 'Locations',
    defaultColumns: ['name', 'country', 'updatedAt'],
    description: 'Quản lý điểm đến (Cities, Provinces)',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Destination Name',
    },
    {
        name: 'slug',
        type: 'text',
        required: true,
        unique: true,
        admin: {
            description: 'URL slug (e.g. ha-long-bay)',
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
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
      hasMany: false,
      label: 'Country',
      admin: {
          position: 'sidebar',
      }
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
    },
    {
      name: 'geo',
      type: 'point',
      label: 'Geolocation (Lat, Lng)',
    },
  ],
}

export default Destinations
