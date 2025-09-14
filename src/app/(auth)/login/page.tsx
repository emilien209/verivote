'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useTransition } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { verifyAdmin } from '@/ai/flows/admin-verification';
import { verifyOfficial } from '@/ai/flows/official-verification';
import { verifyVoterLogin } from '../voter-actions';
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
      // Role is determined by email/password combo, checking in order of privilege
      
      // 1. Admin check
      const adminResult = await verifyAdmin({ email, password });
      if (adminResult.isAuthenticated) {
        localStorage.setItem('userRole', 'admin');
        router.push('/admin');
        return;
      }
      
      // 2. Official check
      const officialResult = await verifyOfficial({ email, password });
      if (officialResult.isAuthenticated) {
        localStorage.setItem('userRole', 'official');
        router.push('/official/cast-vote');
        return;
      }

      // 3. Voter check
      const voterResult = await verifyVoterLogin({ email, password });
      if (voterResult.isAuthenticated) {
         if (voterResult.status === 'approved') {
            localStorage.setItem('userRole', 'voter');
            localStorage.setItem('voterName', voterResult.name || '');
            router.push('/dashboard');
            return;
         } else if (voterResult.status === 'pending') {
            setError(t('login.error.pending'));
            return;
         } else {
            setError(t('login.error.rejected'));
            return;
         }
      }
      
      // If no role matches
      setError(t('login.error.invalid'));
    });
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t('login.title')}</CardTitle>
        <CardDescription>
          {t('login.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
            <Alert variant="destructive" className="mb-4">
            <AlertTitle>{t('login.error.title')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2">
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
          <div className="grid gap-2">
            <Label htmlFor="password">{t('login.form.password.label')}</Label>
            <Input id="password" name="password" type="password" required disabled={isPending} />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('login.form.submit')}
          </Button>
        </form>
        <Separator className="my-6" />
         <div className="text-center">
            <p className="text-sm text-muted-foreground">
                {t('login.admin_official_info')}
            </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{t('login.no_account')}</p>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/register">{t('login.register_button')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
