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
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="grid w-full grid-cols-1 items-center gap-6 md:grid-cols-2">
        <div className="relative hidden h-screen md:block">
            {authImage && (
                 <Image
                    src={authImage.imageUrl}
                    alt="Voting background"
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint={authImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-primary/60" />
            <div className="absolute inset-0 flex flex-col items-start justify-end p-12 text-primary-foreground">
                <h1 className="text-4xl font-bold">Secure, Transparent, and Accessible Voting for All.</h1>
                <p className="mt-4 text-lg">VeriVote is the official platform for the Republic of Rwanda's national elections.</p>
            </div>
        </div>

        <div className="mx-auto grid w-full max-w-sm gap-6 px-4">
           <div className="grid gap-4 text-center">
             <div className="flex justify-center items-center gap-2 mb-4">
                <Logo />
            </div>
            {children}
           </div>
        </div>
      </div>
    </div>
  );
}
