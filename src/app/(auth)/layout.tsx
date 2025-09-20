'use client';

import { LanguageProvider } from '@/contexts/language-context';
import { AuthHeader } from './auth-header';


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <LanguageProvider>
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen relative">
        <AuthHeader />
        <main className="flex items-center justify-center py-12 z-10">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center bg-card/80 backdrop-blur-sm p-8 rounded-lg border border-border/20">
              {children}
            </div>
          </div>
        </main>
        <div className="hidden lg:block">
          {/* This space is now filled by the global background */}
        </div>
      </div>
    </LanguageProvider>
  );
}
