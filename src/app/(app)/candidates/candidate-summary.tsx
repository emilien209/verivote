'use client';
import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { getCandidateSummary } from './actions';
import { removeCandidate } from '@/app/(app)/admin/register-candidate/actions';
import type { Candidate } from '@/lib/types';
import { Loader2, Wand2, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { usePathname } from 'next/navigation';

export function CandidateSummary({ candidates }: { candidates: Candidate[] }) {
  const { toast } = useToast();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isRemoving, startRemoveTransition] = useTransition();
  const [summary, setSummary] = useState<string | null>(null);
  const [comparison, setComparison] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'admin') {
        setIsAdmin(true);
      }
    }
  }, []);

  const handleGenerateSummary = () => {
    startTransition(async () => {
      setError(null);
      const candidatesInfo = {
        candidatesInfo: candidates.map(c => ({ name: c.name, platform: c.platform })),
      };
      const result = await getCandidateSummary(candidatesInfo);
      if (result.success && result.data) {
        setSummary(result.data.summary);
        setComparison(result.data.comparisonChart);
      } else {
        setError(result.error || 'An unknown error occurred.');
      }
    });
  };
  
  const handleRemoveCandidate = (candidateId: string, candidateName: string) => {
    startRemoveTransition(async () => {
      const result = await removeCandidate(candidateId);
      if (result.success) {
        toast({
          title: "Candidate Removed",
          description: `${candidateName} has been removed from the list.`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || 'Failed to remove candidate.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {candidates.map(candidate => (
          <Card key={candidate.id} className="flex flex-col">
            <CardHeader className="items-center">
              {/* Image removed */}
            </CardHeader>
            <CardContent className="text-center flex-grow">
              <CardTitle>{candidate.name}</CardTitle>
              <CardDescription>{candidate.party}</CardDescription>
              <p className="mt-2 text-sm text-muted-foreground">{candidate.platform}</p>
            </CardContent>
            {isAdmin && (
               <CardFooter>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => handleRemoveCandidate(candidate.id, candidate.name)}
                    disabled={isRemoving}
                  >
                    {isRemoving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Remove
                  </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      <div className="flex justify-center mb-8">
        <Button onClick={handleGenerateSummary} disabled={isPending} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate AI Summary & Comparison
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {summary && (
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Summary</CardTitle>
              <CardDescription>A concise overview of all candidate platforms.</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {summary}
            </CardContent>
          </Card>
        )}
        {comparison && (
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Comparison</CardTitle>
              <CardDescription>A chart comparing key policy differences.</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {comparison}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
