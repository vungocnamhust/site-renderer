/**
 * Tenants Collection
 * 
 * Collection chính quản lý multi-tenant.
 * Tự động load field configuration từ module schemas.
 */

import type { CollectionConfig, Field } from 'payload'
import { SCHEMAS, getTemplateOptions } from '@/components/modules/schemas'

// Generate dynamic template options from registered modules
const templateOptions = getTemplateOptions()

// Generate dynamic content groups for each module
const dynamicContentGroups: Field[] = SCHEMAS.map(mod => ({
  name: `content_${mod.moduleKey.replace(/-/g, '_')}`,
  type: 'group',
  label: `Content: ${mod.moduleLabel}`,
  admin: {
    condition: (data) => data?.templateId === mod.moduleKey,
    description: `Nội dung cho template "${mod.moduleLabel}"`,
  },
  fields: mod.fields,
}))

// Helper to recursively remove 'id' fields
const cleanData = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(cleanData)
  }
  if (obj && typeof obj === 'object') {
    const newObj: any = {}
    for (const key in obj) {
      if (key === 'id') continue
      newObj[key] = cleanData(obj[key])
    }
    return newObj
  }
  return obj
}

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    group: 'Multi-Tenant',
    description: 'Quản lý các trang web cho từng tenant/subdomain',
    defaultColumns: ['name', 'subdomain', 'templateId', 'isActive', 'updatedAt'],
  },
  access: {
    read: () => true, // Allow public read for frontend
  },
  fields: [
    // Basic Info
    {
      name: 'name',
      label: 'Tenant Name',
      type: 'text',
      required: true,
      admin: {
        description: 'Tên dễ nhớ để quản lý (ví dụ: "Landing Page Khuyến Mãi")',
      },
    },
    {
      name: 'subdomain',
      label: 'Subdomain',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Subdomain (ví dụ: "khuyenmai" -> khuyenmai.privatetour.asia)',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'Subdomain is required'
        if (!/^[a-z0-9-]+$/.test(value)) {
          return 'Subdomain chỉ được chứa chữ thường, số và dấu gạch ngang'
        }
        if (value.length < 2) {
          return 'Subdomain phải có ít nhất 2 ký tự'
        }
        return true
      },
    },
    {
      name: 'isActive',
      label: 'Active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Bật/tắt trang web này',
        position: 'sidebar',
      },
    },

    // Template Selection
    {
      type: 'row',
      fields: [
        {
          name: 'templateId',
          label: 'Template',
          type: 'select',
          required: true,
          options: templateOptions,
          defaultValue: templateOptions[0]?.value,
          admin: {
            description: 'Chọn template cho trang web',
            width: '50%',
          },
        },
      ],
    },

    // SEO Settings
    {
      name: 'seo',
      label: 'SEO Settings',
      type: 'group',
      admin: {
        description: 'Cấu hình SEO cho trang web',
      },
      fields: [
        {
          name: 'title',
          label: 'Page Title',
          type: 'text',
          admin: {
            description: 'Tiêu đề hiển thị trên tab browser',
          },
        },
        {
          name: 'description',
          label: 'Meta Description',
          type: 'textarea',
          admin: {
            description: 'Mô tả trang cho SEO (150-160 ký tự)',
          },
        },
        {
          name: 'ogImage',
          label: 'Open Graph Image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Ảnh hiển thị khi share trên mạng xã hội',
          },
        },
      ],
    },

    // Dynamic Content Groups (auto-generated from modules)
    ...dynamicContentGroups,
  ],
  hooks: {
    beforeOperation: [
      ({ operation, args }) => {
        // Strip 'id' from request data RECURSIVELY if present to avoid validation error
        // This handles both top-level 'id' and nested 'id's in arrays/groups that might conflict
        if ((operation === 'update' || operation === 'create') && args.data) {
           console.log('[Tenants.beforeOperation] recursively cleaning data...');
           args.data = cleanData(args.data);
        }
        return args
      },
    ],
    beforeValidate: [
      ({ data }) => {
        // Redundant check, but keeping for safety as secondary guard (shallow check)
        if (data && typeof data === 'object' && 'id' in data) {
          delete (data as Record<string, unknown>).id
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data }) => {
        // Normalize subdomain to lowercase
        if (data?.subdomain) {
          data.subdomain = data.subdomain.toLowerCase().trim()
        }
        return data
      },
    ],
  },
}

export default Tenants
