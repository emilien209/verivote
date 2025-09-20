import { AppLayout } from '@/components/layout/app-layout';
import { AuthProvider } from '@/hooks/use-auth';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
        <AppLayout>
            {children}
        </AppLayout>
    </AuthProvider>
  );
}
