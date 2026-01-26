/**
 * Blogs Collection
 * 
 * Quản lý blog posts cho multi-tenant travel websites.
 * Hỗ trợ Quick Input via Drawer UI khi sử dụng relationship field.
 */

import type { CollectionConfig } from 'payload'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'author', 'publishDate', 'tenant', 'updatedAt'],
    description: 'Quản lý blog posts cho các travel websites',
  },
  access: {
    read: () => true, // Public read for frontend
  },
  fields: [
    // === BASIC INFO ===
    {
      name: 'title',
      label: 'Post Title',
      type: 'text',
      required: true,
      admin: {
        description: 'Tiêu đề bài viết',
      },
    },
    {
      name: 'slug',
      label: 'URL Slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (VD: "best-time-to-visit-vietnam")',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'Slug is required'
        if (!/^[a-z0-9-]+$/.test(value)) {
          return 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'
        }
        return true
      },
    },

    // === AUTHOR & DATE ===
    {
      type: 'row',
      fields: [
        {
          name: 'author',
          label: 'Author',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Tên tác giả',
          },
        },
        {
          name: 'publishDate',
          label: 'Publish Date',
          type: 'date',
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd/MM/yyyy',
            },
          },
        },
      ],
    },

    // === MEDIA ===
    {
      name: 'featuredImage',
      label: 'Featured Image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Ảnh đại diện cho bài viết (khuyến nghị: 1200x630)',
      },
    },

    // === CONTENT ===
    {
      name: 'excerpt',
      label: 'Excerpt',
      type: 'textarea',
      admin: {
        description: 'Tóm tắt ngắn hiển thị trong blog listing (max 160 ký tự)',
      },
    },
    {
      name: 'content',
      label: 'Content',
      type: 'richText',
      admin: {
        description: 'Nội dung đầy đủ của bài viết',
      },
    },

    // === CATEGORIZATION ===
    {
      name: 'tags',
      label: 'Tags',
      type: 'array',
      minRows: 0,
      maxRows: 10,
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Tags để phân loại bài viết',
      },
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { label: 'Travel Tips', value: 'travel-tips' },
        { label: 'Destinations', value: 'destinations' },
        { label: 'Culture', value: 'culture' },
        { label: 'Food & Cuisine', value: 'food' },
        { label: 'Adventure', value: 'adventure' },
        { label: 'News', value: 'news' },
      ],
      admin: {
        description: 'Danh mục bài viết',
      },
    },

    // === RELATED TOUR ===
    {
      name: 'relatedTour',
      label: 'Related Tour',
      type: 'relationship',
      relationTo: 'tours',
      hasMany: false,
      admin: {
        description: 'Tour liên quan đến bài viết này',
        allowCreate: true,
      },
    },
    {
      name: 'relatedCountries',
      label: 'Related Countries',
      type: 'relationship',
      relationTo: 'countries',
      hasMany: true,
      admin: {
        description: 'Quốc gia liên quan',
        position: 'sidebar',
      },
    },
    {
      name: 'relatedDestinations',
      label: 'Related Destinations',
      type: 'relationship',
      relationTo: 'destinations',
      hasMany: true,
      admin: {
        description: 'Điểm đến liên quan',
        position: 'sidebar',
      },
    },

    // === TENANT RELATIONSHIP ===
    {
      name: 'tenant',
      label: 'Tenant',
      type: 'relationship',
      relationTo: 'tenants',
      hasMany: false,
      admin: {
        position: 'sidebar',
        description: 'Blog thuộc tenant nào',
      },
    },

    // === STATUS ===
    {
      name: 'isPublished',
      label: 'Published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Xuất bản bài viết này',
      },
    },
    {
      name: 'isFeatured',
      label: 'Featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Hiển thị trong featured posts',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Auto-generate slug from title if not provided
        if (data?.title && !data?.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        }
        // Set publish date if publishing for first time
        if (data?.isPublished && !data?.publishDate) {
          data.publishDate = new Date().toISOString()
        }
        return data
      },
    ],
  },
}

export default Blogs
