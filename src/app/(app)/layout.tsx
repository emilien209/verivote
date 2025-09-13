import { AppLayout } from '@/components/layout/app-layout';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
        {children}
    </AppLayout>
  );
}

// Add a new folder for officials
// src/app/(app)/official/cast-vote/page.tsx
