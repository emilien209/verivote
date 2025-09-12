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
import { LogOut } from 'lucide-react';
import { Header } from './header';

type NavLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export function AppLayout({
  children,
  navLinks,
}: {
  children: React.ReactNode;
  navLinks: NavLink[];
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
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
