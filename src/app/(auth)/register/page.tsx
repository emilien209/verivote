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
import { useTranslation } from '@/hooks/use-translation';

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { t } = useTranslation();


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
        <CardTitle className="text-3xl font-bold">{t('register.title')}</CardTitle>
        <CardDescription>
          {t('register.description')}
        </CardDescription>
      </CardHeader>

      {error && (
          <Alert variant="destructive" className="mb-4 text-left">
          <AlertTitle>{t('register.error.title')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          </Alert>
      )}
      {success ? (
        <Alert>
          <AlertTitle>{t('register.success.title')}</AlertTitle>
          <AlertDescription>
            {t('register.success.description')}
            <Button asChild className="mt-4 w-full">
              <Link href="/login">{t('register.success.button')}</Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="grid gap-2">
              <Label htmlFor="firstName">{t('register.form.firstName.label')}</Label>
              <Input id="firstName" name="firstName" placeholder={t('register.form.firstName.placeholder')} required disabled={isPending} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">{t('register.form.lastName.label')}</Label>
              <Input id="lastName" name="lastName" placeholder={t('register.form.lastName.placeholder')} required disabled={isPending} />
            </div>
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="nationalId">{t('register.form.nationalId.label')}</Label>
            <Input id="nationalId" name="nationalId" placeholder={t('register.form.nationalId.placeholder')} required disabled={isPending} />
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="email">{t('register.form.email.label')}</Label>
            <Input id="email" name="email" type="email" placeholder={t('register.form.email.placeholder')} required disabled={isPending} />
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="password">{t('register.form.password.label')}</Label>
            <Input id="password" name="password" type="password" required disabled={isPending} />
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="confirmPassword">{t('register.form.confirmPassword.label')}</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required disabled={isPending} />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('register.form.submit')}
          </Button>
        </form>
      )}
      
      <div className="mt-4 text-center text-sm">
        {t('register.have_account')}{' '}
        <Link href="/login" className="underline">
            {t('register.login_button')}
        </Link>
      </div>
    </>
  );
}
