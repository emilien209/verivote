'use client';

import Link from 'next/link';
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
import { checkUserRecognition } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { verifyAdmin } from '@/ai/flows/admin-verification';

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;


    startTransition(async () => {
      if(isAdminLogin) {
        const email = formData.get('email') as string;
        const result = await verifyAdmin({ email, password });
        if (result.isAuthenticated) {
          router.push('/admin');
        } else {
          setError('Invalid admin credentials.');
        }
      } else {
        const nationalId = formData.get('national-id') as string;
        const result = await checkUserRecognition(nationalId);
        if (result.success && result.data?.isRecognized && result.data.user) {
          localStorage.setItem('voterName', `${result.data.user.firstName} ${result.data.user.lastName}`);
          router.push('/dashboard');
        } else if (result.success && !result.data?.isRecognized) {
          setError('This National ID is not recognized. Please contact an administrator to register.');
        }
        else {
          setError(result.error || 'An unknown error occurred during verification.');
        }
      }
    });
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{isAdminLogin ? 'Admin Login' : 'Voter Login'}</CardTitle>
        <CardDescription>
          {isAdminLogin ? 'Enter your admin credentials' : 'Enter your National ID to login to your account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
            <Alert variant="destructive" className="mb-4">
            <AlertTitle>Login Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <form onSubmit={handleLogin} className="grid gap-4">
          {isAdminLogin ? (
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                disabled={isPending}
              />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="national-id">National ID</Label>
              <Input
                id="national-id"
                name="national-id"
                type="text"
                placeholder="1234567890123456"
                required
                disabled={isPending}
              />
            </div>
          )}
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input id="password" name="password" type="password" required disabled={isPending} />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Button variant="link" onClick={() => setIsAdminLogin(!isAdminLogin)}>
            {isAdminLogin ? 'Login as Voter' : 'Login as Admin'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
