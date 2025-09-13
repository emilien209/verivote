'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import type { Candidate } from '@/lib/types';
import { CheckCircle } from 'lucide-react';

export function VoteClient({ candidates }: { candidates: Candidate[] }) {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [voterName, setVoterName] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const name = localStorage.getItem('voterName');
    if (name) {
      setVoterName(name);
    } else {
      toast({
        title: 'Error',
        description: 'Could not identify voter. Please log in again.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleVote = () => {
    if (!selectedCandidate) {
      toast({
        title: 'No candidate selected',
        description: 'Please select a candidate before casting your vote.',
        variant: 'destructive',
      });
      return;
    }
    // In a real app, this would involve encryption and a secure transaction
    console.log(`Voted for candidate: ${selectedCandidate}`);

    toast({
        title: 'Vote Cast Successfully!',
        description: 'Your vote has been securely recorded. Thank you for participating.',
        action: <CheckCircle className="text-green-500" />,
    });
  };

  const candidateDetails = candidates.find(c => c.id === selectedCandidate);

  return (
    <div>
      <RadioGroup value={selectedCandidate || ''} onValueChange={setSelectedCandidate} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {candidates.map((candidate) => (
          <Label
            key={candidate.id}
            htmlFor={candidate.id}
            className={`relative rounded-lg border-2 bg-card p-4 transition-all hover:border-primary/80 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/50 cursor-pointer`}
          >
            <RadioGroupItem value={candidate.id} id={candidate.id} className="sr-only" />
            <div className="mb-4 flex flex-col items-center">
              <Image
                src={candidate.imageUrl}
                alt={candidate.name}
                width={128}
                height={128}
                className="rounded-full"
                data-ai-hint={candidate.imageHint}
              />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold">{candidate.name}</h3>
              <p className="text-sm text-muted-foreground">{candidate.party}</p>
              <p className="mt-2 text-xs">{candidate.platform}</p>
            </div>
          </Label>
        ))}
      </RadioGroup>

      <div className="mt-8 flex justify-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="lg" disabled={!selectedCandidate || !voterName} className="bg-accent text-accent-foreground hover:bg-accent/90">
              Cast Your Vote
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
              <AlertDialogDescription>
                Hello, <span className="font-bold">{voterName}</span>. You are about to cast your vote for{' '}
                <span className="font-bold">{candidateDetails?.name}</span> of the{' '}
                <span className="font-bold">{candidateDetails?.party}</span>.
                This action is final and cannot be undone. Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleVote} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Confirm Vote
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
