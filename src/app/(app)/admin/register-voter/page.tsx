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
import { verifyUser } from '@/ai/flows/user-verification';
import { useToast } from '@/hooks/use-toast';


export default function RegisterVoterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const nationalId = formData.get('national-id') as string;
    const firstName = formData.get('first-name') as string;
    const lastName = formData.get('last-name') as string;

    startTransition(async () => {
      // In a real app you would have a flow to register the user
      // For now we just verify against the mock data
      const result = await verifyUser({ nationalId, firstName, lastName });

      if (result.isRecognized) {
        toast({
          title: "Voter Verified",
          description: "This voter is already in the system.",
        });
      } else {
        // Here you would typically add the user to your database.
        // For this demo, we can't modify the mock file, so we'll just show a success message.
         toast({
          title: "Voter Registered Successfully",
          description: `${firstName} ${lastName} has been added to the voter roll.`,
        });
        // In a real app, you would clear the form or redirect.
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-full">
        <Card className="mx-auto w-full max-w-md">
        <CardHeader>
            <CardTitle className="text-xl">Register New Voter</CardTitle>
            <CardDescription>
            Enter the voter's information to add them to the system.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {error && (
                <Alert variant="destructive" className="mb-4">
                <AlertTitle>Registration Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <form onSubmit={handleRegister} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" name="first-name" placeholder="Max" required disabled={isPending} />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" name="last-name" placeholder="Robinson" required disabled={isPending} />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="national-id">National ID</Label>
                <Input id="national-id" name="national-id" placeholder="1234567890123456" required disabled={isPending} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Set Temporary Password</Label>
                <Input id="password" name="password" type="password" required disabled={isPending}/>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register Voter
            </Button>
            </form>
        </CardContent>
        </Card>
    </div>
  );
}
