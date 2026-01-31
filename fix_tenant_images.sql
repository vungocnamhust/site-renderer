DO $$
DECLARE
    tenant_id INTEGER;
    fallback_image_id INTEGER;
BEGIN
    -- 1. Get asiatours tenant ID
    SELECT id INTO tenant_id FROM tenants WHERE subdomain = 'asiatours' LIMIT 1;
    
    IF tenant_id IS NULL THEN
        RAISE NOTICE 'Tenant asiatours not found';
        RETURN;
    END IF;

    -- 2. Ensure we have at least one media for fallback
    SELECT id INTO fallback_image_id FROM media WHERE filename = 'asia-tours-1.webp' LIMIT 1;
    
    IF fallback_image_id IS NULL THEN
        INSERT INTO media (alt, filename, url, created_at, updated_at)
        VALUES ('Asia Tours Fallback', 'asia-tours-1.webp', 'https://d2lwt6tidfiof0.cloudfront.net/images/background/asia-tours-1.webp', NOW(), NOW())
        RETURNING id INTO fallback_image_id;
    END IF;

    -- 3. Update missing images in related tables
    UPDATE tenants_content_asia_tours_travel_web_tour_styles 
    SET image_id = fallback_image_id 
    WHERE _parent_id = tenant_id AND image_id IS NULL;

    UPDATE tenants_content_asia_tours_travel_web_unique_experiences 
    SET image_id = fallback_image_id 
    WHERE _parent_id = tenant_id AND image_id IS NULL;

    RAISE NOTICE 'Fixed missing images for tenant %', tenant_id;
END $$;
