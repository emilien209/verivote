import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Election, Candidate } from '@/lib/types';
import { notFound } from 'next/navigation';
import { VoteClient } from './vote-client';

const MOCK_CANDIDATES: Candidate[] = [
  { id: 'c1', name: 'Alice Johnson', party: 'Unity Party', platform: 'Focuses on economic growth and technological innovation.', imageUrl: PlaceHolderImages.find(p => p.id === 'candidate-1')?.imageUrl || '', imageHint: 'woman portrait' },
  { id: 'c2', name: 'Bob Williams', party: 'Progress Alliance', platform: 'Advocates for social welfare programs and environmental protection.', imageUrl: PlaceHolderImages.find(p => p.id === 'candidate-2')?.imageUrl || '', imageHint: 'man portrait' },
  { id: 'c3', name: 'Carol Davis', party: 'Heritage Front', platform: 'Promotes traditional values and national sovereignty.', imageUrl: PlaceHolderImages.find(p => p.id === 'candidate-3')?.imageUrl || '', imageHint: 'woman smiling' },
  { id: 'c4', name: 'David Garcia', party: 'Liberty Coalition', platform: 'Stands for individual freedoms and minimal government intervention.', imageUrl: PlaceHolderImages.find(p => p.id === 'candidate-4')?.imageUrl || '', imageHint: 'man glasses' },
];

const MOCK_ELECTION: Election = {
    id: 'presidential-2024',
    title: 'Presidential Election 2024',
    description: 'Vote for the next president to lead the nation for the upcoming term.',
    startDate: '2024-10-01',
    endDate: '2024-10-15',
    status: 'Ongoing',
    candidates: MOCK_CANDIDATES,
};

async function getElectionData(id: string): Promise<Election | null> {
  if (id === 'presidential-2024') {
    return MOCK_ELECTION;
  }
  return null;
}

export default async function ElectionPage({ params }: { params: { id: string } }) {
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

      <VoteClient candidates={election.candidates} />
    </div>
  );
}
