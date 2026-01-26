/**
 * BasicWebApp Module Schema
 * 
 * Định nghĩa cấu trúc dữ liệu cho Web App động.
 * Các fields này sẽ được hiển thị trong Payload CMS.
 */

import type { Field } from 'payload'

export const moduleKey = 'basic-web-app'
export const moduleLabel = 'Basic Web App (Dynamic)'

export const fields: Field[] = [
  {
    name: 'appName',
    label: 'Application Name',
    type: 'text',
    required: true,
    admin: {
      description: 'Tên ứng dụng hiển thị trên header',
    },
  },
  {
    name: 'appDescription',
    label: 'Application Description',
    type: 'textarea',
    admin: {
      description: 'Mô tả ngắn về ứng dụng',
    },
  },
  {
    name: 'primaryColor',
    label: 'Primary Color',
    type: 'text',
    defaultValue: '#667eea',
    admin: {
      description: 'Màu chủ đạo của ứng dụng (hex code)',
    },
  },
  {
    name: 'apiConfig',
    label: 'API Configuration',
    type: 'group',
    fields: [
      {
        name: 'endpoint',
        label: 'API Endpoint',
        type: 'text',
        admin: {
          description: 'URL của API backend (e.g., https://api.example.com)',
        },
      },
      {
        name: 'apiKey',
        label: 'API Key',
        type: 'text',
        admin: {
          description: 'API Key để xác thực (sẽ được truyền qua header)',
        },
      },
    ],
  },
  {
    name: 'features',
    label: 'Enabled Features',
    type: 'group',
    fields: [
      {
        name: 'enableSearch',
        label: 'Enable Search',
        type: 'checkbox',
        defaultValue: true,
      },
      {
        name: 'enableDarkMode',
        label: 'Enable Dark Mode Toggle',
        type: 'checkbox',
        defaultValue: true,
      },
      {
        name: 'enableNotifications',
        label: 'Enable Notifications',
        type: 'checkbox',
        defaultValue: false,
      },
    ],
  },
  {
    name: 'menuItems',
    label: 'Navigation Menu',
    type: 'array',
    minRows: 0,
    maxRows: 8,
    fields: [
      {
        name: 'label',
        label: 'Menu Label',
        type: 'text',
        required: true,
      },
      {
        name: 'href',
        label: 'Link',
        type: 'text',
        required: true,
      },
      {
        name: 'icon',
        label: 'Icon',
        type: 'text',
        admin: {
          description: 'Emoji hoặc icon (e.g., 🏠, 📊)',
        },
      },
    ],
  },
]
