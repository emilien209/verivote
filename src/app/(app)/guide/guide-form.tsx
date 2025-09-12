'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { getGuideAnswer } from './actions';
import { Loader2, BookOpenCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function GuideForm() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setAnswer(null);

    startTransition(async () => {
      const result = await getGuideAnswer(query);
      if (result.success) {
        setAnswer(result.data || 'No answer was provided.');
      } else {
        setError(result.error || 'An unknown error occurred.');
      }
    });
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="e.g., How do I check my voter registration status?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={3}
          className="bg-card"
        />
        <Button type="submit" disabled={isPending || !query} className="bg-primary hover:bg-primary/90">
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BookOpenCheck className="mr-2 h-4 w-4" />
          )}
          Ask the Guide
        </Button>
      </form>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {answer && (
        <Card>
          <CardHeader>
            <CardTitle>Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{answer}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
