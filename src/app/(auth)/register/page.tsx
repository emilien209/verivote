'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useActionState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Camera, Phone } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { handleVoterPhotoRegistration, handlePhoneRegistration, handlePhoneVerification } from './actions';
import { useFormStatus } from 'react-dom';

type RegistrationType = 'photo' | 'phone';

function SubmitButton({ children, formAction }: { children: React.ReactNode, formAction?: any }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" formAction={formAction} className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}

function PhotoRegistrationForm() {
  const [state, formAction] = useActionState(handleVoterPhotoRegistration, { success: false });
  const [idPhotoPreview, setIdPhotoPreview] = useState<string | null>(null);
  const [locationPhotoPreview, setLocationPhotoPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setPreview: (url: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  if (state.success) {
    return (
        <Alert>
            <AlertTitle>Registration Successful!</AlertTitle>
            <AlertDescription>
            {state.message} Your account has been created and approved.
            <Button asChild className="mt-4 w-full">
                <Link href="/login">Proceed to Login</Link>
            </Button>
            </AlertDescription>
        </Alert>
    );
  }

  return (
    <form action={formAction} className="grid gap-4 text-left">
      {state.error && (
        <Alert variant="destructive">
          <AlertTitle>Registration Failed</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Create Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="idPhoto">Upload Identity Card</Label>
        <Input id="idPhoto" name="idPhoto" type="file" accept="image/*" required 
          onChange={(e) => handleFileChange(e, setIdPhotoPreview)} />
        {idPhotoPreview && <img src={idPhotoPreview} alt="ID Preview" className="mt-2 h-24 w-auto rounded-md border" />}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="locationPhoto">Upload Proof of Voting Location</Label>
        <Input id="locationPhoto" name="locationPhoto" type="file" accept="image/*" required 
           onChange={(e) => handleFileChange(e, setLocationPhotoPreview)} />
        {locationPhotoPreview && <img src={locationPhotoPreview} alt="Location Preview" className="mt-2 h-24 w-auto rounded-md border" />}
      </div>
      <SubmitButton>Register with Photos</SubmitButton>
    </form>
  );
}

function PhoneRegistrationForm() {
  const [state, formAction] = useActionState(handlePhoneRegistration, { success: false, step: 'initial' });
  const [verificationState, verificationAction] = useActionState(handlePhoneVerification, state);

  if (verificationState.success) {
    return (
       <Alert>
            <AlertTitle>Registration Complete!</AlertTitle>
            <AlertDescription>
            {verificationState.message}
            <Button asChild className="mt-4 w-full">
                <Link href="/login">Proceed to Login</Link>
            </Button>
            </AlertDescription>
        </Alert>
    )
  }

  if (state.step === 'verify' || verificationState.step === 'verify' ) {
    const currentState = verificationState.error ? verificationState : state;
    return (
        <form action={verificationAction} className="grid gap-4 text-left">
            <input type="hidden" name="phone" value={currentState.phone} />
            <input type="hidden" name="email" value={currentState.email} />
            <input type="hidden" name="expectedCode" value={currentState.mockCode} />
            <Alert>
                <AlertTitle>Check your phone!</AlertTitle>
                <AlertDescription>We've sent a verification code to {currentState.phone}. For this prototype, the code is: {currentState.mockCode}</AlertDescription>
            </Alert>
             {currentState.error && (
                <Alert variant="destructive">
                    <AlertTitle>Verification Failed</AlertTitle>
                    <AlertDescription>{currentState.error}</AlertDescription>
                </Alert>
            )}
            <div className="grid gap-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input id="code" name="code" placeholder="123456" required />
            </div>
            <SubmitButton>Confirm Code</SubmitButton>
        </form>
    );
  }

  return (
    <form action={formAction} className="grid gap-4 text-left">
      {state.error && (
        <Alert variant="destructive">
          <AlertTitle>Registration Failed</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" name="phone" type="tel" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Create Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <SubmitButton>Register with Phone</SubmitButton>
    </form>
  );
}


export default function RegisterPage() {
  const [registrationType, setRegistrationType] = useState<RegistrationType | null>(null);
  const { t } = useTranslation();

  return (
    <>
      <CardHeader className="text-center p-0">
        <CardTitle className="text-3xl font-bold">{t('register.title')}</CardTitle>
        <CardDescription>
          {registrationType ? "Complete the fields below to create your account." : "Choose your registration method."}
        </CardDescription>
      </CardHeader>

      <CardContent className="w-full">
        {!registrationType ? (
          <RadioGroup defaultValue={registrationType || undefined} onValueChange={(value: RegistrationType) => setRegistrationType(value)} className="grid grid-cols-1 gap-4">
            <div>
              <RadioGroupItem value="photo" id="r1" className="peer sr-only" />
              <Label htmlFor="r1" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                <Camera className="mb-3 h-6 w-6" />
                Eligible Voter (with ID)
                <span className="text-xs text-muted-foreground mt-1 text-center">Register by uploading photos of your ID and proof of voting location.</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="phone" id="r2" className="peer sr-only" />
              <Label htmlFor="r2" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                <Phone className="mb-3 h-6 w-6" />
                General User
                <span className="text-xs text-muted-foreground mt-1 text-center">Register using your email and phone number with SMS verification.</span>
              </Label>
            </div>
          </RadioGroup>
        ) : (
          <>
            {registrationType === 'photo' ? <PhotoRegistrationForm /> : <PhoneRegistrationForm />}
            <Button variant="link" size="sm" onClick={() => setRegistrationType(null)} className="mt-4 w-full">
              Back to registration selection
            </Button>
          </>
        )}
      </CardContent>

      <div className="mt-4 text-center text-sm">
        {t('register.have_account')}{' '}
        <Link href="/login" className="underline">
          {t('register.login_button')}
        </Link>
      </div>
    </>
  );
}
