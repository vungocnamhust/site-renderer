import React from 'react'
import './styles.css'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
        <link href="/css/asiatours/main.css" rel="stylesheet" />
        <link href="/css/asiatours/icon.css" rel="stylesheet" />
        <link href="/css/asiatours/slick.css" rel="stylesheet" />
        <link href="/css/asiatours/custom.css" rel="stylesheet" />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
