import { LanguageProvider } from '@/contexts/language-context';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <LanguageProvider>
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
        <main className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              {children}
            </div>
          </div>
        </main>
        <div 
          className="hidden bg-muted lg:block bg-cover bg-center"
          style={{ backgroundImage: "url('https://i.pinimg.com/736x/0e/61/6b/0e616b0cecf762bf5d1481f09f5fa808.jpg')" }}
        >
          {/* This div is now the background, no image needed */}
        </div>
      </div>
    </LanguageProvider>
  );
}
