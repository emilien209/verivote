import { Logo } from '@/components/logo';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const authImage = PlaceHolderImages.find(p => p.id === 'auth-background');

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
             <div className="flex justify-center items-center gap-2 mb-4">
                <Logo />
            </div>
            {children}
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {authImage && (
            <Image
                src={authImage.imageUrl}
                alt="Voting background"
                fill
                className="object-cover dark:brightness-[0.2] dark:grayscale"
                data-ai-hint={authImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-primary/60" />
        <div className="absolute inset-0 flex flex-col items-start justify-end p-12 text-primary-foreground">
            <h1 className="text-4xl font-bold">Secure, Transparent, and Accessible Voting for All.</h1>
            <p className="mt-4 text-lg">VeriVote is the official platform for the Republic of Rwanda's national elections.</p>
        </div>
      </div>
    </div>
  );
}
