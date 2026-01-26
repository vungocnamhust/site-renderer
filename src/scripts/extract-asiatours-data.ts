import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { migrateImage, resolveLocalImagePath } from './helpers/asset-migrator';

// --- Configuration ---
const SOURCE_ROOT = path.resolve(process.cwd(), 'capellatravel_website');
const OUTPUT_DIR = path.resolve(process.cwd(), 'src/scripts/data');

// Ensure output dir
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// --- Types ---
interface TourData {
  title: string;
  slug: string;
  duration: string; // e.g. "7 Days"
  price: string;
  overview: string;
  image: string; // public URL
  countryRef: string; // inferred from folder or breadcrumb
  link: string; // original link
}

interface PageData {
  slug: string; // e.g. "vietnam", "thailand-vietnam"
  title: string;
  introTitle: string;
  introContent: string;
  bannerImage: string;
  metaTitle: string;
  metaDescription: string;
}

// --- State ---
const tours: TourData[] = [];
const pages: PageData[] = [];
const processedSlugs = new Set<string>();

// --- Helpers ---
function cleanText(text: string | null | undefined): string {
  return text ? text.trim().replace(/\s+/g, ' ') : '';
}

function extractSlugFromUrl(url: string): string {
  // e.g. https://www.asiatours.com/tours/vietnam/classic-vietnam-7-days.html -> classic-vietnam-7-days
  // e.g. /tours/vietnam-cambodia/ -> vietnam-cambodia
  const parts = url.split('/').filter(p => p && !p.endsWith('.html'));
  return parts[parts.length - 1] || 'unknown';
}

/**
 * Main function to walk directories and find index.html files that look like Listing Pages
 */
function walkAndParse(dir: string) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    // console.log('Checking:', fullPath); // Too noisy, only log htmls
    
    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch (e) {
      console.warn('Skipping (stat error):', fullPath);
      continue;
    }

    if (stat.isDirectory()) {
        walkAndParse(fullPath);
    } else if (file === 'index.html') {
      console.log('Found index.html:', fullPath);
      parseHtmlFile(fullPath);
    }
  }
}

/**
 * Analyze an HTML file to see if it's a Country/Multi-Country listing page
 */
function parseHtmlFile(filePath: string) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  // 1. Identify Page Type
  // Listing pages usually have `.banner-top-country`
  const bannerEl = doc.querySelector('.banner-top-country') || doc.querySelector('.banner-top-country-st2');
  
  if (!bannerEl) {
     const title = doc.querySelector('title')?.textContent || '';
     // Fallback: if title contains "Tours", might be a listing.
     if (!title.includes('Tours')) return;
  }

  console.log(`[Parser] Processing: ${filePath}`);

  // --- Extract Page Data ---
  const titleEl = doc.querySelector('.wrap-title-top-country h1');
  const bannerBgEl = doc.querySelector('.background-country'); // img tag
  const introTitleEl = doc.querySelector('.wrap-mini-intro h2'); 
  const introContentEl = doc.querySelector('.wrap-mini-intro .content-intro') || doc.querySelector('.wrap-mini-intro .paragraph');
  const canonicalEl = doc.querySelector('link[rel="canonical"]');

  const pageUrl = canonicalEl?.getAttribute('href') || filePath;
  let pageSlug = 'unknown';
  if (pageUrl.includes('/tours/')) {
    const parts = pageUrl.split('/tours/')[1].split('/');
    pageSlug = parts[0] || parts[1]; // handle trailing slash
  } else if (pageUrl.includes('.com/')) {
      const parts = pageUrl.split('.com/')[1].split('/');
      pageSlug = parts[0];
  }
  
  if (pageSlug === '' || pageSlug === 'index.html') pageSlug = cleanText(titleEl?.textContent).toLowerCase().replace(/ /g, '-').replace('tours', '').replace('welcome-to-', '');

  // Image Migration
  let bannerImgUrl = '';
  if (bannerBgEl) {
    const src = bannerBgEl.getAttribute('src');
    if (src) {
      const localPath = resolveLocalImagePath(filePath, src);
      if (localPath) {
        bannerImgUrl = migrateImage(localPath);
      }
    }
  }

  const pageData: PageData = {
    slug: pageSlug,
    title: cleanText(titleEl?.textContent),
    introTitle: cleanText(introTitleEl?.textContent) || "Welcome",
    introContent: introContentEl ? cleanText(introContentEl.innerHTML) : '',
    bannerImage: bannerImgUrl,
    metaTitle: cleanText(doc.title),
    metaDescription: cleanText(doc.querySelector('meta[name="description"]')?.getAttribute('content')),
  };

  if (!pages.find(p => p.slug === pageSlug) && pageData.title) {
      pages.push(pageData);
  }

  // --- Extract Tours ---
  // Try multiple selectors for tour cards
  // 1. .trip-st2 (Standard Grid)
  // 2. .big-first-tour-box (Featured List)
  const tripCards = [
      ...Array.from(doc.querySelectorAll('.trip-st2')), 
      ...Array.from(doc.querySelectorAll('.big-first-tour-box'))
  ];
  
  tripCards.forEach((card) => {
    // Title
    const titleLink = card.querySelector('h3 a') || card.querySelector('h2 a');
    if (!titleLink) return;

    const rawTitle = cleanText(titleLink.textContent);
    const linkHref = titleLink.getAttribute('href') || '';
    const tourSlug = linkHref.replace('.html', '').split('/').pop() || '';

    if (processedSlugs.has(tourSlug)) return; 

    // Duration
    const durationEl = card.querySelector('.day-trip b') || card.querySelector('.day-trip span b'); // <b>14</b> or <span><b>14</b>Days</span>
    
    // Price
    const priceEl = card.querySelector('.price-trip-box strong') || card.querySelector('.foot-trip strong');
    
    // Overview
    const overviewEl = card.querySelector('.content-trip .paragraph') || card.querySelector('.box-hidden p') || card.querySelector('.body-box .paragraph');
    
    // Image
    // Note: In big-first-tour-box, img often has `data-img` for lazy load, and src="#"
    const imgEl = card.querySelector('.view-all-img img') || card.querySelector('.img-box-st2 img');

    let tourImgUrl = '';
    if (imgEl) {
      let src = imgEl.getAttribute('data-img') || imgEl.getAttribute('src');
      if (src === '#' && imgEl.getAttribute('data-img')) src = imgEl.getAttribute('data-img');
      
      if (src && src !== '#') {
        const localPath = resolveLocalImagePath(filePath, src);
        if (localPath) {
          tourImgUrl = migrateImage(localPath);
        }
      }
    }

    const tourData: TourData = {
      title: rawTitle,
      slug: tourSlug,
      duration: cleanText(durationEl?.textContent),
      price: cleanText(priceEl?.textContent),
      overview: cleanText(overviewEl?.textContent),
      image: tourImgUrl,
      countryRef: pageSlug,
      link: linkHref
    };

    tours.push(tourData);
    processedSlugs.add(tourSlug);
  });
}

// --- Execution ---
console.log('Starting Extraction...');
walkAndParse(SOURCE_ROOT);

console.log(`Extraction Complete.`);
console.log(`Found ${pages.length} Pages.`);
console.log(`Found ${tours.length} Tours.`);

// Write JSON
fs.writeFileSync(path.join(OUTPUT_DIR, 'pages_data.json'), JSON.stringify(pages, null, 2));
fs.writeFileSync(path.join(OUTPUT_DIR, 'tours_data.json'), JSON.stringify(tours, null, 2));

console.log(`Data saved to ${OUTPUT_DIR}`);
