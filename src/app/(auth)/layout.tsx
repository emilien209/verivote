'use client';

import { useState, useEffect } from 'react';
import { LanguageProvider } from '@/contexts/language-context';
import { AuthHeader } from './auth-header';

const backgroundImages = [
  'https://i.pinimg.com/736x/5f/0d/51/5f0d5165c129cde50b71166255464cf5.jpg',
  'https://i.pinimg.com/1200x/32/ce/25/32ce2569014b645285671dd76f4a5e0e.jpg',
  'https://i.pinimg.com/1200x/40/04/14/4004143546948c7e80b2782028a5ecc4.jpg',
  'https://i.pinimg.com/736x/a5/1e/73/a51e738739d5470cd2ca16e147ed5b43.jpg',
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <LanguageProvider>
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen relative">
        <AuthHeader />
        <main className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              {children}
            </div>
          </div>
        </main>
        <div className="relative hidden bg-muted lg:block">
          {backgroundImages.map((imageUrl, index) => (
            <div
              key={index}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
              style={{
                backgroundImage: `url('${imageUrl}')`,
                opacity: index === currentImageIndex ? 1 : 0,
              }}
            />
          ))}
        </div>
      </div>
    </LanguageProvider>
  );
}
