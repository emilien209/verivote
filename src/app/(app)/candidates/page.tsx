import { CandidateSummary } from './candidate-summary';
import type { Candidate } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const MOCK_CANDIDATES: Candidate[] = [];

export default function CandidatesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meet the Candidates</h1>
        <p className="text-muted-foreground">
          Learn about the candidates and their platforms for the Presidential Election 2024.
        </p>
      </div>

      <CandidateSummary candidates={MOCK_CANDIDATES} />
    </div>
  );
}
