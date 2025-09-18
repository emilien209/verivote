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
import { useTranslation } from '@/hooks/use-translation';

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

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

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData.role;
          const status = userData.status;
          
          localStorage.setItem('userRole', role);

          if (role === 'admin') {
            router.push('/admin');
          } else if (role === 'official') {
            router.push('/official/cast-vote');
          } else if (role === 'voter') {
             if (status === 'approved') {
                localStorage.setItem('voterName', userData.fullName || '');
                router.push('/dashboard');
             } else if (status === 'pending') {
                setError(t('login.error.pending'));
             } else {
                setError(t('login.error.rejected'));
             }
          } else {
             setError(t('login.error.invalid'));
          }
        } else {
          // This case should ideally not happen if registration is handled correctly
          setError(t('login.error.no_role'));
        }
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          setError(t('login.error.invalid'));
        } else {
          setError(err.message);
        }
      }
    });
  };

  return (
    <>
      <div className="text-left w-full">
        <CardTitle className="text-3xl font-bold">{t('login.title')}</CardTitle>
        <CardDescription>
          {t('login.description')}
        </CardDescription>
      </div>
      
      <div className="grid gap-4 w-full">
        {error && (
            <Alert variant="destructive" className="mb-4">
            <AlertTitle>{t('login.error.title')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2 text-left">
            <Label htmlFor="email">{t('login.form.email.label')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t('login.form.email.placeholder')}
              required
              disabled={isPending}
            />
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="password">{t('login.form.password.label')}</Label>
            <Input id="password" name="password" type="password" required disabled={isPending} />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('login.form.submit')}
          </Button>
        </form>
        <Separator className="my-2" />
         <div className="text-center">
            <p className="text-xs text-muted-foreground">
                {t('login.admin_official_info')}
            </p>
        </div>
      </div>
      <div className="mt-4 text-center text-sm">
        {t('login.no_account')}{' '}
        <Link href="/register" className="underline">
          {t('login.register_button')}
        </Link>
      </div>
      <div className="mt-2 text-center text-xs">
        <Link href="/register/admin" className="underline text-muted-foreground">
          Admin Registration
        </Link>
      </div>
    </>
  );
}
