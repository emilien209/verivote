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
import { verifyOfficial } from '@/ai/flows/official-verification';

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isOfficialLogin, setIsOfficialLogin] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;


    startTransition(async () => {
      const email = formData.get('email') as string;
      const nationalId = formData.get('national-id') as string;

      // Admin check first, as they are a special type of official
      const adminResult = await verifyAdmin({ email, password });
      if (adminResult.isAuthenticated) {
        localStorage.setItem('userRole', 'admin');
        router.push('/admin');
        return;
      }
      
      if(isOfficialLogin) {
        const result = await verifyOfficial({ email, password });
        if (result.isAuthenticated) {
          localStorage.setItem('userRole', 'official');
          // Redirect officials to a specific dashboard or a generic one
          // For now, let's direct them to the main voter dashboard as an example
          router.push('/dashboard');
        } else {
          setError('Invalid official credentials.');
        }
      } else {
        const result = await checkUserRecognition(nationalId);
        if (result.success && result.data?.isRecognized && result.data.user) {
          localStorage.setItem('voterName', `${result.data.user.firstName} ${result.data.user.lastName}`);
          localStorage.setItem('userRole', 'voter');
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
        <CardTitle className="text-2xl">{isOfficialLogin ? 'Official Login' : 'Voter Login'}</CardTitle>
        <CardDescription>
          {isOfficialLogin ? 'Enter your official credentials to log in' : 'Enter your National ID to log in and vote'}
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
          {isOfficialLogin ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="official@example.com"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required disabled={isPending} />
              </div>
            </>
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
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Button variant="link" onClick={() => setIsOfficialLogin(!isOfficialLogin)}>
            {isOfficialLogin ? 'Login as Voter' : 'Login as Official'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
