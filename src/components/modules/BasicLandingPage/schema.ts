/**
 * BasicLandingPage Module Schema
 * 
 * Định nghĩa cấu trúc dữ liệu cho Landing Page tĩnh.
 * Các fields này sẽ được hiển thị trong Payload CMS.
 */

import type { Field } from 'payload'

export const moduleKey = 'basic-landing-page'
export const moduleLabel = 'Basic Landing Page (Static)'

export const fields: Field[] = [
  {
    name: 'heroTitle',
    label: 'Hero Title',
    type: 'text',
    required: true,
    admin: {
      description: 'Tiêu đề chính hiển thị ở banner',
    },
  },
  {
    name: 'heroSubtitle',
    label: 'Hero Subtitle',
    type: 'textarea',
    admin: {
      description: 'Mô tả ngắn bên dưới tiêu đề',
    },
  },
  {
    name: 'heroBanner',
    label: 'Hero Banner Image',
    type: 'upload',
    relationTo: 'media',
    admin: {
      description: 'Ảnh banner chính (khuyến nghị: 1920x1080)',
    },
  },
  {
    name: 'ctaButton',
    label: 'Call-to-Action Button',
    type: 'group',
    fields: [
      {
        name: 'text',
        label: 'Button Text',
        type: 'text',
        defaultValue: 'Liên hệ ngay',
      },
      {
        name: 'link',
        label: 'Button Link',
        type: 'text',
        defaultValue: '#contact',
      },
    ],
  },
  {
    name: 'features',
    label: 'Features Section',
    type: 'array',
    minRows: 0,
    maxRows: 6,
    fields: [
      {
        name: 'icon',
        label: 'Icon',
        type: 'text',
        admin: {
          description: 'Emoji hoặc icon class (e.g., 🚀, ⭐)',
        },
      },
      {
        name: 'title',
        label: 'Feature Title',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        label: 'Feature Description',
        type: 'textarea',
      },
    ],
  },
  {
    name: 'contactInfo',
    label: 'Contact Information',
    type: 'group',
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
      },
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'text',
      },
      {
        name: 'address',
        label: 'Address',
        type: 'textarea',
      },
    ],
  },
  {
    name: 'footerText',
    label: 'Footer Text',
    type: 'text',
    defaultValue: '© 2025 All rights reserved.',
  },
]
