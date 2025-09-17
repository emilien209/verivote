import { getCandidates } from '@/app/(app)/candidates/candidate-actions';
import { CastVoteClient } from './cast-vote-client';

export default async function OfficialCastVotePage() {
  const candidates = await getCandidates();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facilitate Voting</h1>
        <p className="text-muted-foreground">
          Verify a voter's eligibility using their National ID to help them cast their vote.
        </p>
      </div>
      <CastVoteClient candidates={candidates} />
    </div>
  );
}
