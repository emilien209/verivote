'use client';
import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCandidateSummary } from './actions';
import type { Candidate } from '@/lib/types';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function CandidateSummary({ candidates }: { candidates: Candidate[] }) {
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState<string | null>(null);
  const [comparison, setComparison] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {candidates.map(candidate => (
          <Card key={candidate.id}>
            <CardHeader className="items-center">
              <Image
                src={candidate.imageUrl}
                alt={`Portrait of ${candidate.name}`}
                width={100}
                height={100}
                className="rounded-full border-4 border-muted"
                data-ai-hint={candidate.imageHint}
              />
            </CardHeader>
            <CardContent className="text-center">
              <CardTitle>{candidate.name}</CardTitle>
              <CardDescription>{candidate.party}</CardDescription>
              <p className="mt-2 text-sm text-muted-foreground">{candidate.platform}</p>
            </CardContent>
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
