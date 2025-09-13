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
import { Loader2, UserCheck, UserX } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { verifyUser } from '@/ai/flows/user-verification';
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
      const hasVoted = localStorage.getItem(`hasVoted_${nationalIdInput}`);
      if (hasVoted) {
          setError('This voter has already cast their ballot for this election.');
          setVoterState(VoterState.IDLE);
          return;
      }
      
      const result = await verifyUser({ nationalId: nationalIdInput });

      if (result.isRecognized && result.user) {
        setVoter({ name: `${result.user.firstName} ${result.user.lastName}`, nationalId: nationalIdInput });
        setVoterState(VoterState.READY_TO_VOTE);
      } else {
        setError('This National ID is not found in the NIDA database. The voter is not eligible to vote.');
        setVoterState(VoterState.NOT_FOUND);
      }
    });
  };
  
  const handleVoteCasted = () => {
    if(voter) {
        // Record that this National ID has voted
        localStorage.setItem(`hasVoted_${voter.nationalId}`, 'true');
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
                            Please assist <span className="font-bold">{voter?.name}</span> (ID: {voter?.nationalId}) in casting their vote.
                        </p>
                    </div>
                    <VoteClient candidates={MOCK_CANDIDATES} onVoteCasted={handleVoteCasted} voterName={voter?.name || ''} />
                </div>
            );
        case VoterState.NOT_FOUND:
             return (
                 <Card className="mx-auto w-full max-w-md">
                    <CardHeader className="items-center text-center">
                        <UserX className="h-12 w-12 text-destructive" />
                        <CardTitle>Voter Not Found</CardTitle>
                        <CardDescription>
                        {error}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => setVoterState(VoterState.IDLE)} className="w-full">Try Another ID</Button>
                    </CardContent>
                </Card>
            )
        case VoterState.IDLE:
        case VoterState.LOOKUP:
        default:
            return (
                <Card className="mx-auto w-full max-w-md">
                <CardHeader>
                    <CardTitle>Voter Verification</CardTitle>
                    <CardDescription>
                    Enter the voter's National ID to check their eligibility and proceed with voting.
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
                        Verify Voter
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
        <h1 className="text-3xl font-bold tracking-tight">Facilitate Voting</h1>
        <p className="text-muted-foreground">
          Verify a voter's eligibility using their National ID to help them cast their vote.
        </p>
      </div>
      {renderContent()}
    </div>
  );
}
