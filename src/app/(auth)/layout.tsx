import { LanguageProvider } from '@/contexts/language-context';

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
        <div className="hidden bg-muted lg:block bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-75">
          {/* This div is now the background, no image needed */}
        </div>
      </div>
    </LanguageProvider>
  );
}
