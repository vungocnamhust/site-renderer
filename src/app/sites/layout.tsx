import Script from 'next/script'

export const metadata = {
  title: 'Asia Tours - Private Tours & Tailor-Made Travel',
  description: 'Award-winning travel company offering professional, safe, hassle free and best Asia Private tours',
}

export default function SitesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="shortcut icon" type="image/ico" href="https://d2lwt6tidfiof0.cloudfront.net/images/favicon.ico" />
        
        {/* Google Fonts */}
        <link href="https://fonts.googleapis.com/css?family=Montserrat:200,300,400,500,600,700|Reenie+Beanie&display=swap" rel="stylesheet" />
        
        {/* AsiaTours CSS - Original Styles */}
        <link rel="stylesheet" type="text/css" href="/css/asiatours/icon.css" />
        <link rel="stylesheet" type="text/css" href="/css/asiatours/slick.css" />
        <link rel="stylesheet" type="text/css" href="/css/asiatours/main.css" />
        <link rel="stylesheet" type="text/css" href="/css/asiatours/custom.css" />
      </head>
      <body>
        {children}
        
        {/* jQuery - Required for slick and custom.js */}
        <Script 
          src="https://code.jquery.com/jquery-3.7.1.min.js"
          strategy="beforeInteractive"
        />
        
        {/* Slick Slider */}
        <Script 
          src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"
          strategy="afterInteractive"
        />
        
        {/* Define global variables */}
        <Script id="global-vars" strategy="beforeInteractive">
          {`
            var SITE_URL = '';
            var SITE_URL_IMG = 'https://d2lwt6tidfiof0.cloudfront.net/images/';
          `}
        </Script>
      </body>
    </html>
  )
}
