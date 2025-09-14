'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
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
import Link from 'next/link';
import { handleVoterRegistration } from '../voter-actions';

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const nationalId = formData.get('nationalId') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    const fullName = `${firstName} ${lastName}`;

    startTransition(async () => {
      const result = await handleVoterRegistration({ firstName, lastName, fullName, nationalId, email, password });
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'An unexpected error occurred.');
      }
    });
  };

  return (
    <>
      <CardHeader className="text-center p-0">
        <CardTitle className="text-3xl font-bold">Voter Registration</CardTitle>
        <CardDescription>
          Enter your information to create an account.
        </CardDescription>
      </CardHeader>

      {error && (
          <Alert variant="destructive" className="mb-4 text-left">
          <AlertTitle>Registration Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          </Alert>
      )}
      {success ? (
        <Alert>
          <AlertTitle>Registration Submitted!</AlertTitle>
          <AlertDescription>
            Your registration is pending approval. You will be able to log in once an administrator has approved your account.
            <Button asChild className="mt-4 w-full">
              <Link href="/login">Back to Login</Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" placeholder="John" required disabled={isPending} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" placeholder="Doe" required disabled={isPending} />
            </div>
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="nationalId">National ID</Label>
            <Input id="nationalId" name="nationalId" placeholder="1234567890123456" required disabled={isPending} />
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="name@example.com" required disabled={isPending} />
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required disabled={isPending} />
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required disabled={isPending} />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Register
          </Button>
        </form>
      )}
      
      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="underline">
            Login
        </Link>
      </div>
    </>
  );
}
