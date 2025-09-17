import { Logo } from '@/components/logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="mx-auto grid w-[380px] gap-6 px-4">
           <div className="grid gap-4 text-center">
             <div className="flex justify-center items-center gap-2 mb-4">
                <Logo />
            </div>
            {children}
           </div>
        </div>
    </div>
  );
}
