import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const SOURCE_ROOT = path.resolve(process.cwd(), 'capellatravel_website');
const TARGET_DIR = path.resolve(process.cwd(), 'public/images/migrated');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Map of Source Absolute Path -> Target Relative URL (e.g., /images/migrated/hash.jpg)
const imageMap = new Map<string, string>();

/**
 * Calculates MD5 hash of a file to detect duplicates
 */
function getFileHash(filePath: string): string {
  const buffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('md5');
  hash.update(buffer);
  return hash.digest('hex');
}

/**
 * Copies an image from source to target if it doesn't exist (by hash).
 * Returns the public URL path.
 */
export function migrateImage(sourcePath: string): string {
  // Normalize path
  const absoluteSourcePath = path.resolve(sourcePath);
  
  if (!fs.existsSync(absoluteSourcePath)) {
    console.warn(`[AssetMigrator] Image not found: ${absoluteSourcePath}`);
    return ''; // Or generic placeholder
  }

  // Check valid extensions
  const ext = path.extname(absoluteSourcePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) {
     console.warn(`[AssetMigrator] Skipping invalid extension: ${absoluteSourcePath}`);
     return '';
  }

  // Check cache
  if (imageMap.has(absoluteSourcePath)) {
    return imageMap.get(absoluteSourcePath)!;
  }

  const fileHash = getFileHash(absoluteSourcePath);
  const targetFilename = `${fileHash}${ext}`;
  const targetPath = path.join(TARGET_DIR, targetFilename);
  const publicUrl = `/images/migrated/${targetFilename}`;

  // Copy if target doesn't exist
  if (!fs.existsSync(targetPath)) {
    fs.copyFileSync(absoluteSourcePath, targetPath);
    console.log(`[AssetMigrator] Copied: ${path.basename(sourcePath)} -> ${targetFilename}`);
  }

  imageMap.set(absoluteSourcePath, publicUrl);
  return publicUrl;
}

/**
 * Finds the local path for a scraped URL structure.
 * Scraped structure often looks like: 
 * .../d2lwt6tidfiof0.cloudfront.net/images/filename.jpg
 * or relative paths in HTML.
 * 
 * We need to find the actual file on disk.
 * 
 * @param originHtmlPath - The full path of the HTML file where the image was referenced
 * @param imgSrc - The src attribute from the<img> tag
 */
export function resolveLocalImagePath(originHtmlPath: string, imgSrc: string): string | null {
  // If it's a full URL `https://d2lwt6tidfiof0.cloudfront.net/images/name.jpg`
  // The scrape folder structure usually mimics the domain.
  // e.g. capellatravel_website/www.asiatours.com:vietnam:tours/d2lwt6tidfiof0.cloudfront.net/images/name.jpg
  // OR capellatravel_website/www.asiatours.com/d2lwt6tidfiof0.cloudfront.net/images/name.jpg
  
  // Strategy: Search strictly known asset folders in the dump
  // The dump seems to have `d2lwt6tidfiof0.cloudfront.net` inside various directories.
  // We can try to locate the file by name if the path is complex.
  
  const filename = path.basename(imgSrc.split('?')[0]); // remove query params
  
  // Heuristic: Search recursively for this filename in SOURCE_ROOT
  // Note: This might be slow if we do it for every image. 
  // Optimization: We can index all images in SOURCE_ROOT once.
  return findFileInDir(SOURCE_ROOT, filename);
}

// Simple cache for filename -> list of full paths
const fileIndex = new Map<string, string[]>();
let isIndexed = false;

function indexFiles(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      indexFiles(fullPath);
    } else {
      const name = file.toLowerCase();
      if (!fileIndex.has(name)) {
        fileIndex.set(name, []);
      }
      fileIndex.get(name)!.push(fullPath);
    }
  }
}

function findFileInDir(rootDir: string, filename: string): string | null {
  if (!isIndexed) {
    console.log('[AssetMigrator] Indexing source files...');
    indexFiles(rootDir);
    isIndexed = true;
    console.log(`[AssetMigrator] Indexed ${fileIndex.size} unique filenames.`);
  }

  const hits = fileIndex.get(filename.toLowerCase());
  if (!hits || hits.length === 0) return null;
  
  // Return the first hit. In a perfect world, we'd match the parent folder too, 
  // but usually hash/filename is unique enough for assets like these.
  return hits[0];
}
