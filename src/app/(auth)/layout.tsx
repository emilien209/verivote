
import { Logo } from '@/components/logo';
import Image from 'next/image';
import { LanguageProvider } from '@/contexts/language-context';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <LanguageProvider>
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-1 xl:min-h-screen">
        <main className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <div className="flex justify-center items-center gap-2 mb-4">
                  <Logo />
              </div>
              {children}
            </div>
          </div>
        </main>
      </div>
    </LanguageProvider>
  );
}
