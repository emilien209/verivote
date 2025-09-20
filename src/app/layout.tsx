'use client';
import { useState, useEffect } from 'react';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"

const backgroundImages = [
  'https://i.pinimg.com/736x/5f/0d/51/5f0d5165c129cde50b71166255464cf5.jpg',
  'https://i.pinimg.com/1200x/32/ce/25/32ce2569014b645285671dd76f4a5e0e.jpg',
  'https://i.pinimg.com/1200x/40/04/14/4004143546948c7e80b2782028a5ecc4.jpg',
  'https://i.pinimg.com/736x/a5/1e/73/a51e738739d5470cd2ca16e147ed5b43.jpg',
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>VeriVote - National Online Voting Platform</title>
        <meta name="description" content="A secure and transparent online voting platform for modern democracy." />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <div className="relative min-h-screen">
          {backgroundImages.map((imageUrl, index) => (
            <div
              key={index}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
              style={{
                backgroundImage: `url('${imageUrl}')`,
                opacity: index === currentImageIndex ? 1 : 0,
                zIndex: -1,
              }}
            />
          ))}
          <div className="relative z-10">
            {children}
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
