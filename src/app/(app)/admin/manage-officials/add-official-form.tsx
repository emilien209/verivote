'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { handleAddOfficial } from './actions';

export function AddOfficialForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    startTransition(async () => {
      const result = await handleAddOfficial({ name, email, password });

      if (result.success) {
        toast({
          title: "Official Added",
          description: `${name} has been authorized.`,
        });
        form.reset();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" placeholder="e.g., Jane Doe" required disabled={isPending} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" name="email" type="email" placeholder="e.g., jane.d@verivote.gov" required disabled={isPending} />
      </div>
       <div className="grid gap-2">
        <Label htmlFor="password">Set Temporary Password</Label>
        <Input id="password" name="password" type="password" required disabled={isPending} />
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Add Official
      </Button>
    </form>
  );
}
