import { CandidateSummary } from './candidate-summary';
import { getCandidates } from './candidate-actions';

export const revalidate = 0; // Ensure this page is always dynamic

export default async function CandidatesPage() {
  const candidates = await getCandidates();
  
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meet the Candidates</h1>
        <p className="text-muted-foreground">
          Learn about the candidates and their platforms for the Presidential Election 2024.
        </p>
      </div>

      {candidates.length > 0 ? (
         <CandidateSummary candidates={candidates} />
      ) : (
        <p className="text-center text-muted-foreground mt-8">No candidates have been registered for this election yet.</p>
      )}
    </div>
  );
}
