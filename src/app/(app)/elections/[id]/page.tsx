import type { Election, Candidate } from '@/lib/types';
import { notFound } from 'next/navigation';
import { VoteClient } from './vote-client';
import { getCandidates } from '@/app/(app)/candidates/candidate-actions';

async function getElectionData(id: string): Promise<Election | null> {
  if (id === 'presidential-2024') {
     const candidates = await getCandidates();
    return {
        id: 'presidential-2024',
        title: 'Presidential Election 2024',
        description: 'Vote for the next president to lead the nation for the upcoming term.',
        startDate: '2024-10-01',
        endDate: '2024-10-15',
        status: 'Ongoing',
        candidates: candidates,
    };
  }
  return null;
}

export default async function ElectionPage({ params }: { params: { id:string } }) {
  const election = await getElectionData(params.id);

  if (!election) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{election.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{election.description}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Voting Period: {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
        </p>
      </div>

      {election.candidates.length > 0 ? (
        <VoteClient candidates={election.candidates} />
      ) : (
        <p className="text-center text-muted-foreground mt-8">There are currently no candidates registered for this election.</p>
      )}
    </div>
  );
}
