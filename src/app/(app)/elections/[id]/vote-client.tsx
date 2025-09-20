'use client';
import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import type { Candidate } from '@/lib/types';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { castVote } from './actions';
import { useAuth } from '@/hooks/use-auth';

export function VoteClient({ candidates, onVoteCasted, voterId: assistedVoterId, voterName: assistedVoterName }: { candidates: Candidate[], onVoteCasted?: () => void; voterId?: string; voterName?: string; }) {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [voterId, setVoterId] = useState<string | null>(assistedVoterId || null);
  const [voterName, setVoterName] = useState<string | null>(assistedVoterName || null);
  const [hasVoted, setHasVoted] = useState<boolean | null>(null); // null means loading
  const [isCasting, setIsCasting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const electionId = 'presidential-2024';

  useEffect(() => {
    const effectiveVoterId = assistedVoterId || user?.uid;
    if (effectiveVoterId) {
      setVoterId(effectiveVoterId);
      const votedStatus = localStorage.getItem(`hasVoted_${electionId}_${effectiveVoterId}`);
      if (votedStatus === 'true') {
        setHasVoted(true);
      } else {
        setHasVoted(false);
      }
    }

    if (!assistedVoterName) {
      const name = localStorage.getItem('voterName');
      setVoterName(name || user?.displayName || 'Voter');
    }
    
  }, [user, assistedVoterId, assistedVoterName]);

  const handleVote = async () => {
    if (!selectedCandidate || !voterId) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      return;
    }
    setIsCasting(true);
    
    const candidateDetails = candidates.find(c => c.id === selectedCandidate);
    if (!candidateDetails) return;

    const result = await castVote({
      voterId,
      electionId,
      candidateId: selectedCandidate,
      candidateName: candidateDetails.name,
    });

    setIsCasting(false);

    if (result.success) {
        if (onVoteCasted) {
            onVoteCasted();
             toast({
                title: 'Vote Cast Successfully!',
                description: `Vote for ${voterName} has been securely recorded.`,
                action: <CheckCircle className="text-green-500" />,
            });
        } else {
            localStorage.setItem(`hasVoted_${electionId}_${voterId}`, 'true');
            setHasVoted(true);
             toast({
                title: 'Vote Cast Successfully!',
                description: 'Your vote has been securely recorded. Thank you for participating.',
                action: <CheckCircle className="text-green-500" />,
            });
        }
    } else {
        toast({
            title: 'Vote Failed',
            description: result.error,
            variant: 'destructive',
        });
         if(result.error?.includes("already voted")) {
            localStorage.setItem(`hasVoted_${electionId}_${voterId}`, 'true');
            setHasVoted(true);
        }
    }
  };

  const candidateDetails = candidates.find(c => c.id === selectedCandidate);

  if (hasVoted === null) {
      return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (hasVoted) {
    return (
        <Alert variant="default" className="max-w-md mx-auto">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Thank You for Voting!</AlertTitle>
            <AlertDescription>
                You have already cast your vote in this election. Each voter is allowed only one vote.
            </AlertDescription>
        </Alert>
    );
  }

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
            <Button size="lg" disabled={!selectedCandidate || !voterName || isCasting} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {isCasting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
              <AlertDialogAction onClick={handleVote} disabled={isCasting} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isCasting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirm Vote
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
