import { AppLayout } from '@/components/layout/app-layout';
import { LayoutDashboard, Users, BookOpen, MessageSquare, Shield } from 'lucide-react';

const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { href: '/candidates', label: 'Candidates', icon: <Users size={20} /> },
    { href: '/guide', label: 'AI Guide', icon: <BookOpen size={20} /> },
    { href: '/faq', label: 'FAQ Chatbot', icon: <MessageSquare size={20} /> },
    { href: '/admin', label: 'Admin', icon: <Shield size={20} /> },
]

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout navLinks={navLinks}>
        {children}
    </AppLayout>
  );
}
