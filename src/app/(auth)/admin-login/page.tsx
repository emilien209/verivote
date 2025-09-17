'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useTransition } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { verifyAdmin } from '@/ai/flows/admin-verification';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    startTransition(async () => {
        const result = await verifyAdmin({ email, password });
        if (result.isAuthenticated) {
            localStorage.setItem('userRole', 'admin');
            router.push('/admin');
        } else {
            setError('Invalid admin credentials. Please try again.');
        }
    });
  };

  return (
    <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <Logo />
                </div>
            </div>
            <CardHeader className="text-left p-0">
                <CardTitle className="text-3xl font-bold">Admin Sign In</CardTitle>
                <CardDescription>
                Enter your administrative credentials to access the dashboard.
                </CardDescription>
            </CardHeader>
      
            <div className="grid gap-4 w-full">
                {error && (
                    <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Login Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <form onSubmit={handleLogin} className="grid gap-4">
                <div className="grid gap-2 text-left">
                    <Label htmlFor="email">Email</Label>
                    <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@verivote.gov"
                    required
                    disabled={isPending}
                    />
                </div>
                <div className="grid gap-2 text-left">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required disabled={isPending} />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                </Button>
                </form>
            </div>
            <div className="mt-4 text-center text-sm">
                Not an admin?{' '}
                <Link href="/login" className="underline">
                Go to Voter Login
                </Link>
            </div>
        </div>
    </div>
  );
}
