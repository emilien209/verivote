import { CandidateSummary } from './candidate-summary';
import type { Candidate } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const MOCK_CANDIDATES: Candidate[] = [
  { id: 'c1', name: 'Alice Johnson', party: 'Unity Party', platform: 'Our platform is built on three pillars: strengthening the economy through targeted investments in technology and infrastructure, expanding access to quality education for all ages, and ensuring affordable healthcare is a right, not a privilege. We will foster innovation, create jobs, and build a sustainable future for the next generation.', imageUrl: PlaceHolderImages.find(p => p.id === 'candidate-1')?.imageUrl || '', imageHint: 'woman portrait' },
  { id: 'c2', name: 'Bob Williams', party: 'Progress Alliance', platform: 'We are committed to comprehensive social reform. This includes increasing the minimum wage, protecting our environment with green energy policies, investing in public transportation, and ensuring robust social safety nets for our most vulnerable citizens. Our goal is a fair and equitable society for everyone.', imageUrl: PlaceHolderImages.find(p => p.id === 'candidate-2')?.imageUrl || '', imageHint: 'man portrait' },
  { id: 'c3', name: 'Carol Davis', party: 'Heritage Front', platform: 'Our focus is on preserving national sovereignty and cultural heritage. We advocate for secure borders, a strong national defense, and policies that prioritize our citizens first. We believe in fiscal responsibility, reducing government spending, and promoting traditional family values to strengthen our communities.', imageUrl: PlaceHolderImages.find(p => p.id === 'candidate-3')?.imageUrl || '', imageHint: 'woman smiling' },
  { id: 'c4', name: 'David Garcia', party: 'Liberty Coalition', platform: 'We champion individual liberty, free markets, and minimal government. Our platform calls for lower taxes, deregulation to spur economic growth, and the protection of personal freedoms. We believe that the government that governs least, governs best, empowering individuals to achieve their full potential.', imageUrl: PlaceHolderImages.find(p => p.id === 'candidate-4')?.imageUrl || '', imageHint: 'man glasses' },
];

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
