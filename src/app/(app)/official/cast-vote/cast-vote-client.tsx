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
import { VoteClient } from '@/app/(app)/elections/[id]/vote-client';
import type { Candidate } from '@/lib/types';
import { getUserById } from './actions';

enum VoterState {
  IDLE,
  LOOKUP,
  NOT_FOUND,
  READY_TO_VOTE,
}

export function CastVoteClient({ candidates }: { candidates: Candidate[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [voter, setVoter] = useState<{ id: string; name: string; nationalId: string } | null>(null);
  const [nationalIdInput, setNationalIdInput] = useState('');
  const [voterState, setVoterState] = useState<VoterState>(VoterState.IDLE);
  const electionId = 'presidential-2024';

  const handleVoterLookup = () => {
    setError(null);
    setVoter(null);
    setVoterState(VoterState.LOOKUP);
    startTransition(async () => {
      const result = await getUserById({ nationalId: nationalIdInput });

      if (result.success && result.user) {
        // Double-check local storage just in case this browser was used for this voter
        const hasVotedLocally = localStorage.getItem(`hasVoted_${electionId}_${result.user.id}`);
        if (hasVotedLocally) {
            setError('This voter has already cast their ballot from this station.');
            setVoterState(VoterState.IDLE);
            return;
        }

        setVoter({ id: result.user.id, name: result.user.fullName, nationalId: nationalIdInput });
        setVoterState(VoterState.READY_TO_VOTE);
      } else {
        setError(result.error || 'This National ID is not found in the voter database.');
        setVoterState(VoterState.NOT_FOUND);
      }
    });
  };
  
  const handleVoteCasted = () => {
    if(voter) {
        // Record that this voter has voted at this station to prevent re-verification in the same session
        localStorage.setItem(`hasVoted_${electionId}_${voter.id}`, 'true');
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
                     {candidates.length > 0 ? (
                        <VoteClient candidates={candidates} onVoteCasted={handleVoteCasted} voterId={voter?.id} voterName={voter?.name || ''} />
                    ) : (
                        <Card className="mx-auto w-full max-w-md text-center">
                            <CardHeader>
                                <CardTitle>No Candidates Available</CardTitle>
                                <CardDescription>
                                    There are no candidates registered for this election yet. Please contact the administrator.
                                </CardDescription>
                            </CardHeader>
                             <CardContent>
                                <Button onClick={() => setVoterState(VoterState.IDLE)} className="w-full">Go Back</Button>
                            </CardContent>
                        </Card>
                    )}
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
                        <AlertTitle>Verification Error</AlertTitle>
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


  return renderContent();
}
