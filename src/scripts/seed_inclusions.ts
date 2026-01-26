
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs'
import path from 'path'

// Helper to download image if needed, or use existing media
const downloadImage = async (payload: any, url: string, filename: string) => {
    // Check if exists
    console.log(`Checking image: ${filename}`);
    const existing = await payload.find({
        collection: 'media',
        where: {
            filename: { equals: filename }
        }
    });
    if (existing.docs.length > 0) return existing.docs[0].id;

    // Download
    try {
        console.log(`Downloading: ${url}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Save temp
        const tempPath = path.join('/tmp', filename);
        fs.writeFileSync(tempPath, buffer);

        const media = await payload.create({
            collection: 'media',
            data: {
                alt: filename,
            },
            file: {
                path: tempPath,
                name: filename,
                size: buffer.length,
                mimetype: response.headers.get('content-type') || 'image/jpeg',
            },
        });
        
        fs.unlinkSync(tempPath);
        return media.id;
    } catch (e) {
        console.error(`Failed to download ${url}`, e);
        return null;
    }
}

const seedInclusions = async () => {
  const payload = await getPayload({ config })

  console.log('Seeding Inclusions Data...')

  // 0. Get fallback media
  let fallbackId = null;
  const fallbackMedia = await payload.find({ collection: 'media', limit: 1 });
  if (fallbackMedia.docs.length > 0) {
      fallbackId = fallbackMedia.docs[0].id;
      console.log(`Using fallback media ID: ${fallbackId}`);
  } else {
      console.warn('No media found for fallback. Seeding might fail if images download fails.');
  }

  // 1. Find the Tour
  const tours = await payload.find({
    collection: 'tours',
    where: {
        slug: { equals: 'cheerful-vietnam-family-tour' }
    }
  });

  if (tours.docs.length === 0) {
      console.error('Tour not found! Run seed_cheerful_tour_detailed.ts first.');
      process.exit(1);
  }

  const tourId = tours.docs[0].id;

  // 2. Create Experiences
  const experiencesData = [
      {
          title: 'Hanoi Street Food Tour',
          slug: 'hanoi-street-food-tour',
          location: 'Hanoi',
          country: 'vietnam',
          description: 'Taste the best local dishes in the Old Quarter.',
          imageUrl: 'https://d2lwt6tidfiof0.cloudfront.net/uploads/photo-tour/cheerful-vietnam-family-tour-2187-1389-570.jpg'
      },
      {
          title: 'Halong Bay Kayaking',
          slug: 'halong-bay-kayaking',
          location: 'Halong Bay',
          country: 'vietnam',
          description: 'Explore the hidden caves and lagoons of Halong Bay by kayak.',
          imageUrl: 'https://d2lwt6tidfiof0.cloudfront.net/uploads/slide/bana-hil6l-1565603169.jpg'
      },
      {
          title: 'Hoi An Lantern Making',
          slug: 'hoi-an-lantern-making',
          location: 'Hoi An',
          country: 'vietnam',
          description: 'Learn how to make traditional colorful lanterns.',
          imageUrl: 'https://d2lwt6tidfiof0.cloudfront.net/uploads/slide/1154324-1758274642.jpg'
      }
  ];

  const experienceIds = [];
  for (const exp of experiencesData) {
      let imgId = await downloadImage(payload, exp.imageUrl, `${exp.slug}.jpg`);
      if (!imgId) imgId = fallbackId;

      const existing = await payload.find({
          collection: 'experiences',
          where: { slug: { equals: exp.slug } }
      });

      if (existing.docs.length > 0) {
          experienceIds.push(existing.docs[0].id);
      } else {
          try {
            const newExp = await payload.create({
                collection: 'experiences',
                data: {
                    title: exp.title,
                    slug: exp.slug,
                    description: exp.description,
                    location: exp.location,
                    country: exp.country as any,
                    image: imgId,
                    content: { 
                        root: { 
                            type: 'root',
                            format: '',
                            indent: 0,
                            version: 1,
                            direction: 'ltr',
                            children: [{ 
                                type: 'paragraph',
                                version: 1,
                                children: [{ text: exp.description, version: 1 }] 
                            }] 
                        } 
                    }
                }
            });
            experienceIds.push(newExp.id);
          } catch (e) {
              console.error(`Failed to create experience ${exp.title}`, e);
          }
      }
  }

  // 3. Prepare Hotel Images
  const hotelImages = {
      'Bonsella Hotel': 'https://d2lwt6tidfiof0.cloudfront.net/uploads/photo/bonsella-hotel-162-820-440.jpg',
      'Tirant Hotel': 'https://d2lwt6tidfiof0.cloudfront.net/uploads/photo/tirant-hotel-220-820-440.jpg',
      'Hotel de l’Opera Hanoi': 'https://d2lwt6tidfiof0.cloudfront.net/uploads/photo/hotel-de-lopera-hanoi-269-820-440.jpg',
      'Sena Cruise': 'https://d2lwt6tidfiof0.cloudfront.net/uploads/photo/sena-cruise-sena-cruise-halong-1694401764.jpg',
      'Peony Cruise': 'https://d2lwt6tidfiof0.cloudfront.net/uploads/photo/peony-cruise-imgpsh_fullsize_anim-1667987516.jpg',
      'Ambassador Cruise': 'https://d2lwt6tidfiof0.cloudfront.net/uploads/photo/ambassador-cruise-ambassador-cruise-Ambassador-Cruise-1653574742 (1)-1660903827.jpg',
      'Vinh Hung Riverside': 'https://d2lwt6tidfiof0.cloudfront.net/uploads/photo/vinh-hung-riverside-resort-spa-384-820-440.jpg',
      'Hotel Royal Hoi An': 'https://d2lwt6tidfiof0.cloudfront.net/uploads/photo/royal-hoian-mgallery-by-sofitel-801-820-440.jpg',
      'Sanouva Saigon': 'https://d2lwt6tidfiof0.cloudfront.net/uploads/photo/sanouva-saigon-hotel-64-820-440.jpg',
      'Liberty Central': 'https://d2lwt6tidfiof0.cloudfront.net/uploads/photo/liberty-central-saigon-citypoint-963-820-440.jpg',
      'Rex Hotel': 'https://d2lwt6tidfiof0.cloudfront.net/uploads/photo/rex-hotel-799-820-440.jpg',
      'Cam Ranh Riviera': 'https://d2lwt6tidfiof0.cloudfront.net/uploads/photo/cam-ranh-riviera-beach-resort-spa-787-820-440.jpeg'
  };

  const hotelImageIds: Record<string, string> = {};
  for (const [name, url] of Object.entries(hotelImages)) {
      const filename = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.jpg';
      let id = await downloadImage(payload, url, filename);
      if (!id) id = fallbackId;
      if (id) hotelImageIds[name] = id;
  }

  // 4. Update Tour
  try {
    await payload.update({
        collection: 'tours',
        id: tourId,
        data: {
            specs_accommodation: {
                items: [
                {
                    day_title: 'Day 1: Hanoi',
                    options: [
                        {
                            hotel_name: 'Bonsella Hotel',
                            hotel_grade: 'Economy',
                            star_rating: 3,
                            review_count: 1156,
                            trip_advisor_url: 'https://www.tripadvisor.com/Hotel_Review-g293924-d12347998-Reviews-Bonsella_Hotel-Hanoi.html',
                            image: hotelImageIds['Bonsella Hotel'],
                            description: 'Located in No 3 Bao Khanh Lane, Hoan Kiem Dist, from the hotel, you can easily reach the Hoan Kiem Lake...'
                        },
                        {
                            hotel_name: 'Tirant Hotel',
                            hotel_grade: 'Deluxe',
                            star_rating: 4,
                            review_count: 1013,
                            image: hotelImageIds['Tirant Hotel'],
                            description: 'Tirant Hotel is situated in the heart of Hanoi’s finest cultural landmark...'
                        },
                        {
                            hotel_name: 'Hotel de l’Opera Hanoi',
                            hotel_grade: 'Luxury',
                            star_rating: 5,
                            review_count: 1988,
                            image: hotelImageIds['Hotel de l’Opera Hanoi'],
                            description: 'Situated in the center of Hanoi, Hotel de l\'Opera is close to Hanoi\'s Opera House...'
                        }
                    ]
                },
                {
                    day_title: 'Day 3: Halong Bay',
                    options: [
                         {
                            hotel_name: 'Sena Cruise',
                            hotel_grade: 'Economy',
                            star_rating: 4,
                            review_count: 49,
                            image: hotelImageIds['Sena Cruise'],
                            description: 'Managed by Swan Cruises, Sena Cruise is the little sister who finds her own way on the pristine Lan Ha Bay...'
                        },
                        {
                            hotel_name: 'Peony Cruise',
                            hotel_grade: 'Deluxe',
                            star_rating: 5,
                            review_count: 323,
                            image: hotelImageIds['Peony Cruise'],
                            description: 'Peony Cruise is the ninth and the newest luxury cruise of Pelican Group...'
                        },
                        {
                            hotel_name: 'Ambassador Cruise',
                            hotel_grade: 'Luxury',
                            star_rating: 5,
                            review_count: 407,
                            image: hotelImageIds['Ambassador Cruise'],
                            description: 'Launched in November 2018, Ambassador Cruise has been affirmed its notable reputation...'
                        }
                    ]
                },
                {
                    day_title: 'Day 4: Hoi An',
                    options: [
                         {
                            hotel_name: 'Vinh Hung Riverside Resort & Spa',
                            hotel_grade: 'Deluxe',
                            star_rating: 4,
                            review_count: 2097,
                            image: hotelImageIds['Vinh Hung Riverside'],
                            description: 'Located on the bank of the romantic Thu Bon River...'
                        },
                        {
                            hotel_name: 'Hotel Royal Hoi An- MGallery',
                            hotel_grade: 'Luxury',
                            star_rating: 5,
                            review_count: 1709,
                            image: hotelImageIds['Hotel Royal Hoi An'],
                            description: 'Hoi An means "peaceful meeting place", and Hotel Royal Hoi An captures the essence...'
                        }
                    ]
                },
                {
                    day_title: 'Day 8: Ho Chi Minh',
                    options: [
                        {
                            hotel_name: 'Sanouva Saigon Hotel',
                            hotel_grade: 'Economy',
                            star_rating: 3,
                            image: hotelImageIds['Sanouva Saigon'],
                            description: 'Right next to Ben Thanh market right in the heart of the city...'
                        },
                         {
                            hotel_name: 'Liberty Central Saigon Citypoint',
                            hotel_grade: 'Deluxe',
                            star_rating: 4,
                            review_count: 2996,
                            image: hotelImageIds['Liberty Central'],
                            description: 'Located in the lovely area of District 1...'
                        },
                        {
                            hotel_name: 'Rex Saigon Hotel',
                            hotel_grade: 'Luxury',
                            star_rating: 5,
                            review_count: 3066,
                            image: hotelImageIds['Rex Hotel'],
                            description: 'Strategically located at the best of downtown Saigon...'
                        }
                    ]
                },
                 {
                    day_title: 'Day 11: Nha Trang',
                    options: [
                        {
                            hotel_name: 'Cam Ranh Riviera Beach Resort & Spa',
                            hotel_grade: 'Luxury',
                            star_rating: 5,
                            image: hotelImageIds['Cam Ranh Riviera'],
                            description: 'Cam Ranh Riviera Beach Resort & Spa is an ideal choice for families seeking a relaxing beachfront getaway...'
                        }
                    ]
                }
            ]
            },
            specs_transport: {
                 content: {
                     root: { 
                         type: 'root',
                         format: '',
                         indent: 0,
                         version: 1,
                         direction: 'ltr',
                         children: [
                              { type: 'heading', tag: 'h3', version: 1, children: [{ text: 'Transport:', version: 1 }] },
                              { type: 'paragraph', version: 1, children: [{ text: 'Car, Walking, Cruise', version: 1 }] },
                              { type: 'heading', tag: 'h3', version: 1, children: [{ text: 'Flight: 3 FLIGHTS', version: 1 }] },
                              { type: 'list', tag: 'ol', listType: 'number', version: 1, children: [
                                  { type: 'listitem', version: 1, children: [{ text: 'Fly from Hanoi to Danang (1 hour 20 minutes)', version: 1 }] },
                                  { type: 'listitem', version: 1, children: [{ text: 'Flight from Danang to Ho Chi Minh (1 hour 30 minutes)', version: 1 }] },
                                  { type: 'listitem', version: 1, children: [{ text: 'Flight from Ho Chi Minh to Nha Trang (1 hour)', version: 1 }] }
                              ]},
                              { type: 'paragraph', version: 1, children: [{ text: '*Note: Airfares are valid at the time of quotation and subject to change...', version: 1 }] }
                         ]
                     }
                 }
            },
            specs_team: {
                 content: {
                     root: {
                         type: 'root',
                         format: '',
                         indent: 0,
                         version: 1, 
                         direction: 'ltr',
                         children: [
                             { type: 'heading', tag: 'h3', version: 1, children: [{ text: 'Team: Private Guide, Driver and Trip Managing Experts', version: 1 }] },
                             { type: 'paragraph', version: 1, children: [{ text: 'Travelling with us means having a dedicated, friendly & professional team by your side...', version: 1 }] }
                         ]
                     }
                 }
            },
            specs_meals: {
                description: {
                    root: { 
                         type: 'root',
                         format: '',
                         indent: 0,
                         version: 1,
                         direction: 'ltr',
                         children: [
                             { type: 'heading', tag: 'h3', version: 1, children: [{ text: 'Meals: 21 Meals', version: 1 }] },
                             { type: 'paragraph', version: 1, children: [{ text: '13 Breakfasts, 6 Lunches, 2 Dinners', version: 1 }] },
                             { type: 'paragraph', version: 1, children: [{ text: '(*)Our itinerary takes you on the traditional restaurants...', version: 1 }] }
                         ]
                    }
                 }
            },
            specs_services: {
                content: {
                    root: { 
                         type: 'root',
                         format: '',
                         indent: 0,
                         version: 1,
                         direction: 'ltr',
                         children: [
                             { type: 'heading', tag: 'h3', version: 1, children: [{ text: 'Services', version: 1 }] },
                             { type: 'list', tag: 'ul', listType: 'bullet', version: 1, children: [
                                 { type: 'listitem', version: 1, children: [{ text: 'Entrance fees, excursions, visa, water...', version: 1 }] },
                                 { type: 'listitem', version: 1, children: [{ text: 'Accommodation with daily breakfast', version: 1 }] },
                                 { type: 'listitem', version: 1, children: [{ text: 'Private car or shared vehicle...', version: 1 }] },
                                 { type: 'listitem', version: 1, children: [{ text: 'Airport transfers by private car', version: 1 }] }
                             ]}
                         ]
                     }
                 }
            },
            specs_experiences: {
                items: experienceIds
            }
        } as any
    });
  } catch(e) {
      console.error('Error updating tour:', e);
  }

  console.log('Done!');
  process.exit(0);
}

seedInclusions();
