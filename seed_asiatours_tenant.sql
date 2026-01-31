-- Seed Dynamic Tenant for AsiaTours.com
-- Template: AsiaTourWeb (asia-tours-travel-web)

DO $$
DECLARE
    tenant_id INTEGER;
    logo_id INTEGER;
    hero_image_id INTEGER;
    vietnam_image_id INTEGER;
    cambodia_image_id INTEGER;
    thailand_image_id INTEGER;
    laos_image_id INTEGER;
BEGIN
    -- 1. Ensure Media exist (Placeholders for seed)
    -- Insert Logo
    INSERT INTO media (alt, filename, url, created_at, updated_at)
    VALUES ('Asia Tours Logo', 'asiatours_logo.svg', 'https://d2lwt6tidfiof0.cloudfront.net/images/asiatours_logo.svg', NOW(), NOW())
    ON CONFLICT (filename) DO UPDATE SET url = EXCLUDED.url
    RETURNING id INTO logo_id;

    -- Insert Hero Background
    INSERT INTO media (alt, filename, url, created_at, updated_at)
    VALUES ('Asia Tours Hero', 'asia-tours-1.webp', 'https://d2lwt6tidfiof0.cloudfront.net/images/background/asia-tours-1.webp', NOW(), NOW())
    ON CONFLICT (filename) DO UPDATE SET url = EXCLUDED.url
    RETURNING id INTO hero_image_id;

    -- Insert placeholders for styles and experiences
    INSERT INTO media (alt, filename, url, created_at, updated_at)
    VALUES ('Classic Tours', 'classic.webp', 'https://d2lwt6tidfiof0.cloudfront.net/images/migrated/eb2565d14807c5884be244c251c49778.webp', NOW(), NOW())
    ON CONFLICT (filename) DO UPDATE SET url = EXCLUDED.url
    RETURNING id INTO vietnam_image_id;

    INSERT INTO media (alt, filename, url, created_at, updated_at)
    VALUES ('Cambodia Experience', 'cambodia.webp', 'https://d2lwt6tidfiof0.cloudfront.net/images/migrated/6621017d1c2e6fc179d23235480c6bd6.webp', NOW(), NOW())
    ON CONFLICT (filename) DO UPDATE SET url = EXCLUDED.url
    RETURNING id INTO cambodia_image_id;

    INSERT INTO media (alt, filename, url, created_at, updated_at)
    VALUES ('Thailand Experience', 'thailand.webp', 'https://d2lwt6tidfiof0.cloudfront.net/images/migrated/6ae689bdaf240f588bfbf3366b927e46.webp', NOW(), NOW())
    ON CONFLICT (filename) DO UPDATE SET url = EXCLUDED.url
    RETURNING id INTO thailand_image_id;
    
    INSERT INTO media (alt, filename, url, created_at, updated_at)
    VALUES ('Laos Experience', 'laos.webp', 'https://d2lwt6tidfiof0.cloudfront.net/images/migrated/48e5efdbae2e289d322aca6fd8c9da64.webp', NOW(), NOW())
    ON CONFLICT (filename) DO UPDATE SET url = EXCLUDED.url
    RETURNING id INTO laos_image_id;

    -- 2. Insert Main Tenant
    INSERT INTO tenants (
        name, 
        subdomain, 
        is_active, 
        template_id, 
        seo_title, 
        seo_description, 
        content_asia_tours_travel_web_site_settings_site_name,
        content_asia_tours_travel_web_site_settings_logo_id,
        content_asia_tours_travel_web_site_settings_contact_phone,
        content_asia_tours_travel_web_site_settings_contact_email,
        content_asia_tours_travel_web_loc_exp_stats_countries,
        content_asia_tours_travel_web_loc_exp_stats_destinations,
        content_asia_tours_travel_web_loc_exp_stats_experiences,
        content_asia_tours_travel_web_loc_exp_stats_reviews,
        content_asia_tours_travel_web_loc_exp_stats_guests,
        content_asia_tours_travel_web_footer_about_text,
        content_asia_tours_travel_web_footer_copyright,
        created_at, 
        updated_at
    ) VALUES (
        'Asia Tours', 
        'asiatours', 
        true, 
        'asia-tours-travel-web', 
        'Asia Tours | Best Private Asia Tours & Vacation Packages', 
        'Discover the best of Asia with our curated private tours. We specialize in Vietnam, Cambodia, Thailand, and Laos.',
        'Asia Tours',
        logo_id,
        '(+84) 916 952 668',
        'experts@asiatours.com',
        '18',
        '316',
        '900+',
        '98%',
        '20,000+',
        'We are proudly recommended by National Geographic, The Washington Post, CNN Travel...',
        'Copyright © 2026. Asia Tours Co., Ltd',
        NOW(),
        NOW()
    )
    ON CONFLICT (subdomain) DO UPDATE SET 
        name = EXCLUDED.name,
        template_id = EXCLUDED.template_id,
        updated_at = NOW()
    RETURNING id INTO tenant_id;

    -- 3. Clear existing related data for this tenant (Idempotent seed)
    DELETE FROM tenants_content_asia_tours_travel_web_hero_section_slides WHERE _parent_id = tenant_id;
    DELETE FROM tenants_content_asia_tours_travel_web_navigation WHERE _parent_id = tenant_id;
    DELETE FROM tenants_content_asia_tours_travel_web_best_support WHERE _parent_id = tenant_id;
    DELETE FROM tenants_content_asia_tours_travel_web_footer_social_links WHERE _parent_id = tenant_id;
    DELETE FROM tenants_content_asia_tours_travel_web_tour_styles WHERE _parent_id = tenant_id;
    DELETE FROM tenants_content_asia_tours_travel_web_unique_experiences WHERE _parent_id = tenant_id;
    DELETE FROM tenants_content_asia_tours_travel_web_faqs WHERE _parent_id = tenant_id;

    -- 4. Hero Slides
    INSERT INTO tenants_content_asia_tours_travel_web_hero_section_slides (_order, _parent_id, id, image_id, title, subtitle, link, link_text)
    VALUES (1, tenant_id, 'hero-1', hero_image_id, 'Indochina Splendors', 'Cambodia - Laos - Vietnam | 21 Days', '/vietnam-cambodia-laos', 'View Itinerary');

    -- 5. Navigation
    -- Top level items
    INSERT INTO tenants_content_asia_tours_travel_web_navigation (_order, _parent_id, id, label, href)
    VALUES 
    (1, tenant_id, 'nav-best-tours', 'Best Tours', '/best-tours'),
    (2, tenant_id, 'nav-destinations', 'Destinations', '#'),
    (3, tenant_id, 'nav-travel-theme', 'Travel Themes', '/travel-themes'),
    (4, tenant_id, 'nav-travel-guide', 'Travel Guide', '/travel-guide'),
    (5, tenant_id, 'nav-about-us', 'About Us', '/about-us');

    -- Sub-navigation for Destinations
    INSERT INTO tenants_content_asia_tours_travel_web_navigation_children (_order, _parent_id, id, label, href)
    VALUES 
    (1, 'nav-destinations', 'sub-vietnam', 'Vietnam Tours', '/vietnam'),
    (2, 'nav-destinations', 'sub-cambodia', 'Cambodia Tours', '/cambodia'),
    (3, 'nav-destinations', 'sub-thailand', 'Thailand Tours', '/thailand'),
    (4, 'nav-destinations', 'sub-laos', 'Laos Tours', '/laos'),
    (5, 'nav-destinations', 'sub-multi', 'Multi-country Tours', '/multi-country');

    -- 6. Why Us (Best Support)
    INSERT INTO tenants_content_asia_tours_travel_web_best_support (_order, _parent_id, id, title, description)
    VALUES 
    (1, tenant_id, 'sup-1', 'Reliable Travel Expert', '24/7 dedicated support from our local experts.'),
    (2, tenant_id, 'sup-2', 'Private & Tailor-made', 'Your trip, your way. Perfectly customized itineraries.'),
    (3, tenant_id, 'sup-3', 'Local Experience', 'Go beyond the tourist trails with authentic encounters.');

    -- 7. Social Links
    INSERT INTO tenants_content_asia_tours_travel_web_footer_social_links (_order, _parent_id, id, platform, url)
    VALUES 
    (1, tenant_id, 'soc-fb', 'facebook', 'https://www.facebook.com/asiatours'),
    (2, tenant_id, 'soc-ins', 'instagram', 'https://www.instagram.com/asiatours'),
    (3, tenant_id, 'soc-tr', 'tripadvisor', 'https://www.tripadvisor.com/asiatours');

    -- 8. Tour Styles
    INSERT INTO tenants_content_asia_tours_travel_web_tour_styles (_order, _parent_id, id, title, description, link, image_id)
    VALUES 
    (1, tenant_id, 'style-1', 'Classic Tours', 'Experience the must-see highlights of Asia.', '/tours/classic', vietnam_image_id),
    (2, tenant_id, 'style-2', 'Honeymoon & Romance', 'Celebrate your love in the most romantic spots.', '/tours/honeymoon', cambodia_image_id),
    (3, tenant_id, 'style-3', 'Family Adventures', 'Fun and educational trips for the whole family.', '/tours/family', thailand_image_id);

    -- 9. Unique Experiences
    INSERT INTO tenants_content_asia_tours_travel_web_unique_experiences (_order, _parent_id, id, title, location, country, description, image_id)
    VALUES 
    (1, tenant_id, 'exp-1', 'Overnight on Halong Bay', 'Halong Bay', 'Vietnam', 'Cruise through the mythical limestone islands.', vietnam_image_id),
    (2, tenant_id, 'exp-2', 'Sunrise at Angkor Wat', 'Siem Reap', 'Cambodia', 'Witness the magic of the ancient temples at dawn.', cambodia_image_id),
    (3, tenant_id, 'exp-3', 'Authentic Thai Cooking', 'Chiang Mai', 'Thailand', 'Learn the secrets of Thai cuisine from local chefs.', thailand_image_id);

    -- 10. FAQs
    INSERT INTO tenants_content_asia_tours_travel_web_faqs (_order, _parent_id, id, question, answer)
    VALUES 
    (1, tenant_id, 'faq-1', 'Do I need a visa for Vietnam?', 'Most travelers need a visa, but many countries are now eligible for e-visas.'),
    (2, tenant_id, 'faq-2', 'When is the best time to visit Southeast Asia?', 'The dry season from November to April is generally considered the best time.'),
    (3, tenant_id, 'faq-3', 'Is it safe to travel in Indochina?', 'Yes, Southeast Asia is generally very safe for tourists, but standard precautions apply.');

END $$;
