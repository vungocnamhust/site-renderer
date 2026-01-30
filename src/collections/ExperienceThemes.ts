
import type { CollectionConfig } from 'payload'

export const ExperienceThemes: CollectionConfig = {
  slug: 'experience-themes',
  admin: {
    useAsTitle: 'name',
    group: 'Master Data',
    defaultColumns: ['code', 'name', 'serviceType', 'updatedAt'],
    description: 'Định nghĩa các chủ đề trải nghiệm và ánh xạ tới loại dịch vụ tương ứng',
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
      label: 'Theme Code',
      admin: {
        description: 'e.g. SHOW, FOOD, BOAT'
      }
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Theme Name',
    },
    {
      name: 'serviceType',
      type: 'relationship',
      relationTo: 'service-types',
      required: true,
      label: 'Mapping to Service Type',
      admin: {
        description: 'Ánh xạ chủ đề này vào loại dịch vụ cơ sở nào'
      }
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },
  ],
}

export default ExperienceThemes
