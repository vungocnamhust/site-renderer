import { NextRequest, NextResponse } from 'next/server'

// Static file extensions that should not be rewritten
const STATIC_FILE_EXTENSIONS = [
  '.css', '.js', '.mjs', '.json',
  '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.mp4', '.webm', '.ogg', '.mp3', '.wav',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx',
  '.map', '.txt', '.xml', '.rss', '.atom'
]

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const rootDomain = process.env.ROOT_DOMAIN || 'localhost:3000'
  const pathname = request.nextUrl.pathname
  
  // Debug logging - remove after testing
  console.log('[Middleware] hostname:', hostname)
  console.log('[Middleware] rootDomain:', rootDomain)
  console.log('[Middleware] pathname:', pathname)
  
  // Check if the pathname is a static file
  const isStaticFile = STATIC_FILE_EXTENSIONS.some(ext => pathname.toLowerCase().endsWith(ext))
  
  // Skip for static assets, API routes, admin panel, and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/css') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/js') ||
    isStaticFile
  ) {
    console.log('[Middleware] Skipping static file:', pathname)
    return NextResponse.next()
  }

  // Extract subdomain from hostname
  // e.g., "test.privatetour.asia" -> "test"
  // e.g., "test.localhost:3000" -> "test"
  const hostnameWithoutPort = hostname.split(':')[0]
  const rootDomainWithoutPort = rootDomain.split(':')[0]
  
  // Check if this is a subdomain request
  if (hostnameWithoutPort.endsWith(`.${rootDomainWithoutPort}`)) {
    const subdomain = hostnameWithoutPort.replace(`.${rootDomainWithoutPort}`, '')
    
    if (subdomain && subdomain !== 'www') {
      // Rewrite to /sites/[subdomain]/[...path]
      // Note: Folders starting with _ are ignored by Next.js
      const url = request.nextUrl.clone()
      url.pathname = `/sites/${subdomain}${pathname}`
      console.log('[Middleware] Rewriting to:', url.pathname)
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
