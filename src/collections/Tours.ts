/**
 * Tours Collection
 * 
 * Quản lý danh sách tours cho multi-tenant travel websites.
 * Hỗ trợ Quick Input via Drawer UI khi sử dụng relationship field.
 */

import type { CollectionConfig } from 'payload'

export const Tours: CollectionConfig = {
  slug: 'tours',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'country', 'duration', 'price', 'tenant', 'updatedAt'],
    description: 'Quản lý tours cho các travel websites',
  },
  access: {
    read: () => true, // Public read for frontend
  },
  fields: [
    // === MEDIA (TOP) ===
    {
      name: 'featuredImage',
      label: 'Featured Image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Ảnh đại diện chính cho tour (khuyến nghị: 800x600)',
      },
    },

    // === BASIC INFO ===
    {
      name: 'title',
      label: 'Tour Title',
      type: 'text',
      required: true,
      admin: {
        description: 'Tên tour (VD: "Vietnam Discovery 12 Days")',
      },
    },
    {
      name: 'slug',
      label: 'URL Slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (VD: "vietnam-discovery-12-days")',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'Slug is required'
        if (!/^[a-z0-9-]+$/.test(value)) {
          return 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'
        }
        return true
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      admin: {
          description: 'VD: "Private & Tailored Tour"',
      }
    },
    {
      name: 'shortDescription',
      label: 'Short Description',
      type: 'textarea',
      admin: {
        description: 'Mô tả ngắn hiển thị trong tour card (max 200 ký tự)',
      },
    },

    {
        name: 'destinations',
        type: 'array',
        label: 'Destinations List (Auto-calculated)',
        admin: {
            readOnly: true,
            description: 'This list is automatically populated and calculated based on the Detailed Itinerary'
        },
        fields: [
            {
                name: 'destination',
                type: 'relationship',
                relationTo: 'destinations',
                required: true,
            },
            {
                name: 'image',
                type: 'upload',
                relationTo: 'media',
                label: 'Override Image (Optional)'
            },
             {
                name: 'duration_days',
                type: 'number',
                label: 'Days spent'
            }
        ]
    },
    {
      type: 'row',
      fields: [
        {
          name: 'countries',
          label: 'Countries',
          type: 'relationship',
          relationTo: 'countries',
          hasMany: true,
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'tourType',
          label: 'Tour Type',
          type: 'select',
          options: [
            { label: 'Single Country', value: 'single-country' },
            { label: 'Multi-Country', value: 'multi-country' },
          ],
          admin: { 
            width: '50%',
            readOnly: true,
            description: 'Auto-calculated based on countries count'
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
         {
            name: 'routeTitle',
            label: 'Route Title',
            type: 'text',
            admin: {
                readOnly: true,
                description: 'Auto-generated (e.g. Vietnam Cambodia Laos Tours)'
            }
         },
         {
            name: 'routeSlug',
            label: 'Route Slug',
            type: 'text',
            index: true,
            admin: {
                readOnly: true,
                description: 'Auto-generated query key (e.g. vietnam-cambodia-laos)'
            }
         }
      ]
    },
    // === CATEGORIES ===
    {
      name: 'categories',
      label: 'Tour Categories',
      type: 'relationship',
      relationTo: 'tour-categories',
      hasMany: true,
      admin: {
          description: 'Phân loại tour (VD: Luxury Tours, Family Tours)',
          position: 'sidebar'
      }
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        description: 'Thẻ tag cho tour (VD: History, Local Life)',
        position: 'sidebar',
      },
    },

    // === PRICING & DURATION ===
    {
      type: 'row',
      fields: [
        {
          name: 'duration',
          label: 'Duration (Auto-calculated)',
          type: 'text',
          admin: {
            readOnly: true,
            description: 'Tự động tính từ Lịch trình chi tiết',
            width: '50%',
          },
        },
        {
          name: 'price',
          label: 'Price (USD)',
          type: 'number',
          admin: {
            description: 'Giá khởi điểm',
            width: '50%',
            position: 'sidebar',
          },
        },
      ],
    },
    {
      name: 'priceNote',
      label: 'Price Note',
      type: 'text',
      admin: {
        description: 'VD: "From $1,500 per person" hoặc "Price on request"',
      },
    },
    {
        name: 'videoUrl',
        type: 'text',
        label: 'Highlight Video URL'
    },
     {
      name: 'priceOptions',
      type: 'array',
      label: 'Price Options (Budget/Deluxe/Luxury)',
      fields: [
        { name: 'name', type: 'text', label: 'Option Name (e.g. Economy)' },
        { name: 'price', type: 'number', label: 'Price (USD)' },
        { name: 'description', type: 'textarea', label: 'Description/Inclusions' }
      ]
    },

    // === CONTENT ===
    {
      name: 'highlights',
      label: 'Tour Highlights',
      type: 'richText',
      admin: {
        description: 'Mô tả ngắn gọn các điểm nổi bật (Sử dụng Bullet List cho tiện lợi)',
      },
    },
    {
      name: 'itinerary',
      label: 'Detailed Itinerary',
      type: 'array',
      admin: {
        description: 'Lịch trình chi tiết từng ngày (Accordion View)',
      },
      fields: [
        {
          name: 'day',
          label: 'Day Title',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'Day 1: Arrival in Hanoi',
          }
        },
        {
            name: 'location',
            label: 'Location/Destination (Specific)',
            type: 'relationship',
            relationTo: 'destinations',
            required: true,
            admin: {
                description: 'Chọn điểm đến cụ thể để hệ thống tự động tổng hợp danh sách Destinations'
            }
        },
        {
          name: 'content',
          label: 'Activities',
          type: 'richText',
          required: true,
        },
        {
            name: 'services',
            label: 'Services Breakdown',
            type: 'array',
            fields: [
               {
                  name: 'serviceType',
                  type: 'relationship',
                  relationTo: 'service-types',
                  required: true,
                  admin: { width: '40%' }
               },
               {
                  name: 'description',
                  type: 'text',
                  label: 'Short Note / Inclusions',
                  admin: { width: '60%' }
               }
            ]
        },
        {
          name: 'meals',
          label: 'Meals',
          type: 'select',
          hasMany: true,
          options: ['Breakfast', 'Lunch', 'Dinner'],
        },
        {
            name: 'accommodation',
            label: 'Accommodation Note (Legacy)',
            type: 'text',
            admin: {
                description: 'Sử dụng Services breakdown cho thông tin Hotel mới'
            }
        }
      ]
    },
    {
      name: 'includes',
      label: 'What\'s Included',
      type: 'richText',
      admin: {
        description: 'Liệt kê các dịch vụ đã bao gồm trong tour (dạng rich text)',
      },
    },
    {
      name: 'excludes',
      label: 'What\'s Excluded',
      type: 'richText',
      admin: {
        description: 'Liệt kê các dịch vụ không bao gồm trong tour (dạng rich text)',
      },
    },

    // === DETAILED INCLUSIONS (FOR MODALS) ===
    {
        type: 'tabs',
        tabs: [
            {
                label: 'Accommodation Details',
                name: 'specs_accommodation',
                fields: [
                    {
                        name: 'items',
                        type: 'array',
                        label: 'Daily Accommodation',
                        fields: [
                            {
                                name: 'day_title',
                                type: 'text',
                                label: 'Day/Location Title',
                                required: true,
                                admin: { description: 'e.g. Day 1: Hanoi' }
                            },
                            {
                                name: 'options',
                                type: 'array',
                                label: 'Hotel Options',
                                fields: [
                                    {
                                        name: 'hotel_name',
                                        type: 'text',
                                        required: true,
                                        label: 'Hotel Name'
                                    },
                                    {
                                        name: 'hotel_grade',
                                        type: 'select',
                                        options: [
                                            { label: 'Economy', value: 'Economy' },
                                            { label: 'Deluxe', value: 'Deluxe' },
                                            { label: 'Luxury', value: 'Luxury' }
                                        ],
                                        required: true,
                                        label: 'Grade/Class'
                                    },
                                    {
                                        name: 'star_rating',
                                        type: 'number',
                                        min: 1,
                                        max: 5,
                                        label: 'Star Rating'
                                    },
                                    {
                                        name: 'review_count',
                                        type: 'number',
                                        label: 'Review Count'
                                    },
                                    {
                                        name: 'trip_advisor_url',
                                        type: 'text',
                                        label: 'TripAdvisor URL'
                                    },
                                    {
                                        name: 'image',
                                        type: 'upload',
                                        relationTo: 'media',
                                        label: 'Hotel Image'
                                    },
                                    {
                                        name: 'description',
                                        type: 'textarea',
                                        label: 'Short Description'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Experience Details',
                name: 'specs_experiences',
                fields: [
                    {
                        name: 'items',
                        type: 'relationship',
                        relationTo: 'experiences',
                        hasMany: true,
                        label: 'Related Experiences'
                    }
                ]
            },
            {
                label: 'Transport Details',
                name: 'specs_transport',
                fields: [
                    {
                        name: 'content',
                        type: 'richText',
                        label: 'Transport Description'
                    }
                ]
            },
            {
                label: 'Team Details',
                name: 'specs_team',
                fields: [
                    {
                        name: 'content',
                        type: 'richText',
                        label: 'Team Description'
                    }
                ]
            },
            {
                label: 'Meals Details',
                name: 'specs_meals',
                fields: [
                    {
                        name: 'description',
                        type: 'richText',
                        label: 'Meals Description'
                    }
                ]
            },
            {
                label: 'Services Details',
                name: 'specs_services',
                fields: [
                    {
                        name: 'content',
                        type: 'richText',
                        label: 'Services Description'
                    }
                ]
            }
        ]
    },

    // === GALLERY (MOVE TO LAST) ===
    {
      name: 'gallery',
      label: 'Photo Gallery',
      type: 'array',
      minRows: 0,
      maxRows: 20,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
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
        description: 'Tour thuộc tenant nào',
      },
    },

    // === STATUS ===
    {
      name: 'isActive',
      label: 'Active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Hiển thị tour này trên website',
      },
    },
    {
      name: 'isFeatured',
      label: 'Featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Hiển thị trong danh sách featured tours',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        // Auto-generate slug from title if not provided
        if (data?.title && !data?.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        }

        // --- AUTO-EXTRACT DESTINATIONS & DURATION FROM ITINERARY ---
        if (data.itinerary && Array.isArray(data.itinerary)) {
            const destMap = new Map<string, number>(); // ID -> days count
            const uniqueOrder: string[] = [];

            data.itinerary.forEach((day: any) => {
                const locId = typeof day.location === 'object' ? day.location?.id : day.location;
                if (locId) {
                    if (!destMap.has(locId)) {
                        destMap.set(locId, 1);
                        uniqueOrder.push(locId);
                    } else {
                        destMap.set(locId, (destMap.get(locId) || 0) + 1);
                    }
                }
            });

            // Update top-level destinations array
            data.destinations = uniqueOrder.map(id => ({
                destination: id,
                duration_days: destMap.get(id)
            }));

            // CALCULATE DURATION
            const totalDays = data.itinerary.length;
            if (totalDays > 0) {
               const totalNights = totalDays > 1 ? totalDays - 1 : 0;
               data.duration = `${totalDays} Days / ${totalNights} Night${totalNights !== 1 ? 's' : ''}`;
            } else {
               data.duration = '';
            }
        } else {
            data.destinations = [];
            data.duration = '';
        }

        // --- INTELLIGENT ROUTE & TYPE GENERATION SCRIPT ---
        let effectiveCountries = data?.countries;
        if (operation === 'update' && typeof data?.countries === 'undefined') {
            effectiveCountries = originalDoc?.countries;
        }

        if (effectiveCountries && Array.isArray(effectiveCountries) && effectiveCountries.length > 0) {
            try {
                const countryIds = effectiveCountries
                    .map((c: any) => (typeof c === 'object' ? c?.id : c))
                    .filter((id: any) => id);
                
                if (countryIds.length > 0) {
                    const standardOrder = ['vietnam', 'cambodia', 'laos', 'thailand', 'myanmar'];
                    const countriesDocs = await req.payload.find({
                        collection: 'countries',
                        where: { id: { in: countryIds } },
                        pagination: false
                    });

                    if (countriesDocs.docs.length > 0) {
                        const sortedDocs = countriesDocs.docs.sort((a: any, b: any) => {
                            const idxA = standardOrder.indexOf(a.slug);
                            const idxB = standardOrder.indexOf(b.slug);
                            return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
                        });
                        
                        const countryNames = sortedDocs.map((c: any) => c.name);
                        const countrySlugs = sortedDocs.map((c: any) => c.slug);
                        
                        data.routeTitle = `${countryNames.join(' ')} Tours`; 
                        data.routeSlug = countrySlugs.join('-');
                        data.tourType = sortedDocs.length > 1 ? 'multi-country' : 'single-country';
                    } else {
                        data.routeTitle = '';
                        data.routeSlug = '';
                        data.tourType = 'single-country';
                    }
                } else {
                    data.routeTitle = '';
                    data.routeSlug = '';
                    data.tourType = 'single-country';
                }
            } catch (error) {
                console.error('Error generating route info:', error);
                data.routeTitle = '';
                data.routeSlug = '';
                data.tourType = 'single-country';
            }
        } else if (Array.isArray(effectiveCountries) && effectiveCountries.length === 0) {
             data.routeTitle = '';
             data.routeSlug = '';
             data.tourType = 'single-country';
        }

        return data
      },
    ],
  },
}

export default Tours
