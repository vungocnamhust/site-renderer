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
        name: 'districts',
        type: 'array',
        label: 'Districts / Cities List (Auto-calculated)',
        admin: {
            readOnly: true,
            description: 'Danh sách các Thành phố/Vùng đi qua (Hanoi, Halong, Bangkok...)'
        },
        fields: [
            {
                name: 'district',
                type: 'relationship',
                relationTo: 'districts',
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
        name: 'destinations',
        type: 'relationship',
        relationTo: 'destinations',
        hasMany: true,
        label: 'Detailed Destinations / Spots (Auto-calculated)',
        admin: {
            readOnly: true,
            description: 'Danh sách các danh thắng, điểm tham quan chi tiết (Vịnh Hạ Long, Nhà Thờ Lớn...)'
        }
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
          label: 'Price (USD) (Auto)',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Tự động lấy giá thấp nhất từ Tour Price Tiers',
            width: '50%',
            position: 'sidebar',
          },
        },
      ],
    },
    {
      name: 'priceNote',
      label: 'Price Note (Auto)',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Tự động tạo từ giá thấp nhất (VD: "From $1,500 per person")',
      },
    },
    {
        name: 'videoUrl',
        type: 'text',
        label: 'Highlight Video URL'
    },
    {
      name: 'tourTiers',
      type: 'array',
      label: 'Tour Price Tiers (Configuration)',
      admin: {
          description: 'Định nghĩa các hạng vé cho tour này (VD: Standard, Deluxe). Các hạng này sẽ được dùng để cấu hình dịch vụ trong lịch trình.'
      },
      fields: [
        { 
          name: 'code', 
          type: 'select', 
          required: true, 
          label: 'Tier Type', 
          options: [
            { label: 'Economy / 3-Star', value: 'economy' },
            { label: 'Deluxe / 4-Star', value: 'deluxe' },
            { label: 'Luxury / 5-Star', value: 'luxury' }
          ],
          admin: { width: '50%' } 
        },
        { name: 'name', type: 'text', required: true, label: 'Display Name (e.g. Indochina Standard)', admin: { width: '50%' } },
        { name: 'price', type: 'number', label: 'Base Price (USD)', admin: { width: '50%' } },
        { name: 'description', type: 'textarea', label: 'Tier Description' }
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
            name: 'cityLocations',
            label: 'Cities (Auto-generated)',
            type: 'relationship',
            relationTo: 'districts',
            hasMany: true,
            admin: {
              readOnly: true,
              description: 'Tự động tổng hợp Thành phố từ các dịch vụ'
            }
        },
        {
            name: 'destinations',
            label: 'Spots / Destinations (Auto-generated)',
            type: 'relationship',
            relationTo: 'destinations',
            hasMany: true,
            admin: {
              readOnly: true,
              description: 'Tự động tổng hợp các danh thắng từ các dịch vụ'
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
                    name: 'service', // Default Service
                    label: 'Primary Service (Default)',
                    type: 'relationship',
                    relationTo: 'services',
                    required: true,
                    admin: { description: 'Dịch vụ mặc định cho hạng thấp nhất hoặc chuẩn chung' }
                },
                {
                    name: 'tierOverrides',
                    label: 'Tier Specific Overrides',
                    type: 'array',
                    fields: [
                        {
                            name: 'tiers',
                            label: 'Apply for Tiers',
                            type: 'select',
                            hasMany: true,
                            options: [
                                { label: 'Economy', value: 'economy' },
                                { label: 'Deluxe', value: 'deluxe' },
                                { label: 'Luxury', value: 'luxury' }
                            ], 
                            required: true
                        },
                        {
                            name: 'service',
                            label: 'Override Service',
                            type: 'relationship',
                            relationTo: 'services',
                            required: true
                        }
                    ],
                    admin: {
                        description: 'Chọn dịch vụ khác cho các hạng vé cao cấp hơn (VD: Luxury dùng khách sạn 5 sao còn Standard dùng 3 sao)'
                    }
                },
                {
                    name: 'alternatives',
                    label: 'Optional Upgrades / Alternatives',
                    type: 'array',
                    fields: [
                         {
                            name: 'name',
                            type: 'text',
                            label: 'Option Name',
                            required: true
                         },
                         {
                            name: 'service',
                            type: 'relationship',
                            relationTo: 'services',
                            required: true
                         },
                         {
                            name: 'priceModifier',
                            type: 'number',
                            label: 'Price Diff (+/-)'
                         }
                    ]
                }
            ]
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
        if (data.itinerary !== undefined) {
            if (Array.isArray(data.itinerary) && data.itinerary.length > 0) {
                // 1. Collect all service IDs
                const allServiceIds = new Set<string>();
                
                const collectServiceId = (s: any) => {
                    if (!s) return;
                    // Primary Service
                    if (s.service) {
                         const id = typeof s.service === 'object' ? s.service?.id : s.service;
                         if (id) allServiceIds.add(id);
                    }
                    // Tier Overrides
                    if (s.tierOverrides && Array.isArray(s.tierOverrides)) {
                        s.tierOverrides.forEach((o: any) => {
                            const id = typeof o.service === 'object' ? o.service?.id : o.service;
                            if (id) allServiceIds.add(id);
                        });
                    }
                    // Alternatives
                    if (s.alternatives && Array.isArray(s.alternatives)) {
                        s.alternatives.forEach((a: any) => {
                            const id = typeof a.service === 'object' ? a.service?.id : a.service;
                            if (id) allServiceIds.add(id);
                        });
                    }
                };

                data.itinerary.forEach((day: any) => {
                  if (day.services && Array.isArray(day.services)) {
                    day.services.forEach(collectServiceId);
                  }
                });

                // 2. Fetch services to get their location hierarchy
                let serviceDistrictMap = new Map<string, string>(); // Service ID -> District ID
                let serviceSpotMap = new Map<string, string>();    // Service ID -> Destination ID
                
                if (allServiceIds.size > 0) {
                  const servicesDocs = await req.payload.find({
                    collection: 'services',
                    where: { id: { in: Array.from(allServiceIds) } },
                    limit: 0,
                    pagination: false,
                  });
                  servicesDocs.docs.forEach((s: any) => {
                    const distId = typeof s.district === 'object' ? s.district?.id : s.district;
                    if (distId) serviceDistrictMap.set(s.id, distId);
                    
                    const spotId = typeof s.destination === 'object' ? s.destination?.id : s.destination;
                    if (spotId) serviceSpotMap.set(s.id, spotId);
                  });
                }

                // 3. Process each day to set its locations
                const districtCountMap = new Map<string, number>(); 
                const uniqueDistOrder: string[] = [];
                const allUniqueSpots = new Set<string>();

                data.itinerary.forEach((day: any) => {
                  const dayDistricts = new Set<string>();
                  const daySpots = new Set<string>();
                  
                  if (day.services && Array.isArray(day.services)) {
                    day.services.forEach((s: any) => {
                        const sIds: string[] = [];
                        if (s.service) sIds.push(typeof s.service === 'object' ? s.service.id : s.service);
                        if (s.tierOverrides) s.tierOverrides.forEach((o: any) => sIds.push(typeof o.service === 'object' ? o.service.id : o.service));
                        if (s.alternatives) s.alternatives.forEach((a: any) => sIds.push(typeof a.service === 'object' ? a.service.id : a.service));

                        sIds.forEach(id => {
                            const d = serviceDistrictMap.get(id);
                            if (d) dayDistricts.add(d);
                            const sp = serviceSpotMap.get(id);
                            if (sp) daySpots.add(sp);
                        });
                    });
                  }
                  
                  // Set auto-generated locations for the day
                  day.cityLocations = Array.from(dayDistricts);
                  day.destinations = Array.from(daySpots);

                  // Update overall tour hierarchy
                  dayDistricts.forEach(distId => {
                    if (!districtCountMap.has(distId)) {
                        districtCountMap.set(distId, 1);
                        uniqueDistOrder.push(distId);
                    } else {
                        districtCountMap.set(distId, (districtCountMap.get(distId) || 0) + 1);
                    }
                  });
                  daySpots.forEach(spotId => allUniqueSpots.add(spotId));
                });

                // 4. Update top-level fields
                data.districts = uniqueDistOrder.map(id => ({
                    district: id,
                    duration_days: districtCountMap.get(id)
                }));
                data.destinations = Array.from(allUniqueSpots);

                // 5. Calculate Duration
                const totalDays = data.itinerary.length;
                const totalNights = totalDays > 1 ? totalDays - 1 : 0;
                data.duration = `${totalDays} Days / ${totalNights} Night${totalNights !== 1 ? 's' : ''}`;
            } else {
                // Itinerary was cleared or is empty
                data.districts = [];
                data.destinations = [];
                data.duration = '';
            }
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

        // --- AUTO-GENERATE PRICE & PRICE NOTE FROM TOUR TIERS ---
        if (data.tourTiers && Array.isArray(data.tourTiers) && data.tourTiers.length > 0) {
            const prices = data.tourTiers
                .map((tier: any) => tier.price)
                .filter((p: any) => typeof p === 'number' && p > 0);
            
            if (prices.length > 0) {
                const minPrice = Math.min(...prices);
                data.price = minPrice;
                data.priceNote = `From $${minPrice.toLocaleString()} per person`;
            }
        }

        return data
      },
    ],
  },
}

export default Tours
