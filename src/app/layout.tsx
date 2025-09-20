'use client';
import { useState, useEffect } from 'react';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"

const backgroundImages = [
  'https://i.pinimg.com/736x/67/8a/11/678a111e86c7be4313d1942f41b589bd.jpg',
  'https://i.pinimg.com/736x/6b/09/c2/6b09c2a958beb4de2febe42f246c4c52.jpg',
  'https://i.pinimg.com/736x/75/2b/3d/752b3de0c1242f3680a77daa1f73c1f8.jpg',
  'https://i.pinimg.com/736x/53/df/a3/53dfa36cf9ca9e5c0739a7b38f229c28.jpg',
  'https://i.pinimg.com/736x/61/50/a3/6150a34aa5b5526f52e4db0e1b28400a.jpg',
  'https://i.pinimg.com/736x/27/95/ce/2795cee6efc8ca65318c530e3e36e94a.jpg',
  'https://i.pinimg.com/736x/07/fc/34/07fc343df06f4c445f31aa467dcc6cff.jpg'
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
