
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { handleAdminRegistration } from './actions';

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}

export default function AdminRegisterPage() {
  const [state, formAction] = useActionState(handleAdminRegistration, { success: false });

  return (
    <>
      <CardHeader className="text-center p-0">
        <CardTitle className="text-3xl font-bold">Admin Registration</CardTitle>
        <CardDescription>
          Create a new administrator account using a special code.
        </CardDescription>
      </CardHeader>

      <CardContent className="w-full">
        {state.success ? (
          <Alert>
            <AlertTitle>Admin Account Created!</AlertTitle>
            <AlertDescription>
              {state.message}
              <Button asChild className="mt-4 w-full">
                <Link href="/login">Proceed to Login</Link>
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <form action={formAction} className="grid gap-4 text-left">
            {state.error && (
              <Alert variant="destructive">
                <AlertTitle>Registration Failed</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="admin@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Create Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adminCode">Admin Code</Label>
              <Input id="adminCode" name="adminCode" type="password" required />
            </div>
            <SubmitButton>Register Admin</SubmitButton>
          </form>
        )}
      </CardContent>

      <div className="mt-4 text-center text-sm">
        Not an admin?{' '}
        <Link href="/register" className="underline">
          Go to Voter Registration
        </Link>
      </div>
    </>
  );
}
