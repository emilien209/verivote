'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Users, BookOpen, MessageSquare, Shield, UserPlus, UserRoundPlus, UserCog, HowToVote } from 'lucide-react';
import { Header } from './header';
import { useState, useEffect } from 'react';


const allNavLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, role: 'voter' },
    { href: '/candidates', label: 'Candidates', icon: <Users size={20} />, role: 'voter' },
    { href: '/guide', label: 'AI Guide', icon: <BookOpen size={20} />, role: 'voter' },
    { href: '/faq', label: 'FAQ Chatbot', icon: <MessageSquare size={20} />, role: 'voter' },
    { href: '/admin', label: 'Admin', icon: <Shield size={20} />, role: 'admin' },
    { href: '/admin/register-voter', label: 'Register Voter', icon: <UserPlus size={20} />, role: 'admin' },
    { href: '/admin/register-candidate', label: 'Register Candidate', icon: <UserRoundPlus size={20} />, role: 'admin' },
    { href: '/admin/manage-officials', label: 'Manage Officials', icon: <UserCog size={20} />, role: 'admin' },
    { href: '/official/cast-vote', label: 'Cast Vote', icon: <HowToVote size={20} />, role: 'official' },
    { href: '/candidates', label: 'Candidates', icon: <Users size={20} />, role: 'official' },
];

export function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [navLinks, setNavLinks] = useState(allNavLinks.filter(l => l.role === 'voter'));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole') || 'voter';
      setNavLinks(allNavLinks.filter(link => link.role === userRole));
    }
  }, [pathname]);

  if (!isClient) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navLinks.map((link, index) => (
                <SidebarMenuItem key={`${link.href}-${index}`}>
                  <Link href={link.href}>
                    <SidebarMenuButton
                      isActive={pathname === link.href}
                      tooltip={link.label}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Link href="/login">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <LogOut size={16} />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </Button>
            </Link>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <Header navLinks={navLinks} />
          <SidebarInset>
            <main className="flex-1 p-4 sm:p-6">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
