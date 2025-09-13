'use client';

import { useState, useTransition } from 'react';
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
import { Loader2, UserCheck, UserPlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { checkUserRecognition } from '@/app/(auth)/login/actions';
import { VoteClient } from '@/app/(app)/elections/[id]/vote-client';
import type { Candidate } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

const MOCK_CANDIDATES: Candidate[] = [
  { id: 'c1', name: 'Alice Johnson', party: 'Unity Party', platform: 'Focuses on economic growth and technological innovation.', imageUrl: PlaceHolderImages.find(p => p.id === 'candidate-1')?.imageUrl || '', imageHint: 'woman portrait' },
  { id: 'c2', name: 'Bob Williams', party: 'Progress Alliance', platform: 'Advocates for social welfare programs and environmental protection.', imageUrl: PlaceHolderImages.find(p => p.id === 'candidate-2')?.imageUrl || '', imageHint: 'man portrait' },
  { id: 'c3', name: 'Carol Davis', party: 'Heritage Front', platform: 'Promotes traditional values and national sovereignty.', imageUrl: PlaceHolderImages.find(p => p.id === 'candidate-3')?.imageUrl || '', imageHint: 'woman smiling' },
  { id: 'c4', name: 'David Garcia', party: 'Liberty Coalition', platform: 'Stands for individual freedoms and minimal government intervention.', imageUrl: PlaceHolderImages.find(p => p.id === 'candidate-4')?.imageUrl || '', imageHint: 'man glasses' },
];

enum VoterState {
  IDLE,
  LOOKUP,
  NOT_FOUND,
  READY_TO_VOTE,
  REGISTERING,
}

export default function OfficialCastVotePage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [voter, setVoter] = useState<{ name: string; nationalId: string } | null>(null);
  const [nationalIdInput, setNationalIdInput] = useState('');
  const [voterState, setVoterState] = useState<VoterState>(VoterState.IDLE);

  const handleVoterLookup = () => {
    setError(null);
    setVoter(null);
    setVoterState(VoterState.LOOKUP);
    startTransition(async () => {
      const result = await checkUserRecognition(nationalIdInput);

      if (result.success && result.data?.isRecognized && result.data.user) {
        const hasVoted = localStorage.getItem(`hasVoted_${result.data.user.firstName}_${result.data.user.lastName}`);
        if (hasVoted) {
            setError('This voter has already cast their ballot for this election.');
            setVoterState(VoterState.IDLE);
            return;
        }
        setVoter({ name: `${result.data.user.firstName} ${result.data.user.lastName}`, nationalId: nationalIdInput });
        setVoterState(VoterState.READY_TO_VOTE);
      } else {
        setError('Voter not found. You can register them now.');
        setVoterState(VoterState.NOT_FOUND);
      }
    });
  };

  const handleRegisterVoter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('first-name') as string;
    const lastName = formData.get('last-name') as string;

    startTransition(async () => {
        // In a real app, you would have a flow to register the user.
        // For this demo, we'll simulate it and proceed to voting.
        toast({
          title: "Voter Registered Successfully",
          description: `${firstName} ${lastName} has been added to the voter roll.`,
        });
        setVoter({ name: `${firstName} ${lastName}`, nationalId: nationalIdInput });
        setVoterState(VoterState.READY_TO_VOTE);
    });
  }
  
  const handleVoteCasted = () => {
    if(voter) {
        localStorage.setItem(`hasVoted_${voter.name.split(' ')[0]}_${voter.name.split(' ')[1]}`, 'true');
    }
    // Reset the page to be ready for the next voter
    setVoter(null);
    setNationalIdInput('');
    setError(null);
    setVoterState(VoterState.IDLE);
  }
  
  const renderContent = () => {
    switch(voterState) {
        case VoterState.READY_TO_VOTE:
            return (
                <div>
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold tracking-tight">Presidential Election 2024</h2>
                        <p className="text-muted-foreground">
                            Please assist <span className="font-bold">{voter?.name}</span> in casting their vote.
                        </p>
                    </div>
                    <VoteClient candidates={MOCK_CANDIDATES} onVoteCasted={handleVoteCasted} voterName={voter?.name || ''} />
                </div>
            );
        case VoterState.NOT_FOUND:
             return (
                 <Card className="mx-auto w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Register New Voter</CardTitle>
                        <CardDescription>
                        This National ID is not in the system. Please register the voter.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRegisterVoter} className="grid gap-4">
                             <div className="grid gap-2">
                                <Label htmlFor="national-id">National ID</Label>
                                <Input id="national-id" name="national-id" value={nationalIdInput} disabled />
                            </div>
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
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                                Register and Proceed to Vote
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )
        case VoterState.IDLE:
        case VoterState.LOOKUP:
        default:
            return (
                <Card className="mx-auto w-full max-w-md">
                <CardHeader>
                    <CardTitle>Voter Lookup</CardTitle>
                    <CardDescription>
                    Enter the voter's National ID to begin the voting process.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTitle>Notice</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    )}
                    <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="national-id">National ID</Label>
                        <Input
                        id="national-id"
                        name="national-id"
                        value={nationalIdInput}
                        onChange={(e) => setNationalIdInput(e.target.value)}
                        placeholder="1234567890123456"
                        required
                        disabled={isPending}
                        />
                    </div>
                    <Button onClick={handleVoterLookup} className="w-full" disabled={isPending || !nationalIdInput}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
                        Find Voter
                    </Button>
                    </div>
                </CardContent>
                </Card>
            )
    }
  }


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Register or Cast Vote</h1>
        <p className="text-muted-foreground">
          Enter the voter's National ID to begin the process.
        </p>
      </div>
      {renderContent()}
    </div>
  );
}
