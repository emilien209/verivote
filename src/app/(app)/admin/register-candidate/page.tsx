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
import { Textarea } from '@/components/ui/textarea';
import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addCandidate } from './actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';


export default function RegisterCandidatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const party = formData.get('party') as string;
    const platform = formData.get('platform') as string;
    
    // For now, let's use a placeholder image.
    // In a real app, you would handle file uploads.
    const randomImage = PlaceHolderImages[Math.floor(Math.random() * 4)];


    startTransition(async () => {
      const result = await addCandidate({ 
        name, 
        party, 
        platform, 
        imageUrl: randomImage.imageUrl, 
        imageHint: randomImage.imageHint 
      });

      if (result.success) {
        toast({
          title: "Candidate Registered Successfully",
          description: `${name} (${party}) has been added to the candidate list.`,
        });
        (e.target as HTMLFormElement).reset();
        router.push('/candidates');
      } else {
        toast({
          title: "Registration Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-full">
        <Card className="mx-auto w-full max-w-lg">
        <CardHeader>
            <CardTitle className="text-xl">Register New Candidate</CardTitle>
            <CardDescription>
            Enter the candidate's information to add them to the election.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleRegister} className="grid gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="name">Candidate Name</Label>
                  <Input id="name" name="name" placeholder="e.g., Alice Johnson" required disabled={isPending} />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="party">Political Party</Label>
                  <Input id="party" name="party" placeholder="e.g., Unity Party" required disabled={isPending} />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="platform">Platform Summary</Label>
                  <Textarea id="platform" name="platform" placeholder="Summarize the candidate's main platform points." required disabled={isPending} />
              </div>
              {/* Note: File upload is complex for this environment. We'll assign a random placeholder. */}
               <div className="grid gap-2">
                  <Label htmlFor="photo">Candidate Photo</Label>
                  <Input id="photo" name="photo" type="file" disabled />
                   <p className="text-xs text-muted-foreground">Photo upload is disabled. A placeholder will be used.</p>
              </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register Candidate
            </Button>
            </form>
        </CardContent>
        </Card>
    </div>
  );
}
