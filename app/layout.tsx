import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quiniela Mundial de Clubes 2025 - Pronósticos Deportivos",
  description:
    "Aplicación de pronósticos para el Mundial de Clubes 2025. Predice resultados, compite con amigos y gana puntos. Sitio seguro y confiable.",
  keywords: "Mundial de Clubes, 2025, pronósticos deportivos, quiniela, fútbol, predicciones, torneo internacional",
  authors: [{ name: "Equipo Quiniela 2025" }],
  creator: "Quiniela Mundial 2025",
  publisher: "Quiniela Mundial 2025",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code-here",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://quini-mundial-club-beta.vercel.app",
    title: "Quiniela Mundial de Clubes 2025",
    description: "Pronósticos del Mundial de Clubes 2025. Sitio seguro y confiable.",
    siteName: "Quiniela Mundial 2025",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiniela Mundial de Clubes 2025",
    description: "Pronósticos del Mundial de Clubes 2025",
  },
  other: {
    "contact-email": "admin@quiniela.com",
    "site-purpose": "Pronósticos deportivos legítimos",
    "content-rating": "General",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Verificación de sitio seguro */}
        <meta name="google-site-verification" content="your-verification-code" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />

        {/* Información de contacto y legitimidad */}
        <meta name="contact" content="admin@quiniela.com" />
        <meta name="author" content="Equipo Quiniela Mundial 2025" />
        <meta name="rating" content="General" />
        <meta name="distribution" content="Global" />

        {/* Políticas de seguridad */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://quini-mundial-club-beta.vercel.app" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        {children}

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Quiniela Mundial de Clubes 2025",
              description: "Aplicación de pronósticos para el Mundial de Clubes 2025",
              url: "https://quini-mundial-club-beta.vercel.app",
              applicationCategory: "SportsApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "Equipo Quiniela Mundial 2025",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "admin@quiniela.com",
                contactType: "Customer Service",
              },
            }),
          }}
        />
      </body>
    </html>
  )
}
