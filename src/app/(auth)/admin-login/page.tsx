'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useTransition } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

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
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user role from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && (userDoc.data().role === 'admin' || userDoc.data().role === 'official')) {
          const role = userDoc.data().role;
          localStorage.setItem('userRole', role);
          if (role === 'admin') {
            router.push('/admin');
          } else {
             router.push('/official/cast-vote');
          }
        } else {
          setError('Access denied. You are not an authorized administrator or official.');
        }
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          setError('Invalid credentials. Please try again.');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      }
    });
  };

  return (
    <div className="w-full">
        <CardHeader className="text-left p-0">
            <CardTitle className="text-3xl font-bold">Admin & Official Sign In</CardTitle>
            <CardDescription>
            Enter your assigned credentials to access your dashboard.
            </CardDescription>
        </CardHeader>
  
        <div className="grid gap-4 w-full mt-6">
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
             <Separator className="my-2" />
             <div className="text-center text-sm">
                Need to create the first admin account?{' '}
                <Link href="/register/admin" className="underline">
                Register as Admin
                </Link>
             </div>
        </div>
        <div className="mt-4 text-center text-sm">
            Not an admin or official?{' '}
            <Link href="/login" className="underline">
            Go to Voter Login
            </Link>
        </div>
    </div>
  );
}
