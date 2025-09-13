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
import { LogOut, Shield, UserRoundPlus, UserCog, Vote, Users } from 'lucide-react';
import { Header } from './header';
import { useState, useEffect } from 'react';


const allNavLinks = [
    { href: '/admin', label: 'Admin Dashboard', icon: <Shield size={20} />, role: 'admin' },
    { href: '/admin/register-candidate', label: 'Register Candidate', icon: <UserRoundPlus size={20} />, role: 'admin' },
    { href: '/admin/manage-officials', label: 'Manage Officials', icon: <UserCog size={20} />, role: 'admin' },
    { href: '/official/cast-vote', label: 'Cast Vote', icon: <Vote size={20} />, role: 'official' },
    { href: '/candidates', label: 'Candidates', icon: <Users size={20} />, role: 'official' },
    { href: '/candidates', label: 'Candidates', icon: <Users size={20} />, role: 'admin' },
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
      const userRole = localStorage.getItem('userRole') || 'official';
      const relevantLinks = allNavLinks.filter(link => link.role === userRole);
      
      // Remove duplicate links (e.g. Candidates for admin/official)
      const uniqueLinks = relevantLinks.filter((link, index, self) =>
        index === self.findIndex((l) => (
          l.href === link.href && l.label === link.label
        ))
      );

      setNavLinks(uniqueLinks);
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
